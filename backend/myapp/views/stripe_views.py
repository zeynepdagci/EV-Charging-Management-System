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
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Configure Stripe with the secret key
stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)


def get_all_reservations_for_all_charging_stations():
    reservations = Reservation.objects.values(
        "charging_station_id", "start_time", "end_time"
    )

    # Group reservations by charging station
    grouped_reservations = {}
    for res in reservations:
        station_id = res["charging_station_id"]
        if station_id not in grouped_reservations:
            grouped_reservations[station_id] = []
        grouped_reservations[station_id].append(
            {
                "start_time": res["start_time"].isoformat(),
                "end_time": res["end_time"].isoformat(),
            }
        )

    return grouped_reservations


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        charging_station_id = request.data.get("charging_station_id")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")
        user = request.user
        logger.info(f"{charging_station_id}, {start_time}, {end_time}, {user.id}")

        # Validate and create the reservation within a transaction
        try:
            with transaction.atomic():
                charging_station = ChargingStation.objects.select_for_update().get(
                    station_id=charging_station_id
                )

                # Check if the charging station is already reserved
                overlapping_reservations = Reservation.objects.filter(
                    charging_station=charging_station,
                    start_time__lt=datetime.fromisoformat(end_time),
                    end_time__gt=datetime.fromisoformat(start_time),
                )
                if overlapping_reservations.exists():
                    return Response(
                        {
                            "error": "The selected charging station is no longer available."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Calculate the reservation cost
                duration = (
                    datetime.fromisoformat(end_time)
                    - datetime.fromisoformat(start_time)
                ).total_seconds() / 3600
                price_per_kwh = float(charging_station.price_per_kwh)
                power_capacity = float(charging_station.power_capacity)
                total_energy = power_capacity * duration
                total_amount = int(
                    total_energy * price_per_kwh * 100
                )  # Amount in cents

                # Create the reservation
                reservation = Reservation.objects.create(
                    charging_station=charging_station,
                    user=user,
                    start_time=datetime.fromisoformat(start_time),
                    end_time=datetime.fromisoformat(end_time),
                    is_paid=False,
                )
                logger.info(f"Created reservation: {reservation.id}")

        except Exception as e:
            logger.error(f"Error during reservation creation: {e}")
            return Response(
                {"error": "An error occurred while creating the reservation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Notify all users about the update
        all_reservations = get_all_reservations_for_all_charging_stations()
        logger.info(f"Sending reservation update to all users: {all_reservations}")

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "reservations",
            {
                "type": "notify_reservation",
                "data": all_reservations,
            },
        )

        # Schedule cleanup task after reservation creation
        cleanup_unpaid_reservation.apply_async(args=[reservation.id], countdown=1800)

        # Create a Stripe Checkout Session
        try:
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
                success_url="https://ev-charging-management-system.vercel.app/",
                cancel_url="https://ev-charging-management-system.vercel.app/",
                metadata={"reservation_id": reservation.id},
            )
            logger.info(f"Created Stripe Checkout Session: {session.url}")
            return Response({"url": session.url}, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.error(f"Webhook error: {e}")
        return JsonResponse({"error": str(e)}, status=400)

    # Handle the payment_intent.succeeded event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})

        # Extract reservation details from metadata
        reservation_id = metadata.get("reservation_id")
        if not reservation_id:
            logger.error("Missing reservation ID in webhook metadata.")
            return JsonResponse({"error": "Missing reservation ID."}, status=400)

        # Finalize the reservation payment
        try:
            with transaction.atomic():
                reservation = Reservation.objects.select_for_update().get(
                    id=reservation_id
                )
                reservation.is_paid = True
                reservation.save()
                logger.info(f"Reservation {reservation_id} marked as paid.")
        except Exception as e:
            logger.error(f"Error finalizing reservation: {e}")
            return JsonResponse({"error": "An error occurred."}, status=500)

    return JsonResponse({"status": "success"}, status=200)
