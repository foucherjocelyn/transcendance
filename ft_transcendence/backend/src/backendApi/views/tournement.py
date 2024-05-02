from backendApi.models import Tournament
from backendApi.serializers.tournement import TournamentSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.decorators import action


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer


    def get_queryset(self):
        return Tournament.objects.order_by("id")

    # Create tournament view. Only admin can create tournament
    @action(detail=False, methods=["post"])
    def createTournament(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

    # Update tournament view. Only admin can update tournament
    @action(detail=True, methods=["put"])
    def updateTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
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
        if tournament.status != "ongoing":
            return Response({"error": "Tournament is not ongoing"}, status=400)
        tournament.players.add(user)
        tournament.save()
        serializer = self.get_serializer(tournament)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in ["joinTournament", "getTournamentById", "getAllTournaments"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
