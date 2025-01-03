from django.db import models
from django.utils import timezone
from django.db import IntegrityError
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import UserManager as _UserManager


class UserManager(_UserManager):
    def get_or_create_for_cognito(self, payload):
        cognito_id = payload["sub"]

        return self.get(user_id=cognito_id)


class UserProfile(AbstractBaseUser, PermissionsMixin):
    last_login = None
    password = None
    is_superuser = None

    user_id: models.CharField = models.CharField(
        max_length=255, unique=True
    )  # Stores Cognito User ID
    email: models.EmailField = models.EmailField(unique=True)
    first_name: models.CharField = models.CharField(max_length=255)
    last_name: models.CharField = models.CharField(max_length=255)
    role: models.CharField = models.CharField(
        max_length=20,
        choices=[("buyer", "Buyer"), ("seller", "Seller"), ("admin", "Admin")],
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()


class ChargingStation(models.Model):
    station_id: models.AutoField = models.AutoField(primary_key=True)
    location: models.CharField = models.CharField(
        max_length=255
    )  # General location info
    latitude: models.DecimalField = models.DecimalField(
        max_digits=20, decimal_places=20
    )  # Latitude
    longitude: models.DecimalField = models.DecimalField(
        max_digits=20, decimal_places=20
    )  # Longitude

    availability_status: models.CharField = models.CharField(
        max_length=20,
        choices=[
            ("available", "Available"),
            ("unavailable", "Unavailable"),
            ("out_of_order", "Out of Order"),
            ("maintenance", "Maintenance"),
        ],
        default="available",
    )
    charging_speed: models.CharField = models.CharField(
        max_length=20, choices=[("fast", "Fast"), ("slow", "Slow")], default="slow"
    )
    power_capacity: models.DecimalField = models.DecimalField(
        max_digits=5, decimal_places=2
    )  # Power capacity in kW
    price_per_kwh: models.DecimalField = models.DecimalField(
        max_digits=10, decimal_places=2
    )  # Pricing per kWh

    connector_types: models.CharField = models.CharField(
        max_length=100,
        choices=[
            ("type1", "Type 1"),
            ("type2", "Type 2"),
            ("ccs", "CCS"),
            ("chademo", "CHAdeMO"),
        ],
        default="type2",
    )
    operator: models.ForeignKey[UserProfile] = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="charging_stations",
        limit_choices_to={"role": "seller"},
    )

    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Station {self.station_id} at {self.location}"


class Reservation(models.Model):
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="reservations"
    )
    charging_station = models.ForeignKey(
        ChargingStation, on_delete=models.CASCADE, related_name="reservations"
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(default=timezone.now)
    is_paid = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Reservation by {self.user.email} at {self.charging_station.location} from {self.start_time} to {self.end_time}"

    def duration(self) -> int:
        """Returns the duration of the reservation in minutes."""
        delta = self.end_time - self.start_time
        return delta.total_seconds() // 60
