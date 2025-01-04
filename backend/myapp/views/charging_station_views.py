from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from myapp.models import ChargingStation, UserProfile
from myapp.serializers import ChargingStationSerializer
from typing import Any
import logging
from myapp.utils.geocoding import get_coordinates_from_address

logger = logging.getLogger(__name__)


class AddChargingStationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Ensure the user is authenticated
        user_profile = request.user

        # Check if the user has a 'seller' role
        if user_profile.role != "seller":
            return Response(
                {"error": "You do not have permission to add a charging station."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Deserialize request data
        # serializer = ChargingStationSerializer(data=request.data)
        # if serializer.is_valid():
        #     address = serializer.validated_data.get("address")
        #     if address:
        #         coordinates = get_coordinates_from_address(address)
        #         if coordinates:
        #             serializer.validated_data["latitude"] = coordinates[0]
        #             serializer.validated_data["longitude"] = coordinates[1]
        #         else:
        #             return Response(
        #                 {"error": "Could not fetch coordinates for the given address."},
        #                 status=status.HTTP_400_BAD_REQUEST,
        #             )
        #     # Set operator to the current seller
        #     serializer.save(operator=user_profile)
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer_data = request.data.copy()  # Create a copy of request.data to modify

        # Perform address-to-coordinate conversion before serialization
        location = serializer_data.get("location")

        if location:
            coordinates = get_coordinates_from_address(location)
            logger.warning(f"coordinates {coordinates}")
            if coordinates:
                serializer_data["latitude"] = coordinates[0]
                serializer_data["longitude"] = coordinates[1]
            else:
                return Response(
                    {"error": "Could not fetch coordinates for the given address."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            logger.warning("No address provided in the request.")

        serializer = ChargingStationSerializer(data=serializer_data)
        if serializer.is_valid():
            serializer.save(operator=request.user)
            logger.info(f"Charging station created: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Log serializer validation errors
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserChargingStationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Ensure the user is authenticated
        user_profile = request.user
        # Check if the user has a 'seller' role
        if user_profile.role != "seller":
            return Response(
                {
                    "error": "You do not have permission to fetch these charging stations."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Fetch all charging stations for the authenticated seller
        charging_stations = ChargingStation.objects.filter(operator=user_profile)

        # Serialize the charging station data
        serializer = ChargingStationSerializer(charging_stations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllChargingStationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch all charging stations
        charging_stations = ChargingStation.objects.all()

        # Serialize the charging station data
        serializer = ChargingStationSerializer(charging_stations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteChargingStationView(APIView):
    permission_classes: list[Any] = [permissions.IsAuthenticated]

    def delete(self, request: Any, station_id: int) -> Response:
        user_profile: UserProfile = request.user

        # Check role-based permission
        if user_profile.role != "seller":
            return Response(
                {
                    "error": "You do not have permission to delete this charging station."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Fetch and delete the charging station
        charging_station: ChargingStation = get_object_or_404(
            ChargingStation, station_id=station_id, operator=user_profile
        )
        charging_station.delete()
        logger.info(
            f"Charging station {station_id} deleted by user {user_profile.email}"
        )

        return Response(
            {"message": "Charging station deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class UpdateChargingStationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request: Any, station_id: int) -> Response:
        user_profile: UserProfile = request.user

        # Check role-based permission
        if user_profile.role != "seller":
            return Response(
                {
                    "error": "You do not have permission to update this charging station."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Fetch the charging station to be updated
        charging_station: ChargingStation = get_object_or_404(
            ChargingStation, station_id=station_id, operator=user_profile
        )

        # Deserialize and validate request data
        serializer = ChargingStationSerializer(
            charging_station, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            logger.info(
                f"Charging station {station_id} updated by user {user_profile.email}"
            )
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
