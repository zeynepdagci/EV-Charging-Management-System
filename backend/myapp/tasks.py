from celery import shared_task
from django.utils.timezone import now
from myapp.models import Reservation
from datetime import timedelta
import logging
from django.db import transaction

logger = logging.getLogger(__name__)


@shared_task
def cleanup_unpaid_reservation(reservation_id):
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
