from rest_framework import serializers
from ..models import Otp

class OtpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Otp
        fields = "__all__"
