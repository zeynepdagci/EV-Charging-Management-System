from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from myapp.models import Payment, Reservation
from myapp.serializers import PaymentSerializer


class UserPaymentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).order_by("-payment_date")
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        reservation_id = request.data.get("reservation_id")
        amount = request.data.get("amount")

        reservation = get_object_or_404(
            Reservation, id=reservation_id, user=request.user
        )

        if reservation.is_paid:
            return Response(
                {"error": "This reservation has already been paid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the payment record
        payment = Payment.objects.create(
            user=request.user,
            reservation=reservation,
            amount=amount,
            location=reservation.charging_station.location,
            start_time=reservation.start_time,
            end_time=reservation.end_time,
        )

        # Mark reservation as paid
        reservation.is_paid = True
        reservation.save()

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
