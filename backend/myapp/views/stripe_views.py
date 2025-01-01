import stripe
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from myapp.models import Reservation, ChargingStation
from myapp.tasks import cleanup_unpaid_reservation
from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import datetime, timedelta
from django.utils.timezone import now
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Configure Stripe with the secret key
stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        charging_station_id = request.data.get("charging_station_id")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")
        user = request.user

        # Lock the charging station row to prevent concurrent modifications
        charging_station = ChargingStation.objects.select_for_update().get(
            station_id=charging_station_id
        )

        # Check if the charging station is already reserved during the requested time
        overlapping_reservations = Reservation.objects.filter(
            charging_station=charging_station,
            start_time__lt=end_time,
            end_time__gt=start_time,
        )
        if overlapping_reservations.exists():
            return Response(
                {"error": "The selected charging station is no longer available."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate the amount
        duration = (
            datetime.fromisoformat(end_time) - datetime.fromisoformat(start_time)
        ).total_seconds() / 3600
        price_per_kwh = float(charging_station.price_per_kwh)
        power_capacity = float(charging_station.power_capacity)

        total_energy = power_capacity * duration
        total_amount = int(total_energy * price_per_kwh * 100)  # Amount in cents

        # Create the reservation
        reservation = Reservation.objects.create(
            charging_station=charging_station,
            user=user,
            start_time=datetime.fromisoformat(start_time),
            end_time=datetime.fromisoformat(end_time),
            is_paid=False,
        )
        logger.info(f"Created reservation: {reservation.id}")

        charging_station.availability_status = "unavailable"
        charging_station.save()

        # Schedule the cleanup task
        try:
            cleanup_unpaid_reservation.apply_async(
                args=[reservation.id], countdown=1800
            )
        except Exception as e:
            logger.error(f"Failed to schedule cleanup task: {e}")

        try:
            # Create a Checkout Session
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "gbp",
                            "product_data": {
                                "name": f"Reservation for {charging_station.location}",
                            },
                            "unit_amount": total_amount,
                        },
                        "quantity": 1,
                    },
                ],
                mode="payment",
                success_url="http://localhost:3000/?success=true",
                cancel_url="http://localhost:3000/?canceled=true",
                metadata={"reservation_id": reservation.id},
                adaptive_pricing={"enabled": True},
            )
            return Response({"url": session.url}, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        return JsonResponse({"error": str(e)}, status=400)

    # Handle the payment_intent.succeeded event

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session["metadata"]

        # Extract reservation details from metadata
        reservation_id = metadata.get("reservation_id")
        logger.info(f"Reservation ID: {reservation_id}")

        # Lock the charging station to finalize the reservation
        with transaction.atomic():
            reservation = Reservation.objects.select_for_update().get(id=reservation_id)
            reservation.is_paid = True
            reservation.save()

    return JsonResponse({"status": "success"}, status=200)
