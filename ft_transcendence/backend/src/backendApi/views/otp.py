from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
import qrcode
from django.http import HttpResponse
from io import BytesIO
from django.core.files.storage import default_storage
from django.http import FileResponse

from ..models import User
from ..models import Otp
from ..serializers.otp import OtpSerializer

class OtpViewSet(viewsets.ModelViewSet):
    queryset = Otp.objects.all()
    serializer_class = OtpSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("id")

    @action(detail=False, methods=['get'])
    def getOtpStatus(self, request):
        user = request.user
        if user is None:
            return Response({'error': 'User not found'}, status=404)
        try:
            instance = Otp.objects.get(user=user)
        except Otp.DoesNotExist:
            return Response({'error': 'OTP not found'}, status=404)
        return Response({'otpStatus': instance.otpStatus}, status=200)

    @action(detail=False, methods=['post'])
    def postOtpStatus(self, request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)
        if not username or not password:
            return Response({'error': 'Username and password not provided'}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        if not user.check_password(password):
            return Response({'error': 'Password not matched'}, status=400)
        try:
            otp = Otp.objects.get(user=user)
        except Otp.DoesNotExist:
            return Response({'error': 'OTP not found'}, status=404)
        return Response({'otpStatus': otp.otpStatus}, status=200)

    @action(detail=True, methods=['post'])
    def switchOtpStatus(self, request):
        user = request.user
        instance = Otp.objects.get(user=user)
        instance.otpStatus = not instance.otpStatus
        instance.save()
        return Response({'otpStatus': instance.otpStatus}, status=200)

    @action(detail=True, methods=['get'])
    def getOtpCode(self, request):
        user = request.user
        if user is None:
            return Response({'error': 'User not found'}, status=404)
        instance = Otp.objects.get(user=user)
        otp = instance.getOtp()
        return Response({'otp': otp}, status=200)

    @action(detail=True, methods=['post'])
    def checkOtpCode(self, request):
        user = request.user
        otp = request.data.get('otp')
        instance = Otp.objects.get(user=user)
        if instance.verifyOtp(otp):
            return Response({'message': 'OTP verified successfully'}, status=200)
        else:
            return Response({'error': 'Invalid OTP'}, status=400)

    @action(detail=False, methods=['get'])
    def getQRcode(self, request):
        user = request.user
        if user is None:
            return Response({'error': 'User not found'}, status=404)
        # Generate the OTP QR code
        otp_instance = Otp.objects.get(user=user)
        otp_secret = otp_instance.secretKey
        otp_uri = f'otpauth://totp/Transcendence:{
            user.username}?secret={otp_secret}&issuer=Transcendence'
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(otp_uri)
        qr.make(fit=True)
        # Save the QR code image to a temporary file
        img = qr.make_image(fill_color="black", back_color="white")
        img_io = BytesIO()
        img.save(img_io, 'PNG')
        img_io.seek(0)
        # Return the QR code image as a response
        return HttpResponse(img_io, content_type='image/png')

    def get_permissions(self):
        if self.action in ['postOtpStatus']:
            self.permission_classes = [AllowAny]
        elif self.action in ['getOtpStatus', 'switchOtpStatus', 'getOtpCode', 'checkOtpCode', 'getQRcode']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
