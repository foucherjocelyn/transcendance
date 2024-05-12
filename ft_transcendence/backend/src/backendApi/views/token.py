from backendApi.models import User
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from utils.hash import verify_password
from utils.jwt_token import JwtTokenGenerator


class TokenViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(methods=["post"], detail=False)
    def generateToken(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None or password is None:
            return Response(
                {"error": "Please provide both username and password"}, status=400
            )
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Invalid username"}, status=404)
        if not verify_password(password, user.password):
            return Response({"error": "Invalid password"}, status=400)
        token = JwtTokenGenerator.generateJwtToken(user.id)
        return Response({"access": token.key}, status=200)
