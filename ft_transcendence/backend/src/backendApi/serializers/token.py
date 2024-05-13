from backendApi.models import Token
from rest_framework import serializers

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = "__all__"
