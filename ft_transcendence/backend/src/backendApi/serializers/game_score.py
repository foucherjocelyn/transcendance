from backendApi.models import GameScore
from backendApi.serializers.user import UserSerializer
from backendApi.serializers.game import GameSerializer
from rest_framework import serializers


class GameScoreSerializer(serializers.ModelSerializer):
    game_id = serializers.IntegerField(source="game.id")
    player_username = serializers.CharField(source="player.username")

    class Meta:
        model = GameScore
        fields = [
            "id",
            "game_id",
            "player_username",
            "score",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "game_id",
            "player_username",
            "created_at",
            "updated_at",
        ]
