import requests
from backend.settings import logger
from backendApi.models import WebSocketUser
from backendApi.permissions import IsAuthenticatedOrIsWebSocketServer, IsWebSocketServer
from django.core.files.storage import default_storage
from django.http import FileResponse
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from utils.hash import verify_password
from utils.jwt_token import JwtTokenGenerator
from io import BytesIO

from ..models import Otp, Token, User
from ..serializers.user import UserSerializer


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

    @action(detail=True, methods=["post"])
    def logIn42(self, request):
        token42 = request.data.get("token42", None)
        if not token42:
            return Response({"error": "No token provided"}, status=400)
        # Get user data from 42 API
        url = "https://api.intra.42.fr/v2/me"
        headers = {"Authorization": f"Bearer {token42}"}
        response = requests.request("GET", url, headers=headers)
        user_data = response.json()
        if not user_data:
            return Response({"error": "Failed to get user data"}, status=400)
        id42 = user_data.get("id")
        email42 = user_data.get("email")
        username = user_data.get("login") + "_42"
        first_name = user_data.get("first_name")
        last_name = user_data.get("last_name")
        image_url = user_data.get("image").get("link")
        logger.info(
            f"User {username} login, id42: {id42}, email42: {email42}, image_url: {image_url}, first_name: {first_name}, last_name: {last_name}"
        )
        # Save avatar picture to /avatars/username/
        # Check if avatars/username/username.png already exists
        # Create user or update user data
        user, created = User.objects.get_or_create(
            id42=id42,
            username=username,
            email=email42,
            first_name=first_name,
            last_name=last_name,
        )
        if created:
            avatar = requests.get(image_url)
            if avatar.status_code == 200:
                avatar_file = BytesIO(avatar.content)
                avatarPath = default_storage.save(
                    f"avatars/{username}/{username}.png", avatar_file
                )
            else:
                avatarPath = "avatars/default.png"
            user.avatarPath = avatarPath
        user.status = "online"
        user.last_login = timezone.now()
        user.save()
        token = JwtTokenGenerator.generateJwtToken(user.id)
        return Response(
            {
                "message": f"User {user.username} login",
                "access": token.key,
            },
            status=200,
        )

    @action(detail=True, methods=["post"])
    def logOut(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
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
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["put"])
    def updateMe(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        # Update user data
        first_name = request.data.get("first_name", None)
        last_name = request.data.get("last_name", None)
        username = request.data.get("username", None)
        old_password = request.data.get("old_password", None)
        new_password = request.data.get("new_password", None)
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if username:
            user.username = username
        if old_password:
            if not verify_password(old_password, user.password):
                return Response({"error": "Invalid old password"}, status=400)
            if not new_password:
                return Response({"error": "New password not provided"}, status=400)
            user.password = new_password
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def uploadAvatarPicture(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
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
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
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

    def getUserById(self, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        return user

    # Get list non super user
    @action(detail=True, methods=["get"])
    def getListNonSuperUser(self, request):
        users = User.objects.filter(is_superuser=False)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def isAdmin(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        if user.is_superuser:
            return Response({"isAdmin": True}, status=200)
        else:
            return Response({"isAdmin": False}, status=200)

    @action(detail=True, methods=["get"])
    def updateStatus(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        status = request.data.get("status", None)
        if not status:
            return Response({"error": "Status not provided"}, status=400)
        if status not in ["online", "offline"]:
            return Response({"error": "Invalid status"}, status=400)
        user.status = status
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def updateStatusByWebSocket(self, request, user_id):
        status = request.data.get("status", None)
        if not status:
            return Response({"error": "Status not provided"}, status=400)
        if status not in ["online", "offline"]:
            return Response({"error": "Invalid status"}, status=400)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        user.status = status
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def addAliasToUser(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        alias = request.data.get("alias", None)
        if not alias:
            return Response({"error": "Alias not provided"}, status=400)
        # Check if alias already exists
        if User.objects.filter(alias=alias).exists():
            return Response({"error": "Alias already exists"}, status=400)
        user.alias = alias
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def updateAliasToUser(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        alias = request.data.get("alias", None)
        if not alias:
            return Response({"error": "Alias not provided"}, status=400)
        # Check if alias already exists
        if User.objects.filter(alias=alias).exists():
            return Response({"error": "Alias already exists"}, status=400)
        user.alias = alias
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def removeAliasToUser(self, request):
        user = request.user
        if isinstance(user, WebSocketUser):
            username = request.data.get("user", None)
            if not username:
                return Response({"error": "User not provided"}, status=400)
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        user.alias = None
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
            "getUserById",
            "isAdmin",
            "updateStatus",
            "addAliasToUser",
            "updateAliasToUser",
            "removeAliasToUser",
        ]:
            self.permission_classes = [IsAuthenticated]
        elif self.action in ["updateStatusByWebSocket"]:
            self.permission_classes = [IsWebSocketServer]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
