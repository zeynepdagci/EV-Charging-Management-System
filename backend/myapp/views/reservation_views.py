from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from myapp.models import Reservation, ChargingStation
from myapp.serializers import ReservationSerializer
from typing import Any
from django.shortcuts import get_object_or_404
from django.db.models import Count


class CreateReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_profile = request.user

        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user_profile, created_at=timezone.now())
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserReservationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: Any) -> Response:
        user_profile = request.user

        reservations = Reservation.objects.filter(user=user_profile)

        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CancelReservationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request: Any, reservation_id: int) -> Response:
        user_profile = request.user

        reservation = get_object_or_404(
            Reservation, id=reservation_id, user=user_profile
        )

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

        serializer = ReservationSerializer(reservation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MostVisitedStationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get the most visited charging station
        most_visited_station = (
            Reservation.objects.values("charging_station_id")
            .annotate(total_visits=Count("id"))
            .order_by("-total_visits")
            .first()
        )

        if most_visited_station:
            station_id = most_visited_station["charging_station_id"]
            station_details = (
                ChargingStation.objects.filter(station_id=station_id)
                .values(
                    "location",
                    "charging_speed",
                    "power_capacity",
                    "price_per_kwh",
                    "connector_types",
                )
                .first()
            )

            if station_details:
                # Merge visit count with station details
                return Response(
                    {
                        **station_details,
                        "visits": most_visited_station["total_visits"],
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "Charging station details not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"error": "No reservations found."}, status=status.HTTP_404_NOT_FOUND
            )


class GetAllReservationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
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

        return Response(grouped_reservations, status=status.HTTP_200_OK)
