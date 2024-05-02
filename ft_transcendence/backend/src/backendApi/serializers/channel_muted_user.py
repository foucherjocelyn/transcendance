from backendApi.models import ChannelMutedUser
from rest_framework import serializers


class ChannelMutedUserSerializer(serializers.ModelSerializer):
    channel_name = serializers.CharField(source="channel.name", read_only=True)
    muteduser_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = ChannelMutedUser
        fields = [
            "id",
            "channel_name",
            "muteduser_name",
            "until",
            "mutedReason",
            "created_at",
            "updated_at",
        ]
        reads_only_fields = [
            "id",
            "channel_name",
            "muteduser_name",
            "created_at",
            "updated_at",
        ]
