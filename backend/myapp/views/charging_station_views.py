from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from myapp.models import UserProfile
from myapp.serializers import ChargingStationSerializer
import logging

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
        serializer = ChargingStationSerializer(data=request.data)
        if serializer.is_valid():
            # Set operator to the current seller
            serializer.save(operator=user_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
