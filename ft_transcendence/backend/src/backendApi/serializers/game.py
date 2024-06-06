from backendApi.invalid_input import InputValidationError
from rest_framework import serializers
from django.contrib.auth.models import AnonymousUser
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

    def validate(self, data):
        super().validate(data)
        mode = data.get("mode", None)
        tournament_name = data.get("tournament_name", None)
        if mode == "tournament":
            if not "tournament_name":
                raise InputValidationError(detail="Tournament name is required")
            try:
                tournament = Tournament.objects.get(name=tournament_name)
            except Tournament.DoesNotExist:
                raise InputValidationError(detail="Tournament not found")
            if tournament.status != "progressing":
                raise InputValidationError(detail="Tournament is not progressing")
        else:
            if tournament_name:
                raise InputValidationError(
                    detail="Cannot set tournament name when mode is not tournament"
                )
        return data

    def get_owner_username(self, obj):
        return obj.owner.username

    def get_player_usernames(self, obj):
        return [player.username for player in obj.players.all()]

    def to_representation(self, instance):
        instance.player_usernames = self.get_player_usernames(instance)
        if instance.tournament:
            instance.tournament_name = instance.tournament.name
        return super().to_representation(instance)

    def create(self, validated_data):
        owner = self.context["request"].user
        tournament_name = validated_data.pop("tournament_name", None)
        game = Game.objects.create(**validated_data)
        # Check if owner isn't Anonymous
        if not isinstance(owner, AnonymousUser):
            game.owner = owner
            game.players.add(owner)
        if tournament_name:
            try:
                tournament = Tournament.objects.get(name=tournament_name)
            except Tournament.DoesNotExist:
                raise InputValidationError(detail="Tournament not found")
            game.tournament = tournament
            # Check if the owner is part of the tournament
            if not isinstance(owner, AnonymousUser) and not tournament.players.filter(id=owner.id).exists():
                raise InputValidationError(detail="Owner is not part of the tournament")
        game.save()
        return game

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
