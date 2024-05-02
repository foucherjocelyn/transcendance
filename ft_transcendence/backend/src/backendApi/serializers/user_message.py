from rest_framework import serializers
from ..models import UserMessage


class UserMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username")
    receiver_username = serializers.CharField(source="receiver.username")

    class Meta:
        model = UserMessage
        fields = [
            "id",
            "sender_username",
            "receiver_username",
            "content",
            "created_at",
            "updated_at",
        ]
        reads_only_fields = [
            "id",
            "sender_username",
            "receiver_username",
            "created_at",
            "updated_at",
        ]
