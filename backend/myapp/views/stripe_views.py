import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from myapp.models import Reservation, ChargingStation
from myapp.serializers import ReservationSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Configure Stripe with the secret key
stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateStripePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Get data from the request
        reservation_id = request.data.get("reservation_id")

        # Ensure reservation exists and belongs to the user
        reservation = get_object_or_404(
            Reservation, id=reservation_id, user=request.user
        )

        # Calculate the amount
        charging_station = reservation.charging_station
        price_per_kwh = charging_station.price_per_kwh
        duration = (
            reservation.end_time - reservation.start_time
        ).total_seconds() / 3600
        total_energy = charging_station.power_capacity * duration
        total_amount = total_energy * price_per_kwh * 100  # Amount in pence

        try:
            # Create a Stripe Payment Intent
            payment_intent = stripe.PaymentIntent.create(
                amount=total_amount,  # Amount in cents
                currency="gbp",  # Currency
                metadata={"reservation_id": reservation.id},
                description=f"Payment for reservation {reservation.id} at {charging_station.name}",
            )
            return Response(
                {"client_secret": payment_intent["client_secret"]},
                status=status.HTTP_200_OK,
            )
        except stripe.error.StripeError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = (
        "whsec_0OKWCuyaD7GXSdMXEbJ3dw9ScDhZzeCE"  # Set this in Stripe Dashboard
    )
    event = None

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({"error": "Invalid signature"}, status=400)

    # Handle the payment_intent.succeeded event
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        reservation_id = payment_intent["metadata"]["reservation_id"]

        # Mark the reservation as paid
        reservation = get_object_or_404(Reservation, id=reservation_id)
        reservation.is_paid = True
        reservation.save()

    return JsonResponse({"status": "success"}, status=200)
