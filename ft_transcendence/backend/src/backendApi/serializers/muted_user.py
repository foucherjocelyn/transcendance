from backendApi.models import MutedUser
from rest_framework import serializers


class MutedUserSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username")
    receiver_username = serializers.CharField(source="receiver.username")

    class Meta:
        model = MutedUser
        fields = [
            "id",
            "sender_username",
            "receiver_username",
            "until",
            "mutedReason",
            "created_at",
            "updated_at",
        ]
