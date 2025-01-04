import requests
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)


def get_coordinates_from_address(address: str) -> Optional[Tuple[float, float]]:
    API_URL = "https://api.opencagedata.com/geocode/v1/json"
    API_KEY = "43960256a12f41bfbe540100a73617ee"

    try:
        response = requests.get(API_URL, params={"q": address, "key": API_KEY})
        response_data = response.json()
        if response_data.get("results"):
            location = response_data["results"][0]["geometry"]
            # Return latitude and longitude with 6 decimal places
            return round(location["lat"], 6), round(location["lng"], 6)
    except Exception as e:
        logger.error(f"Error fetching coordinates for address {address}: {e}")

    return None
