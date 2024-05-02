from datetime import datetime

from backendApi.models import Friendship, MutedUser, User, UserMessage
from backendApi.serializers.user_message import UserMessageSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response


class UserMessageViewSet(viewsets.ModelViewSet):
    queryset = UserMessage.objects.all()
    serializer_class = UserMessageSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("id")

    # Send message to friend view
    @action(detail=False, methods=["post"])
    def sendMessageToFriend(self, request):
        sender = request.user
        receiver_username = request.data.get("username", None)
        if not receiver_username:
            return Response({"error": "Receiver username not provided"}, status=400)
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)

        # Check if sender and receiver are friends
        if not (
            Friendship.objects.filter(
                sender=sender, receiver=receiver, status="accepted"
            ).exists()
            or Friendship.objects.filter(
                sender=receiver, receiver=sender, status="accepted"
            ).exists()
        ):
            return Response(
                {"error": "Sender and receiver are not friends"}, status=400
            )
        # Check if sender and receiver are the same person
        if sender == receiver:
            return Response(
                {"error": "Sender and receiver are the same person"}, status=400
            )
        content = request.data.get("content", None)
        if not content:
            return Response({"error": "Content not provided"}, status=400)

        # Check if sender is muted by receiver or receiver is muted by sender
        if (
            MutedUser.objects.filter(
                sender=receiver, receiver=sender, until__gte=datetime.now().date()
            ).exists()
            or MutedUser.objects.filter(
                sender=sender, receiver=receiver, until__gte=datetime.now().date()
            ).exists()
        ):
            return Response(
                {"error": "Sender or receiver is muted by each other"}, status=400
            )
        message = UserMessage.objects.create(
            sender=sender, receiver=receiver, content=content
        )
        serializer = self.get_serializer(message)
        return Response(serializer.data, status=200)

    # Get list of last 50 messages sent to a friend
    @action(detail=True, methods=["get"])
    def listMessagesSentToFriend(self, request, friend_id):
        sender = request.user
        try:
            receiver = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)
        messages = UserMessage.objects.filter(
            sender=sender, receiver=receiver
        ).order_by("-created_at")[:50]
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data, status=200)
    
    # Get list of last 50 messages received from a friend
    @action(detail=True, methods=["get"])
    def listMessagesReceivedFromFriend(self, request, friend_id):
        receiver = request.user
        try:
            sender = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"error": "Sender not found"}, status=404)
        messages = UserMessage.objects.filter(
            sender=sender, receiver=receiver
        ).order_by("-created_at")[:50]
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data, status=200)

    # Update message content
    @action(detail=True, methods=["put"])
    def updateMessageContentToFriend(self, request, friend_id, message_id):
        message = UserMessage.objects.get(id=message_id)
        # Check if user is sender and friend is receiver
        sender = request.user
        try:
            receiver = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"error": "Friend not found"}, status=404)
        if message.sender != sender or message.receiver != receiver:
            return Response(
                {"error": "You are not authorized to update this message"},
                status=403,
            )
        content = request.data.get("content", None)
        if not content:
            return Response({"error": "Content not provided"}, status=400)
        message.content = content
        message.save()
        serializer = self.get_serializer(message)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in [
            "sendMessageToFriend",
            "listMessagesSentToFriend",
            "listMessagesReceivedFromFriend",
            "updateMessageContentToFriend",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
