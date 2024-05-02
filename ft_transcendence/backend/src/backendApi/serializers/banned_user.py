from backendApi.models import BannedUser
from rest_framework import serializers


class BannedUserSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    receiver_username = serializers.CharField(
        source="receiver.username", read_only=True
    )

    class Meta:
        model = BannedUser
        fields = [
            "id",
            "sender_username",
            "receiver_username",
            "until",
            "bannedReason",
            "created_at",
            "updated_at",
        ]
