import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from myapp.models import UserProfile


class CognitoJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        try:
            decoded_token = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"],
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("The token has expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token.")

        cognito_user_id = decoded_token.get("sub")
        if not cognito_user_id:
            raise AuthenticationFailed("User ID not found in token.")

        try:
            user_profile = UserProfile.objects.get(user_id=cognito_user_id)
        except UserProfile.DoesNotExist:
            raise AuthenticationFailed("User not found.")

        self._add_user_attributes(user_profile)

        return (user_profile, None)

    def _add_user_attributes(self, user_profile):
        user_profile.is_authenticated = True

        user_profile.is_active = True

        user_profile.is_staff = user_profile.role == "admin"

        user_profile.is_superuser = user_profile.role == "admin"
