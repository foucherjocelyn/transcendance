from datetime import datetime

from backendApi.models import BannedUser, Friendship, MutedUser, User
from backendApi.serializers.banned_user import BannedUserSerializer
from backendApi.serializers.friendship import FriendshipSerializer
from backendApi.serializers.muted_user import MutedUserSerializer
from backendApi.serializers.user import UserSerializer
from django.db.models import Q
from django.utils.dateparse import parse_date
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response


class FriendshipViewSet(viewsets.ModelViewSet):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        return super().get_queryset().order_by("id")

    @action(detail=True, methods=["post"])
    def inviteFriend(self, request):
        sender = request.user
        receiver_username = request.data.get("username", None)
        if not receiver_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)

        # Check if the invitation is already sent
        if (
            Friendship.objects.filter(
                sender=sender, receiver=receiver, status="pending"
            ).exists()
            or Friendship.objects.filter(
                sender=receiver, receiver=sender, status="pending"
            ).exists()
        ):
            return Response(
                {"error": "Invitation already sent from one to another"}, status=400
            )

        # Check if sender and user are friends
        if (
            Friendship.objects.filter(
                sender=sender, receiver=receiver, status="accepted"
            ).exists()
            or Friendship.objects.filter(
                sender=receiver, receiver=sender, status="accepted"
            ).exists()
        ):
            return Response({"error": "Users are already friend"}, status=400)

        # Check if the receiver is banned by the sender
        if BannedUser.objects.filter(
            sender=sender, receiver=receiver, until__gte=datetime.now().date()
        ).exists():
            return Response({"error": "Receiver is banned by sender"}, status=400)

        # Check if the sender is banned by the receiver
        if BannedUser.objects.filter(
            sender=receiver, receiver=sender, until__gte=datetime.now().date()
        ).exists():
            return Response({"error": "Sender is banned by receiver"}, status=400)

        # Create a new friendship
        friendship = Friendship.objects.create(
            sender=sender, receiver=receiver, status="pending"
        )
        serializer = self.get_serializer(friendship)
        return Response(serializer.data, status=201)

    # Update friendship status
    @action(detail=True, methods=["put"])
    def updateFriendshipStatus(self, request, friendship_id):
        try:
            friendship = Friendship.objects.get(id=friendship_id)
        except Friendship.DoesNotExist:
            return Response({"error": "Friendship not found"}, status=404)
        if not friendship.receiver == request.user:
            return Response(
                {"error": "You are not the receiver of this friendship"}, status=403
            )
        status = request.data.get("status", None)
        if not status:
            return Response({"error": "Status not provided"}, status=400)
        if status not in ["pending", "accepted", "rejected"]:
            return Response({"error": "Invalid status"}, status=400)
        friendship.status = status
        friendship.save()
        serializer = self.get_serializer(friendship)
        return Response(serializer.data, status=200)

    # Get list friendship sent from user
    @action(detail=True, methods=["get"])
    def listFriendshipsSent(self, request):
        sender = request.user
        friendships = Friendship.objects.filter(sender=sender)
        serializer = self.get_serializer(friendships, many=True)
        return Response(serializer.data, status=200)

    # Get list friendship received by user
    @action(detail=True, methods=["get"])
    def listFriendshipsReceived(self, request):
        receiver = request.user
        friendships = Friendship.objects.filter(receiver=receiver)
        serializer = self.get_serializer(friendships, many=True)
        return Response(serializer.data, status=200)

    # Get list friend of user
    @action(detail=True, methods=["get"])
    def listFriends(self, request):
        user = request.user
        friendships = Friendship.objects.filter(
            Q(sender=user) | Q(receiver=user), status="accepted"
        )
        friends = []
        for friendship in friendships:
            if friendship.sender == user:
                friends.append(friendship.receiver)
            else:
                friends.append(friendship.sender)
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data, status=200)

    # Ban a user to send friend invitation
    @action(detail=False, methods=["post"])
    def banUser(self, request):
        sender = request.user
        receiver_username = request.data.get("username", None)
        if not receiver_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)
        
        # Check is sender and receiver are same person
        if sender == receiver:
            return Response({"error": "Sender and receiver are the same person"}, status=400)

        # Check if the receiver is already banned by the sender
        if BannedUser.objects.filter(
            sender=sender, receiver=receiver, until__gte=datetime.now().date()
        ).exists():
            return Response({"error": "Receiver is already banned"}, status=400)
        # Check if the sender is already banned by the receiver
        if BannedUser.objects.filter(
            sender=receiver, receiver=sender, until__gte=datetime.now().date()
        ).exists():
            return Response({"error": "Sender is already banned"}, status=400)

        until_string = request.data.get("until", None)
        reason = request.data.get("bannedReason", None)
        if not until_string:
            until = datetime.max.date()
        else:
            until = parse_date(until_string)

        # Create a new banned user
        banned_user = BannedUser.objects.create(
            sender=sender, receiver=receiver, until=until, bannedReason=reason
        )

        # Check if sender and receiver are friend, unfriend if they are
        if Friendship.objects.filter(
            sender=sender, receiver=receiver, status="accepted"
        ).exists():
            friendship = Friendship.objects.get(
                sender=sender, receiver=receiver, status="accepted"
            )
            friendship.status = "rejected"
            friendship.save()

        if Friendship.objects.filter(
            sender=receiver, receiver=sender, status="accepted"
        ).exists():
            friendship = Friendship.objects.get(
                sender=receiver, receiver=sender, status="accepted"
            )
            friendship.status = "rejected"
            friendship.save()

        serializer = BannedUserSerializer(banned_user)
        return Response(serializer.data, status=201)

    # Unban a user
    @action(detail=True, methods=["post"])
    def unbanUser(self, request):
        sender = request.user
        receiver_username = request.data.get("username", None)
        if not receiver_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)

        # Check if the user isn't banned
        if not (
            BannedUser.objects.filter(
                sender=sender, receiver=receiver, until__gte=datetime.now().date()
            ).exists()
        ):
            return Response({"error": "Receiver is not banned"}, status=400)
        banned_user = BannedUser.objects.get(
            sender=sender, receiver=receiver, until__gte=datetime.now().date()
        )
        banned_user.until = datetime.min.date()
        banned_user.save()
        serializer = BannedUserSerializer(banned_user)
        return Response(serializer.data, status=200)

    # Muted user to send message
    @action(detail=False, methods=["post"])
    def muteUser(self, request):
        sender = request.user
        receiver_username = request.data.get("username", None)
        if not receiver_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)

        # Check if the receiver is already muted
        if MutedUser.objects.filter(
            sender=sender, receiver=receiver, until__gte=datetime.now().date()
        ).exists():
            return Response({"error": "Receiver is already muted"}, status=400)
        # Check if the sender is already muted
        if MutedUser.objects.filter(
            sender=receiver, receiver=sender, until__gte=datetime.now().date()
        ).exists():
            return Response({"error": "Sender is already muted"}, status=400)

        until_string = request.data.get("until", None)
        reason = request.data.get("reason", None)
        if not until_string:
            until = datetime.max.date()
        else:
            until = parse_date(until_string)

        # Create a new muted user
        muted_user = MutedUser.objects.create(
            sender=sender, receiver=receiver, until=until, mutedReason=reason
        )
        serializer = MutedUserSerializer(muted_user)
        return Response(serializer.data, status=201)

    # Unmute user to send message
    def unmuteUser(self, request):
        sender = request.user
        receiver_username = request.data.get("username", None)
        if not receiver_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({"error": "Receiver not found"}, status=404)

        # Check if the user is muted
        if not (
            MutedUser.objects.filter(
                sender=sender, receiver=receiver, until__gte=datetime.now().date()
            ).exists()
        ):
            return Response({"error": "Receiver is not muted"}, status=400)
        muted_user = MutedUser.objects.get(
            sender=sender, receiver=receiver, until__gte=datetime.now().date()
        )
        muted_user.until = datetime.min.date()
        muted_user.save()
        serializer = MutedUserSerializer(muted_user)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in [
            "inviteFriend",
            "updateFriendshipStatus",
            "banUser",
            "unbanUser",
            "muteUser",
            "unmuteUser",
            "listFriendshipsSent",
            "listFriendshipsReceived",
            "listFriends",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
