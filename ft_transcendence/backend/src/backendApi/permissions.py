from rest_framework import permissions
from .models import Channel, ChannelInvitedUser


class IsChannelAdmin(permissions.BasePermission):
    """
    Custom permission to check if a user is an admin of a channel.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user is an admin of the channel
        if obj.admins.filter(id=request.user.id).exists():
            return True
        return False

    def has_permission(self, request, view):
        # Get the channel ID from the request
        channel_id = view.kwargs.get("pk", None)
        if channel_id:
            try:
                channel = Channel.objects.get(id=channel_id)
                return self.has_object_permission(request, view, channel)
            except Channel.DoesNotExist:
                return False
        else:
            return False


class IsChannelInvitedUser(permissions.BasePermission):
    """
    Custom permission to check if a user is an invited user of a channel.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user is an invited user of the channel
        if ChannelInvitedUser.objects.filter(channel=obj, user=request.user).exists():
            return True
        return False

    def has_permission(self, request, view):
        # Get the channel ID from the request
        channel_id = view.kwargs.get("pk", None)

        if channel_id:
            try:
                channel = Channel.objects.get(id=channel_id)
                return self.has_object_permission(request, view, channel)
            except Channel.DoesNotExist:
                return False
        else:
            return False


class IsChannelMember(permissions.BasePermission):
    """
    Custom permission to check if a user is a member of a channel.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user is a member of the channel
        if obj.users.filter(id=request.user.id).exists():
            return True
        return False

    def has_permission(self, request, view):
        # Get the channel ID from the request
        channel_id = view.kwargs.get("pk", None)

        if channel_id:
            try:
                channel = Channel.objects.get(id=channel_id)
                return self.has_object_permission(request, view, channel)
            except Channel.DoesNotExist:
                return False
        else:
            return False
