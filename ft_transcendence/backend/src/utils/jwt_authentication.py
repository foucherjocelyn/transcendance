from datetime import datetime

from backend.settings import WEBSOCKET_TOKEN
from backendApi.models import User
from django.utils import timezone
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .jwt_token import JwtTokenGenerator


class JwtAuthentication(BaseAuthentication):
    def authenticate(self, request):
        key = request.headers.get("Authorization", "").split(" ")[-1]
        if not key or key == WEBSOCKET_TOKEN:
            return None
        if key in JwtTokenGenerator.blackList:
            raise AuthenticationFailed("Invalid token")
        try:
            decoded_token = JwtTokenGenerator.decodedJwtToken(key)
            if not decoded_token:
                raise ValueError("Invalid token")
            sub = decoded_token.get("sub")
            userId = decoded_token.get("userId")
            iat = datetime.fromtimestamp(
                decoded_token.get("iat"), tz=timezone.get_current_timezone()
            )
            exp = datetime.fromtimestamp(
                decoded_token.get("exp"), tz=timezone.get_current_timezone()
            )
            if sub != "transcendence":
                raise AuthenticationFailed("Invalid token")
            if iat > timezone.now():
                raise AuthenticationFailed("Invalid token")
            if exp < timezone.now():
                JwtTokenGenerator.blackList.append(key)
                raise AuthenticationFailed("Expired token")
            user = User.objects.get(id=userId)
            return (user, None)
        except:
            raise AuthenticationFailed("Invalid token")
