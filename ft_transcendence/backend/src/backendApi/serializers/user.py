from rest_framework import serializers
from ..models import User, Otp, Game, GameScore
import pyotp


class UserSerializer(serializers.ModelSerializer):
    nb_games = serializers.IntegerField(read_only=True)
    avg_score = serializers.FloatField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "level",
            "status",
            "avatarPath",
            "last_login",
            "created_at",
            "updated_at",
            "nb_games",
            "avg_score",
        ]
        read_only_fields = [
            "id",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add nb_game and avg_score to the representation
        nb_games = Game.players.through.objects.filter(user_id=instance.id).count()
        total_score = 0
        for score in GameScore.objects.filter(player=instance):
            total_score += score.score
        avg_score = round(total_score / nb_games if nb_games > 0 else 0, 2)
        representation["nb_games"] = nb_games
        representation["avg_score"] = avg_score
        return representation

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        secretKey = pyotp.random_base32()
        Otp.objects.create(user=user, secretKey=secretKey)
        return user
