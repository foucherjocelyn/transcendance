from backendApi.models import Channel, ChannelMessage, User, ChannelMutedUser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from backendApi.serializers.channel_message import ChannelMessageSerializer
from datetime import datetime


class ChannelMessageViewSet(viewsets.ModelViewSet):
    queryset = ChannelMessage.objects.all()
    serializer_class = ChannelMessageSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("id")

    # Create new message viewset. Only members can send messages
    @action(detail=False, methods=["post"])
    def createMessage(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        user = request.user
        if not channel.members.filter(id=user.id).exists():
            return Response({"error": "You are not in this channel"}, status=400)
        if ChannelMutedUser.objects.filter(channel=channel, user=user).exists():
            muted_user = ChannelMutedUser.objects.get(channel=channel, user=user)
            if muted_user.until >= datetime.now().date():
                return Response({"error": "You are muted in this channel"}, status=400)
        content = request.data.get("content", None)
        if not content:
            return Response({"error": "Content not provided"}, status=400)
        message = ChannelMessage.objects.create(
            receiver=channel, sender=user, content=content
        )
        serializer = self.get_serializer(message)
        return Response(serializer.data, status=201)

    # Update message content viewset. Only who sent the message can update it
    @action(detail=True, methods=["put"])
    def updateMessageContent(self, request, channel_id, channelmessage_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        message = ChannelMessage.objects.get(id=channelmessage_id)
        if message.receiver != channel:
            return Response({"error": "Message not found in this channel"}, status=404)
        if message.sender != request.user:
            return Response(
                {"error": "You are not authorized to update this message"}, status=403
            )
        content = request.data.get("content", None)
        if not content:
            return Response({"error": "Content not provided"}, status=400)
        message.content = content
        message.save()
        serializer = self.get_serializer(message)
        return Response(serializer.data, status=200)

    # List all messages in a channel send by a specific user
    @action(detail=True, methods=["get"])
    def listMessages(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        user = request.user
        if not channel.members.filter(id=user.id).exists():
            return Response({"error": "You are not in this channel"}, status=400)
        messages = ChannelMessage.objects.filter(receiver=channel, sender=user)
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data, status=200)

    # List 50 last messages in channel
    @action(detail=True, methods=["get"])
    def listLastMessages(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        user = request.user
        if not channel.members.filter(id=user.id).exists():
            return Response({"error": "You are not in this channel"}, status=400)
        messages = ChannelMessage.objects.filter(receiver=channel).order_by(
            "-created_at"
        )[:50]
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in [
            "createMessage",
            "updateMessageContent",
            "listMessages",
            "listLastMessages",
        ]:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return super().get_permissions()
