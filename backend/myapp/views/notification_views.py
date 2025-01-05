from datetime import timedelta
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from myapp.models import Reservation, ChargingStation, NotificationRequest
from myapp.tasks import send_availability_notification


class RequestNotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        charging_station_id = request.data.get("charging_station_id")
        user = request.user

        try:
            charging_station = ChargingStation.objects.get(
                station_id=charging_station_id
            )
        except ChargingStation.DoesNotExist:
            return Response(
                {"error": "Charging station not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        now_time = now()
        active_reservation = Reservation.objects.filter(
            charging_station=charging_station,
            start_time__lte=now_time,
            end_time__gte=now_time,
        ).first()

        if not active_reservation:
            return Response(
                {"message": "The charging station is currently available."},
                status=status.HTTP_200_OK,
            )

        notification_request = NotificationRequest.objects.create(
            user=user, charging_station=charging_station
        )

        send_availability_notification.apply_async(
            args=[notification_request.id],
            eta=active_reservation.end_time,
        )

        return Response(
            {
                "message": f"You will be notified when the station becomes available on {active_reservation.end_time}."
            },
            status=status.HTTP_201_CREATED,
        )
