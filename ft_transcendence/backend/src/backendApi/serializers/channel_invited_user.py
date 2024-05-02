from backendApi.models import ChannelInvitedUser
from rest_framework import serializers


class ChannelInvitedUserSerializer(serializers.ModelSerializer):
    channel_name = serializers.CharField(source="channel.name", read_only=True)
    inviteduser_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ChannelInvitedUser
        fields = [
            "id",
            "channel_name",
            "inviteduser_name",
            "status",
            "created_at",
            "updated_at",
        ]
        reads_only_fields = [
            "id",
            "channel_name",
            "inviteduser_name",
            "created_at",
            "updated_at",
        ]
