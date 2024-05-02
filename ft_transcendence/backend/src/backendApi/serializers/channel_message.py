from backendApi.models import ChannelMessage
from rest_framework import serializers


class ChannelMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    channel_name = serializers.CharField(source="receiver.name", read_only=True)

    class Meta:
        model = ChannelMessage
        fields = [
            "id",
            "sender_username",
            "channel_name",
            "content",
            "created_at",
            "updated_at",
        ]
        reads_only_fields = [
            "id",
            "sender_username",
            "channel_name",
            "created_at",
            "updated_at",
        ]
