from backendApi.models import Tournament
from rest_framework import serializers
from django.utils import timezone
from backendApi.custom_validator_error import CustomValidationError


class TournamentSerializer(serializers.ModelSerializer):
    player_usernames = serializers.ListField(
        child=serializers.CharField(), read_only=True
    )

    class Meta:
        model = Tournament
        fields = [
            "id",
            "name",
            "description",
            "start_date",
            "end_date",
            "status",
            "player_usernames",
            "created_at",
            "updated_at",
        ]
        reads_only_fields = [
            "id",
            "status",
            "player_usernames",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        super().validate(data)
        if data["start_date"] > data["end_date"]:
            raise CustomValidationError(detail="Start time must be before end time")
        return data

    def get_player_usernames(self, obj):
        return [player.username for player in obj.players.all()]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["player_usernames"] = self.get_player_usernames(instance)
        return representation

    def create(self, validated_data):
        tournement = super().create(validated_data)
        # Set the status by compared to the start time
        if tournement.start_date > timezone.now().date():
            tournement.status = "upcoming"
        elif tournement.end_date < timezone.now().date():
            tournement.status = "completed"
        else:
            tournement.status = "ongoing"
        tournement.save()
        return tournement

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
