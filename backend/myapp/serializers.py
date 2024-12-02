from rest_framework import serializers
from .models import ChargingStation


class ChargingStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargingStation
        fields = [
            "station_id",
            "location",
            "latitude",
            "longitude",
            "availability_status",
            "charging_speed",
            "power_capacity",
            "price_per_kwh",
            "connector_types",
        ]
        read_only_fields = ["operator"]
