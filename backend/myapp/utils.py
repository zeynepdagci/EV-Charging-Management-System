import requests
import logging
from django.conf import settings
from typing import Tuple, Optional

from myapp.models import Reservation

logger = logging.getLogger(__name__)


def get_coordinates_from_address(address: str) -> Optional[Tuple[float, float]]:
    API_URL = settings.OPENCAGE_URL
    API_KEY = settings.OPENCAGE_API_KEY

    try:
        response = requests.get(API_URL, params={"q": address, "key": API_KEY})
        response_data = response.json()
        if response_data.get("results"):
            location = response_data["results"][0]["geometry"]
            return round(location["lat"], 6), round(location["lng"], 6)
    except Exception as e:
        logger.error(f"Error fetching coordinates for address {address}: {e}")

    return None
