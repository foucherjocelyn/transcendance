from collections.abc import Iterable

import pyotp
from utils.hash import hash_password, verify_password
from django.contrib.auth.models import AbstractUser, PermissionsMixin, AnonymousUser
from django.db import models


class User(AbstractUser, PermissionsMixin):
    id42 = models.IntegerField(null=True, blank=True, unique=True)
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=320, unique=True)
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    alias = models.CharField(max_length=30, null=True, blank=True, default=None, unique=True)
    level = models.FloatField(default=1.0)
    statusChoices = [("online", "Online"), ("offline", "Offline")]
    status = models.CharField(max_length=100, choices=statusChoices, default="offline")
    avatarPath = models.CharField(
        max_length=100, default="avatars/default.png", blank=True, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith("pbkdf2_sha256"):
            self.set_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"User : {self.id} : {self.username}"


class Channel(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True)
    visibilityChoices = [("public", "Public"), ("private", "Private")]
    visibility = models.CharField(choices=visibilityChoices, default="public")
    password = models.CharField(max_length=100, null=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="channel_owner",
    )
    members = models.ManyToManyField(User, related_name="channel_members")
    admins = models.ManyToManyField(User, related_name="channel_admins")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith("pbkdf2_sha256"):
            self.password = hash_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Channel : {self.id} : {self.name}"


class ChannelBannedUser(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="channelbanneduser_user"
    )
    channel = models.ForeignKey(
        Channel, on_delete=models.CASCADE, related_name="channelbanneduser_channel"
    )
    until = models.DateField()
    bannedReason = models.TextField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ChannelBannedUser : {self.channel.name} : {self.user.username}"


class ChannelMutedUser(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="channelmuteduser_user"
    )
    channel = models.ForeignKey(
        Channel, on_delete=models.CASCADE, related_name="channelmuteduser_channel"
    )
    until = models.DateField()
    mutedReason = models.TextField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ChannelMutedUser : {self.channel.name} : {self.user.username}"


class ChannelInvitedUser(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="channelinviteduser_user"
    )
    channel = models.ForeignKey(
        Channel, on_delete=models.CASCADE, related_name="channelinviteduser_channel"
    )
    statusChoices = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]
    status = models.CharField(choices=statusChoices, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.channel.name} : {self.user.username}"


class Tournament(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True, default=None)
    max_players = models.PositiveIntegerField(default=16)
    status_choices = [
        ("registering", "Registering"),
        ("progressing", "Progressing"),
        ("finished", "Finished"),
    ]
    status = models.CharField(
        max_length=20, choices=status_choices, default="registering"
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tournament_owner",
        null=True,
        default=None,
    )
    players = models.ManyToManyField(
        User, related_name="tournament_players", default=list
    )
    ordered_players = models.JSONField(default=list)
    champion = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tournament_champion",
        null=True,
        default=None,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Tournament : {self.name} : {self.status}"


class Game(models.Model):
    visibilityChoices = [("public", "Public"), ("private", "Private")]
    visibility = models.CharField(choices=visibilityChoices, default="public")
    modeChoices = [
        ("classic", "Classic"),
        ("ranked", "Ranked"),
        ("tournament", "Tournament"),
    ]
    mode = models.CharField(choices=modeChoices, default="classic")
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        default=None,
        related_name="game_tournament",
    )
    statusChoices = [("progressing", "Progressing"), ("end", "End")]
    status = models.CharField(choices=statusChoices, default="progressing")
    maxScore = models.IntegerField(default=5)
    players = models.ManyToManyField(User, related_name="game_players")
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="game_owner",
        null=True,
        default=None,
    )
    winner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="game_winner",
        null=True,
        default=None,
    )
    winnerScore = models.IntegerField(default=None, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Game : {self.id} : {self.mode} - {self.visibility} - {self.status}"


class GameScore(models.Model):
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="gamescore_game"
    )
    player = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="gamescore_player",
        null=True,
        default=None,
    )
    score = models.IntegerField(default=None, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"GameScore : {self.game.id} - {self.player.username}: {self.score}"


class UserMessage(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="usermessage_sender"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="usermessage_receiver"
    )
    content = models.TextField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"UserMessage : {self.sender.username} : {self.receiver.username}"


class ChannelMessage(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="channelmessage_sender"
    )
    receiver = models.ForeignKey(
        Channel, on_delete=models.CASCADE, related_name="channelmessage_receiver"
    )
    content = models.TextField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ChannelMessage : {self.sender.username} : {self.receiver.name}"


class Friendship(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendship_sender"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendship_receiver"
    )
    statusChoices = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]
    status = models.CharField(max_length=100, choices=statusChoices, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Friendship : {self.sender.username} : {self.receiver.username}"


class MutedUser(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="muteduser_sender"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="muteduser_receiver"
    )
    until = models.DateField()
    mutedReason = models.TextField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"MutedUser : {self.sender.username} and {self.receiver.username}"


class BannedUser(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="banneduser_sender"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="banneduser_receiver"
    )
    until = models.DateField()
    bannedReason = models.TextField(default=None, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"BannedUser : {self.sender.username} and {self.receiver.username}"


class Otp(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    secretKey = models.CharField(max_length=100, unique=True)
    otpStatus = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def getOtp(self):
        totp = pyotp.TOTP(self.secretKey)
        otp = totp.now()
        return otp

    def verifyOtp(self, otpVerified):
        totp = pyotp.TOTP(self.secretKey)
        return totp.verify(otpVerified, valid_window=60)

    def __str__(self):
        return f"Otp : {self.user.username} : {self.otpStatus}"


class Notification(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notification_user"
    )
    content = models.TextField(default=None, blank=True, null=True)
    isRead = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification : {self.user.username} : {self.content}"


class Token(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    key = models.CharField(unique=True)
    expired_at = models.DateTimeField()
    blacklist = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token : {self.user.username} : {self.key}"


class WebSocketUser(AnonymousUser):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(WebSocketUser, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        super().__init__()

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_staff(self):
        return False

    @property
    def is_superuser(self):
        return False

    def __str__(self):
        return f"WebSocketUser"
