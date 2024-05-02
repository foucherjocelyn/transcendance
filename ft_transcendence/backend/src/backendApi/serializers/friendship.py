from backendApi.models import User, Friendship
from rest_framework import serializers


class FriendshipSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    receiver_username = serializers.CharField(source="receiver.username", read_only=True)

    class Meta:
        model = Friendship
        fields = [
            "id",
            "sender_username",
            "receiver_username",
            "status",
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
