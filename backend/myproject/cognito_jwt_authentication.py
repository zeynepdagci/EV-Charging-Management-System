import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from myapp.models import UserProfile


class CognitoJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Get the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        # Extract the JWT token
        token = auth_header.split(" ")[1]

        try:
            # Decode the JWT token using the secret key
            decoded_token = jwt.decode(
                token,
                settings.SECRET_KEY,  # Replace with Cognito's verification mechanism in production
                algorithms=["HS256"],
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("The token has expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token.")

        # Extract the Cognito user ID from the token
        cognito_user_id = decoded_token.get("sub")
        if not cognito_user_id:
            raise AuthenticationFailed("User ID not found in token.")

        # Get the UserProfile using cognito_user_id
        try:
            user_profile = UserProfile.objects.get(user_id=cognito_user_id)
        except UserProfile.DoesNotExist:
            raise AuthenticationFailed("User not found.")

        # Dynamically add necessary attributes to the UserProfile instance
        self._add_user_attributes(user_profile)

        # Return the user_profile and token to be used as request.user
        return (user_profile, None)

    def _add_user_attributes(self, user_profile):
        # Add is_authenticated attribute
        user_profile.is_authenticated = True

        # Add is_active attribute
        user_profile.is_active = True

        # Add is_staff attribute based on role (only 'admin' should be staff)
        user_profile.is_staff = user_profile.role == "admin"

        # Optionally add is_superuser if needed
        user_profile.is_superuser = user_profile.role == "admin"
