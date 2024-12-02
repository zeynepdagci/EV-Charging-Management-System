from django.db import models


class UserProfile(models.Model):
    user_id: models.CharField = models.CharField(
        max_length=255, unique=True
    )  # Stores Cognito User ID
    email: models.EmailField = models.EmailField(unique=True)
    role: models.CharField = models.CharField(
        max_length=20,
        choices=[("buyer", "Buyer"), ("seller", "Seller"), ("admin", "Admin")],
    )


class ChargingStation(models.Model):
    station_id: models.AutoField = models.AutoField(primary_key=True)
    location: models.CharField = models.CharField(
        max_length=255
    )  # General location info
    latitude: models.DecimalField = models.DecimalField(
        max_digits=9, decimal_places=6
    )  # Latitude
    longitude: models.DecimalField = models.DecimalField(
        max_digits=9, decimal_places=6
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
