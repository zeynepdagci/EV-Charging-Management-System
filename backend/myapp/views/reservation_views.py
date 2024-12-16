from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from myapp.models import Reservation
from myapp.serializers import ReservationSerializer
from typing import Any
from django.shortcuts import get_object_or_404


class CreateReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_profile = request.user

        # Check if the user has a 'buyer' role
        if user_profile.role != "buyer":
            return Response(
                {"error": "You do not have permission to create a reservation."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            # Save the reservation and send updates
            serializer.save(user=user_profile, created_at=timezone.now())
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserReservationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Any) -> Response:
        # Ensure the user is authenticated
        user_profile = request.user

        # Check if the user has a 'buyer' role
        if user_profile.role != "buyer":
            return Response(
                {"error": "You do not have permission to create a reservation."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Fetch all reservations made by the authenticated user
        reservations = Reservation.objects.filter(user=user_profile)

        # Serialize the reservation data
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CancelReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request: Any, reservation_id: int) -> Response:
        user_profile = request.user

        # Fetch reservation and check ownership
        reservation = get_object_or_404(
            Reservation, id=reservation_id, user=user_profile
        )

        # Delete reservation
        reservation.delete()
        return Response(
            {"message": "Reservation canceled successfully."},
            status=status.HTTP_200_OK,
        )


class UpdateReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request: Any, reservation_id: int) -> Response:
        user_profile = request.user
        reservation = get_object_or_404(
            Reservation, id=reservation_id, user=user_profile
        )

        # Deserialize request
        serializer = ReservationSerializer(reservation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
