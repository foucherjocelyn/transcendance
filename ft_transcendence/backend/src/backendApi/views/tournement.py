from backendApi.models import Tournament, User
from backendApi.serializers.tournement import TournamentSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.decorators import action
from backend.settings import logger
from backendApi.permissions import IsWebSocketServer


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    def get_queryset(self):
        return Tournament.objects.order_by("id")

    # Create tournament view.
    @action(detail=False, methods=["post"])
    def createTournament(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

    # Update tournament view.
    @action(detail=True, methods=["put"])
    def updateTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        user = request.user
        if not tournament.owner == user:
            return Response(
                {"error": "You are not the owner of this tournament"}, status=403
            )
        serializer = self.get_serializer(tournament, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    # Get tournement by id
    @action(detail=True, methods=["get"])
    def getTournamentById(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        serializer = self.get_serializer(tournament)
        return Response(serializer.data, status=200)

    # Get all tournaments
    @action(detail=True, methods=["get"])
    def getAllTournaments(self, request):
        tournaments = Tournament.objects.all()
        serializer = self.get_serializer(tournaments, many=True)
        return Response(serializer.data, status=200)

    # Join a tournament. Only authenticated user can join tournament
    @action(detail=True, methods=["post"])
    def joinTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        user = request.user
        if tournament.players.filter(id=user.id).exists():
            return Response({"error": "User already joined"}, status=400)
        # Check is the tournament status is ongoing
        if tournament.status != "registering":
            return Response({"error": "Tournament is not registering"}, status=400)
        tournament.players.add(user)
        tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data, status=200)

    # Leave a tournament. Only authenticated user can leave tournament
    @action(detail=True, methods=["post"])
    def leaveTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        user = request.user
        if not tournament.players.filter(id=user.id).exists():
            return Response({"error": "User not joined"}, status=400)
        # Check is the tournament status is registering
        if tournament.status != "registering":
            return Response({"error": "Tournament is not registering"}, status=400)
        tournament.players.remove(user)
        tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data, status=200)

    # Start a tournament
    @action(detail=True, methods=["post"])
    def startTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        user = request.user
        if not tournament.owner == user:
            return Response(
                {"error": "You are not the owner of this tournament"}, status=403
            )
        if tournament.status == "progressing":
            return Response({"error": "Tournament is already progressing"}, status=400)
        if tournament.status == "registering":
            tournament.status = "progressing"
            tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data, status=200)

    # End a tournament
    @action(detail=True, methods=["post"])
    def endTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        user = request.user
        if not tournament.owner == user:
            return Response(
                {"error": "You are not the owner of this tournament"}, status=403
            )
        if tournament.status == "progressing":
            tournament.status = "finished"
            tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data, status=200)

    # Delete a tournament
    @action(detail=True, methods=["delete"])
    def deleteTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        user = request.user
        if not tournament.owner == user:
            return Response(
                {"error": "You are not the owner of this tournament"}, status=403
            )
        if not tournament.status == "registering":
            return Response({"error": "Tournament is not registering"}, status=400)
        if tournament.players.count() > 0:
            tournament.players.clear()
        tournament.delete()
        return Response({"message": "Tournament deleted successfully"}, status=200)

    # Update the champion of a tournament
    @action(detail=True, methods=["post"])
    def updateChampion(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Champion username not provided"}, status=400)
        user = request.user
        if not tournament.owner == user:
            return Response(
                {"error": "You are not the owner of this tournament"}, status=403
            )
        try:
            champion = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "Champion not found"}, status=404)
        tournament.champion = champion
        tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in [
            "createTournament",
            "updateTournament",
            "joinTournament",
            "getTournamentById",
            "getAllTournaments",
            "leaveTournament",
            "startTournament",
            "endTournament",
            "deleteTournament",
            "updateChampion",
        ]:
            self.permission_classes = [IsAuthenticated, IsWebSocketServer]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
