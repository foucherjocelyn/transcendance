from backendApi.invalid_input import InputValidationError
from backendApi.models import Tournament
from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth.models import AnonymousUser


class TournamentSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)
    player_usernames = serializers.ListField(
        child=serializers.CharField(), read_only=True
    )
    ordered_players_usernames = serializers.ListField(
        child=serializers.CharField(), read_only=True
    )
    champion_username = serializers.CharField(
        source="champion.username", read_only=True
    )

    class Meta:
        model = Tournament
        fields = [
            "id",
            "name",
            "description",
            "owner_username",
            "max_players",
            "status",
            "player_usernames",
            "ordered_players_usernames",
            "champion_username",
            "created_at",
            "updated_at",
        ]
        reads_only_fields = [
            "id",
            "status",
            "player_usernames",
            "ordered_players_usernames",
            "champion_username",
            "created_at",
            "updated_at",
        ]

    def get_player_usernames(self, obj):
        return [player.username for player in obj.players.all()]
    
    def get_ordered_players_usernames(self, obj):
        return [player.username for player in obj.ordered_players.all()]

    def to_representation(self, instance):
        instance.player_usernames = self.get_player_usernames(instance)
        instance.ordered_players_usernames = self.get_ordered_players_usernames(instance)
        return super().to_representation(instance)

    def create(self, validated_data):
        owner = self.context["request"].user
        # Create the tournament
        tournement = Tournament.objects.create(**validated_data)
        # Check if owner isn't Anonymous
        if not isinstance(owner, AnonymousUser):
            tournement.owner = owner
            tournement.players.add(owner)
        tournement.save()
        return tournement

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
