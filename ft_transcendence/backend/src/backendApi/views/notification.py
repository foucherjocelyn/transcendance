from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from backendApi.models import Notification, User
from backendApi.serializers.notification import NotificationSerializer



class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    # Create a new notification view
    @action(detail=False, methods=["post"])
    def createNotification(self, request):
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        content = request.data.get("content", None)
        if not content:
            return Response({"error": "Content not provided"}, status=400)
        notification = Notification.objects.create(user=user, content=content)
        serializer = self.get_serializer(notification)
        return Response(serializer.data, status=201)

    # Get all notifications for a user
    @action(detail=True, methods=["get"])
    def getAllNotifications(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def readNotification(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=404)
        user = request.user
        # Check is the notification belongs to the user
        if notification.user != user:
            return Response(
                {"error": "You are not authorized to read this notification"},
                status=403,
            )
        notification.isRead = True
        notification.save()
        return Response({"message": "Notification marked as read"}, status=200)

    def get_permissions(self):
        if self.action in [
            "createNotification",
            "getAllNotifications",
            "readNotification",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
