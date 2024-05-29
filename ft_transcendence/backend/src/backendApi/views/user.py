from django.core.files.storage import default_storage
from django.http import FileResponse
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from utils.hash import verify_password
from utils.jwt_token import JwtTokenGenerator
import os
import json
from django.shortcuts import redirect
import requests

from ..models import Otp, User, Token
from ..serializers.user import UserSerializer
from backend.settings import logger

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("id")

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"message": f"User {user.username} registered"}, status=201)

    @action(detail=True, methods=["post"])
    def logIn(self, request):
        username = request.data.get("username", None)
        password = request.data.get("password", None)
        if not username or not password:
            return Response({"error": "Username or password not provided"}, status=400)
        user = None
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            Response({"error": "Invalid username"}, status=400)
        if not verify_password(password, user.password):
            return Response({"error": "Invalid password"}, status=400)
        instance = Otp.objects.get(user=user)
        if instance.otpStatus:
            if "otp" not in request.data:
                return Response({"error": "No OTP provided"}, status=400)
            otp = request.data.get("otp")
            if not instance.verifyOtp(otp):
                return Response({"error": "Invalid OTP"}, status=400)
        user.status = "online"
        user.last_login = timezone.now()
        user.save()
        token = JwtTokenGenerator.generateJwtToken(user.id)
        return Response(
            {
                "message": f"User {username} login",
                "access": token.key,
            },
            status=200,
        )

    @action(detail=True, methods=["get"])
    def logIn42(self, request):
        client_id = os.getenv("CLIENT_ID_42")
        client_secret = os.getenv("CLIENT_SECRET_42")
        redirect_uri = "https://localhost/api/v1/auth/login42"
        authorization_url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
        if "code" not in request.GET:
            return redirect(authorization_url)
        authorization_code = request.GET.get("code")
        data = {
            "grant_type": "authorization_code",
            "client_id": client_id,
            "client_secret": client_secret,
            "code": authorization_code,
            "redirect_uri": redirect_uri,
        }
        url = "https://api.intra.42.fr/oauth/token"
        payload = json.dumps(data)
        headers = {"Content-Type": "application/json"}
        response = requests.request("POST", url, headers=headers, data=payload)
        logger.info(response.json())
        access_token = response.json().get("access_token")
        exprires_in = response.json().get("expires_in")
        if not access_token:
            return Response({"error": "Failed to get access token"}, status=400)
        return Response({"access_token": access_token}, status=200)

    @action(detail=True, methods=["post"])
    def logOut(self, request):
        user = request.user
        # Update user status to 'offline'
        user.status = "offline"
        user.save()
        # Get tokens from db
        tokens = Token.objects.filter(user=user)
        for token in tokens:
            if not token.blacklist:
                token.blacklist = True
                token.save()
        return Response({"message": f"User {user.username} logout"}, status=200)

    @action(detail=True, methods=["get"])
    def getMe(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["put"])
    def updateMe(self, request):
        user = request.user
        # Update user data
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=["post"])
    def uploadAvatarPicture(self, request):
        user = request.user
        avatar = request.FILES.get("avatar")
        if avatar:
            avatarPath = default_storage.save(
                f"avatars/{user.username}/{avatar.name}", avatar
            )
            user.avatarPath = avatarPath
            user.save()
            return Response({"message": "Avatar uploaded successfully"}, status=200)
        else:
            return Response({"error": "No avatar picture provided"}, status=400)

    @action(detail=True, methods=["get"])
    def getAvatarPicture(self, request):
        user = request.user
        avatarPath = user.avatarPath
        if avatarPath:
            return FileResponse(default_storage.open(avatarPath, "rb"))
        else:
            return FileResponse(default_storage.open("avatars/default.png", "rb"))

    # Find user_id by username
    @action(detail=True, methods=["get"])
    def getUserIdByUsername(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        return Response({"user_id": user.id}, status=200)

    # Get list non super user
    @action(detail=True, methods=["get"])
    def getListNonSuperUser(self, request):
        users = User.objects.filter(is_superuser=False)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def isAdmin(self, request):
        user = request.user
        if user.is_superuser:
            return Response({"isAdmin": True}, status=200)
        else:
            return Response({"isAdmin": False}, status=200)

    @action(detail=True, methods=["get"])
    def updateStatus(self, request):
        user = request.user
        status = request.data.get("status", None)
        if not status:
            return Response({"error": "Status not provided"}, status=400)
        if status not in ["online", "offline"]:
            return Response({"error": "Invalid status"}, status=400)
        user.status = status
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in ["register", "logIn", "logIn42"]:
            self.permission_classes = [AllowAny]
        elif self.action in [
            "list",
            "retrieve",
            "logOut",
            "getMe",
            "updateMe",
            "getAvatarPicture",
            "uploadAvatarPicture",
            "getUserIdByUsername",
            "isAdmin",
            "updateStatus",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
