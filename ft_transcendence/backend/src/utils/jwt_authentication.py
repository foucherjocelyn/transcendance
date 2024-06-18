from datetime import datetime
from backendApi.models import User, Token, WebSocketUser
from django.utils import timezone
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .jwt_token import JwtTokenGenerator
from backend.settings import WEBSOCKET_TOKEN, logger


class JwtAuthentication(BaseAuthentication):
    def authenticate(self, request):
        try:
            authorization = request.headers.get("Authorization", None)
            if not authorization:
                return None
            if len(authorization.split(" ")) != 2:
                raise AuthenticationFailed("Invalid format")
            prefix = authorization.split(" ")[0]
            key = authorization.split(" ")[1]
            if prefix != "Bearer":
                raise AuthenticationFailed("Invalid prefix")
            if key == WEBSOCKET_TOKEN:
                websocket_user = WebSocketUser()
                return (websocket_user, None)
            decoded_token = JwtTokenGenerator.decodedJwtToken(key)
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
                raise AuthenticationFailed("Invalid token")
            user = User.objects.get(id=userId)
            token = Token.objects.get(user=user, key=key)
            if token.blacklist:
                raise AuthenticationFailed("Invalid token")
            return (user, token)
        except Exception as e:
            logger.error(e)
            raise AuthenticationFailed("Invalid token")
