from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from backendApi.hash import verify_password
from datetime import datetime
from django.utils.dateparse import parse_date


from backendApi.models import (
    Channel,
    ChannelInvitedUser,
    ChannelBannedUser,
    ChannelMutedUser,
    User,
)

from backendApi.serializers.channel import ChannelSerializer
from backendApi.serializers.channel_banned_user import ChannelBannedUserSerializer
from backendApi.serializers.channel_muted_user import ChannelMutedUserSerializer
from backendApi.serializers.channel_invited_user import ChannelInvitedUserSerializer


class ChannelViewSet(viewsets.ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("id")

    # Create channel view. Each user can create a channel.
    @action(detail=False, methods=["post"])
    def createChannel(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            channel = serializer.save()
        return Response({"message": f"Channel {channel.name} created"}, status=201)

    # List every channel the user can see. That includes public channels, private channels in which the user is invited and every channels the user has joined.
    @action(detail=True, methods=["get"])
    def listMyChannels(self, request):
        user = request.user
        channelAlls = Channel.objects.all()
        channels = []
        for channel in channelAlls:
            if (
                channel.visibility == "public"
                or channel.members.filter(id=user.id).exists()
                or ChannelInvitedUser.objects.filter(
                    channel=channel, user=user
                ).exists()
            ):
                channels.append(channel)
        serializer = self.get_serializer(channels, many=True)
        return Response(serializer.data)

    # Update channel view. Only the channel's owner can update a channel.
    @action(detail=True, methods=["put"])
    def updateMyChannel(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        user = request.user
        if not channel.owner == user:
            return Response(
                {"error": "You are not the owner of this channel"}, status=403
            )
        serializer = self.get_serializer(channel, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    # Get channel view if user in channel or is invited or channel is public
    @action(detail=True, methods=["get"])
    def getMyChannel(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        user = request.user
        if (
            not channel.visibility == "public"
            and not channel.members.filter(id=user.id).exists()
            and not ChannelInvitedUser.objects.filter(
                channel=channel, user=user
            ).exists()
        ):
            return Response(
                {
                    "error": "You are not in this channel or invited or channel isn't public"
                },
                status=403,
            )
        serializer = self.get_serializer(channel)
        return Response(serializer.data, status=200)

    # Owner add channel's admin by username
    @action(detail=True, methods=["post"])
    def addAdmin(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        owner = request.user
        if not channel.owner == owner:
            return Response(
                {"error": "You are not the owner of this channel"}, status=403
            )
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if channel.admins.filter(username=username).exists():
            return Response({"error": "User is already an admin"}, status=400)
        # Check if the user is a member of the channel
        if not channel.members.filter(id=user.id).exists():
            return Response({"error": "User is not a member"}, status=400)
        channel.admins.add(user)
        return Response({"message": f"User {username} added as admin"}, status=200)

    # Owner remove channel's admin by username
    @action(detail=True, methods=["post"])
    def removeAdmin(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        owner = request.user
        if not channel.owner == owner:
            return Response(
                {"error": "You are not the owner of this channel"}, status=403
            )
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if not channel.admins.filter(username=username).exists():
            return Response({"error": "User is not an admin"}, status=400)
        # Check if the user is owner of the channel
        if channel.owner == user:
            return Response({"error": "Can't remove the owner from admins"}, status=400)
        channel.admins.remove(user)
        return Response({"message": f"User {username} removed as admin"}, status=200)

    @action(detail=True, methods=["post"])
    def joinChannel(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        user = request.user
        if channel.members.filter(id=user.id).exists():
            return Response({"error": "You are already in this channel"}, status=400)
        # Check if the user is banned from the channel
        if ChannelBannedUser.objects.filter(channel=channel, user=user).exists():
            banned_user = ChannelBannedUser.objects.get(channel=channel, user=user)
            if banned_user.until >= datetime.now().date():
                return Response(
                    {"error": "You are banned from this channel"}, status=403
                )
        # Check if user is invited
        if ChannelInvitedUser.objects.filter(channel=channel, user=user).exists():
            channel_invited_user = ChannelInvitedUser.objects.get(
                channel=channel, user=user
            )
            channel_invited_user.status = "accepted"
            channel_invited_user.save()
        else:
            if channel.visibility == "private":
                return Response(
                    {"error": "You are not invited to this private channel"},
                    status=403,
                )
            if channel.password and not verify_password(
                request.data.get("password", None), channel.password
            ):
                return Response({"error": "Invalid password provided"}, status=400)
        channel.members.add(user)
        serializer = self.get_serializer(channel)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def leaveChannel(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        user = request.user
        if not channel.members.filter(id=user.id).exists():
            return Response({"error": "You are not in this channel"}, status=400)
        channel.members.remove(user)
        # Check if the user is an admin and remove it
        if channel.admins.filter(id=user.id).exists():
            channel.admins.remove(user)
        serializer = self.get_serializer(channel)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def banMember(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        admin = request.user
        if not channel.admins.filter(id=admin.id).exists():
            return Response({"error": "You are not an admin"}, status=403)
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        # Check if the user is owner of the channel
        if channel.owner == user:
            return Response({"error": "Can't ban the owner"}, status=400)
        # Check if the user is admin of the channel
        if channel.admins.filter(id=user.id).exists():
            return Response({"error": "Can't ban an admin"}, status=400)
        # Check if the user is banned from the channel
        banned_user = None
        if ChannelBannedUser.objects.filter(channel=channel, user=user).exists():
            banned_user = ChannelBannedUser.objects.get(channel=channel, user=user)
            if banned_user.until >= datetime.now().date():
                return Response({"error": "User is already banned"}, status=400)
        until_string = request.data.get("until", None)
        reason = request.data.get("bannedReason", None)
        if not until_string:
            until = datetime.max.date()
        else:
            until = parse_date(until_string)
        if channel.members.filter(id=user.id).exists():
            channel.members.remove(user)
        if not banned_user:
            banned_user = ChannelBannedUser.objects.create(
                channel=channel, user=user, until=until, bannedReason=reason
            )
        else:
            banned_user.until = until
            banned_user.bannedReason = reason
            banned_user.save()
        serializer = ChannelBannedUserSerializer(banned_user)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=["post"])
    def unbanMember(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        admin = request.user
        if not channel.admins.filter(id=admin.id).exists():
            return Response({"error": "You are not an admin"}, status=403)
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        # Check if the user is banned from the channel
        if (
            not ChannelBannedUser.objects.filter(channel=channel, user=user).exists()
            or ChannelBannedUser.objects.get(channel=channel, user=user).until
            < datetime.now().date()
        ):
            return Response({"error": "User is not banned"}, status=400)
        banned_user = ChannelBannedUser.objects.get(channel=channel, user=user)
        banned_user.until = datetime.min.date()
        banned_user.save()
        serializer = ChannelBannedUserSerializer(banned_user)
        return Response(serializer.data, status=200)

    # Mute member view
    @action(detail=True, methods=["post"])
    def muteMember(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        admin = request.user
        if not channel.admins.filter(id=admin.id).exists():
            return Response({"error": "You are not an admin"}, status=403)
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        # Check if the user is admin or owner of the channel
        if channel.owner == user or channel.admins.filter(id=user.id).exists():
            return Response({"error": "Can't mute an admin or owner"}, status=400)
        # Check if the user is muted
        muted_user = None
        if ChannelMutedUser.objects.filter(channel=channel, user=user).exists():
            muted_user = ChannelMutedUser.objects.get(channel=channel, user=user)
            if muted_user.until >= datetime.now().date():
                return Response({"error": "User is already muted"}, status=400)
        until_string = request.data.get("until", None)
        reason = request.data.get("mutedReason", None)
        if not until_string:
            until = datetime.max.date()
        else:
            until = parse_date(until_string)
        if not muted_user:
            muted_user = ChannelMutedUser.objects.create(
                channel=channel, user=user, until=until, mutedReason=reason
            )
        else:
            muted_user.until = until
            muted_user.mutedReason = reason
            muted_user.save()
        serializer = ChannelMutedUserSerializer(muted_user)
        return Response(serializer.data, status=200)

    # Unmuted member view
    @action(detail=True, methods=["post"])
    def unmuteMember(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        admin = request.user
        if not channel.admins.filter(id=admin.id).exists():
            return Response({"error": "You are not an admin"}, status=403)
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        # Check if the user is muted
        if (
            not ChannelMutedUser.objects.filter(channel=channel, user=user).exists()
            or ChannelMutedUser.objects.get(channel=channel, user=user).until
            < datetime.now().date()
        ):
            return Response({"error": "User is not muted"}, status=400)
        muted_user = ChannelMutedUser.objects.filter(channel=channel, user=user)
        muted_user.until = datetime.min.date()
        muted_user.save()
        serializer = ChannelMutedUserSerializer(muted_user)
        return Response(serializer.data, status=200)

    # Invited member view
    @action(detail=True, methods=["post", "put"])
    def inviteMember(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if channel.members.filter(id=user.id).exists():
            return Response({"error": "User is already a member"}, status=400)
        if ChannelInvitedUser.objects.filter(channel=channel, user=user).exists():
            return Response({"error": "User is already invited"}, status=400)
        invited_user = ChannelInvitedUser.objects.create(channel=channel, user=user)
        serializer = ChannelInvitedUserSerializer(invited_user)
        return Response(serializer.data, status=200)

    # Update invitaion status
    @action(detail=True, methods=["post", "put"])
    def updateInviteStatus(self, request, channel_id):
        try:
            channel = Channel.objects.get(id=channel_id)
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=404)
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        # Check if status in the request
        status = request.data.get("status", None)
        if not status:
            return Response({"error": "Status not provided"}, status=400)
        if status not in ["pending", "accepted", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)
        # Check if the user is invited
        if not ChannelInvitedUser.objects.filter(channel=channel, user=user).exists():
            return Response({"error": "User is not invited"}, status=400)
        invited_user = ChannelInvitedUser.objects.get(channel=channel, user=user)
        invited_user.status = status
        invited_user.save()
        serializer = ChannelInvitedUserSerializer(invited_user)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in [
            "createChannel",
            "listMyChannels",
            "getMyChannel",
            "updateMyChannel",
            "addAdmin",
            "removeAdmin",
            "joinChannel",
            "leaveChannel",
            "banMember",
            "unbanMember",
            "muteMember",
            "unmuteMember",
            "inviteMember",
            "updateInviteStatus",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
