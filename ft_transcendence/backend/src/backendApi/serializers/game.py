from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from backendApi.custom_validator_error import CustomValidationError

from ..models import Game, Tournament, User


class GameSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    player_usernames = serializers.ListField(
        child=serializers.CharField(), read_only=True, required=False
    )
    winner_username = serializers.CharField(source="winner.username", read_only=True)
    tournament_name = serializers.CharField(required=False)

    class Meta:
        model = Game
        fields = [
            "id",
            "visibility",
            "mode",
            "tournament_name",
            "status",
            "maxScore",
            "owner_username",
            "player_usernames",
            "winner_username",
            "winnerScore",
            "created_at",
            "updated_at",
        ]

        reads_only_fields = [
            "id",
            "owner_username",
            "users_username",
            "winner",
            "winnerScore",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        super().validate(data)
        mode = data.get("mode", None)
        tournament_name = data.get("tournament_name", None)
        if mode == "tournament":
            if not "tournament_name":
                raise CustomValidationError(detail="Tournament name is required")
            try:
                tournament = Tournament.objects.get(name=tournament_name)
            except Tournament.DoesNotExist:
                raise CustomValidationError(detail="Tournament not found")
            if tournament.status != "ongoing":
                raise CustomValidationError(detail="Tournament is not ongoing")
        else:
            if tournament_name:
                raise CustomValidationError(
                    detail="Cannot set tournament name when mode is not tournament"
                )
        return data

    def get_player_usernames(self, obj):
        return [player.username for player in obj.players.all()]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["tournament_name"] = instance.tournament.name
        representation["player_usernames"] = self.get_player_usernames(instance)
        return representation

    def create(self, validated_data):
        owner = self.context["request"].user
        tournament_name = validated_data.pop("tournament_name", None)
        game = Game.objects.create(**validated_data)
        game.owner = owner
        game.players.add(owner)
        if tournament_name:
            try:
                tournament = Tournament.objects.get(name=tournament_name)
            except Tournament.DoesNotExist:
                raise CustomValidationError(detail="Tournament not found")
            game.tournament = tournament
            # Check if the owner is part of the tournament
            if not tournament.players.filter(id=owner.id).exists():
                raise CustomValidationError(detail="Owner is not part of the tournament")
        game.save()
        return game

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
