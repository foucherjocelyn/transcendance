from backendApi.invalid_input import InputValidationError
from backendApi.models import Tournament
from django.utils import timezone
from rest_framework import serializers


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
            "max_players",
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
            raise InputValidationError(detail="Start time must be before end time")
        return data

    def get_player_usernames(self, obj):
        return [player.username for player in obj.players.all()]

    def to_representation(self, instance):
        instance.player_usernames = self.get_player_usernames(instance)
        return super().to_representation(instance)

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
