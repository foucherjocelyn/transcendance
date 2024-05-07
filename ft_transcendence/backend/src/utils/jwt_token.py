import jwt
from backendApi.models import User
from cryptography.hazmat.primitives import serialization
from django.utils import timezone
from backend.settings import JWT

class JwtTokenGenerator:
    blackList= []
    def __init__(self, user, key):
        self.user = user
        self.key = key

    def generateJwtToken(userId):
        try:
            with open("keys/private_key.pem", "rb") as key_file:
                private_key = serialization.load_pem_private_key(
                    key_file.read(),
                    password=None,
                )

            payload = {
                "sub": "transcendence",
                "userId": userId,
                "iat": timezone.now(),
                "exp": timezone.now() + JWT["ACCESS_TOKEN_LIFETIME"],
            }

            # Sign the JWT
            key = jwt.encode(payload, private_key, algorithm="RS256")
            user = User.objects.get(
                id=userId,
            )
            return JwtTokenGenerator(user, key)
        except:
            return None

    def decodedJwtToken(jwtToken):
        try:
            with open("keys/public_key.pem", "rb") as key_file:
                public_key = serialization.load_pem_public_key(
                    key_file.read(),
                )
            decodedToken = jwt.decode(jwtToken, public_key, algorithms=["RS256"])
            return decodedToken
        except:
            return None
