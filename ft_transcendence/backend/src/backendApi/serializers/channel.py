from rest_framework import serializers
from ..models import User, Channel

from backendApi.custom_validator_error import CustomValidationError


class ChannelSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(required=False)
    admin_usernames = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    member_usernames = serializers.ListField(
        child=serializers.CharField(), required=False
    )

    class Meta:
        model = Channel
        fields = [
            "id",
            "name",
            "visibility",
            "password",
            "owner_username",
            "admin_usernames",
            "member_usernames",
            "created_at",
            "updated_at",
        ]
        reads_only_fields = [
            "id",
            "owner_username",
            "admin_usernames",
            "member_usernames",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        super().validate(data)
        if "owner_username" in data:
            raise CustomValidationError(detail="Cannot set owner_username")
        if "admin_usernames" in data:
            raise CustomValidationError(detail="Cannot set admin_usernames")
        if "member_usernames" in data:
            raise CustomValidationError(detail="Cannot set member_usernames")
        return data

    def get_owner_username(self, obj):
        return obj.owner.username

    def get_admin_usernames(self, obj):
        return [admin.username for admin in obj.admins.all()]

    def get_member_usernames(self, obj):
        return [member.username for member in obj.members.all()]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["owner_username"] = self.get_owner_username(instance)
        representation["admin_usernames"] = self.get_admin_usernames(instance)
        representation["member_usernames"] = self.get_member_usernames(instance)
        return representation

    def create(self, validated_data):
        # Get the current user from the request
        owner = self.context["request"].user
        # Set the owner_username, admin_usernames, and member_usernames by default
        validated_data["owner"] = owner
        # Create the channel
        channel = Channel.objects.create(**validated_data)

        # Add the admins and members
        channel.admins.add(owner)
        channel.members.add(owner)
        channel.save()

        return channel

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
