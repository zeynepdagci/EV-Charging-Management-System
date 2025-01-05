from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils.timezone import now
from myapp.models import NotificationRequest, Reservation
from datetime import timedelta
import logging
from django.db import transaction

logger = logging.getLogger(__name__)


@shared_task
def cleanup_unpaid_reservation(reservation_id):
    logger.info("Running cleanup_unpaid_reservation task")
    try:
        with transaction.atomic():
            reservation = Reservation.objects.get(id=reservation_id, is_paid=False)
            charging_station = reservation.charging_station

            if reservation.created_at + timedelta(minutes=30) < now():
                reservation.delete()

                charging_station.availability_status = "available"
                charging_station.save()

                logger.info(f"Deleted unpaid reservation with ID: {reservation_id}")
            else:
                logger.info(
                    f"Reservation with ID: {reservation_id} is still within the grace period."
                )
    except Reservation.DoesNotExist:
        logger.info(f"Reservation with ID: {reservation_id} already deleted or paid.")


@shared_task
def send_availability_notification(notification_id):
    logger.info("Running send_availability_notification task")
    try:
        notification = NotificationRequest.objects.get(id=notification_id)
        user = notification.user
        charging_station = notification.charging_station
    except NotificationRequest.DoesNotExist:
        logger.error(f"Notification request with ID: {notification_id} not found.")

    try:
        send_mail(
            subject="Charging Station Available",
            message=f"The charging station at {charging_station.location} is now available for booking.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
    except Exception as e:
        logger.error(f"Error sending notification email: {e}")

    notification.delete()
