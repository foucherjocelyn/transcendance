from backendApi.serializers.game import GameSerializer
from backendApi.serializers.game_score import GameScoreSerializer
from backendApi.models import Game, User, GameScore, Tournament

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from backendApi.permissions import IsWebSocketServer, IsAuthenticatedOrIsWebSocketServer
from rest_framework.response import Response
from rest_framework.decorators import action
from backend.settings import logger
from decimal import Decimal

class GameViewSet(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    # Create game view
    @action(detail=False, methods=["post"])
    def createGame(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

    # Get game view
    @action(detail=True, methods=["get"])
    def getGame(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=200)

    # Add player to game
    @action(detail=True, methods=["post"])
    def addPlayerToGame(self, request, game_id):
        logger.info(request.data)
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        player_username = request.data.get("username", None)
        if not player_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            player = User.objects.get(username=player_username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if game.players.filter(id=player.id).exists():
            return Response({"error": "User is already part of the game"}, status=400)
        # Check is game is in 'tournament' mode and the player is part of the tournament
        if game.mode == "tournament":
            tournament = game.tournament
            if not tournament.players.filter(id=player.id).exists():
                return Response(
                    {"error": "User is not part of the tournament"}, status=400
                )
        # Verify if the number of players is 4, so cant add more players
        if len(game.players.all()) >= 4:
            return Response(
                {"error": "Game is full, cannot add more players"}, status=400
            )
        game.players.add(player)
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=200)

    # Remove player from game
    @action(detail=True, methods=["post"])
    def removePlayerFromGame(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        player_username = request.data.get("username", None)
        if not player_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            player = User.objects.get(username=player_username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if not game.players.filter(id=player.id).exists():
            return Response({"error": "User is not part of the game"}, status=400)
        game.players.remove(player)
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=200)

    # End game
    @action(detail=True, methods=["post"])
    def endGame(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        if game.status != "end":
            game.status = "end"
            game.save()
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=200)

    # Add the score of a player
    @action(detail=True, methods=["post"])
    def addScore(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        player_username = request.data.get("username", None)
        if not player_username:
            return Response({"error": "Username not provided"}, status=400)
        score = request.data.get("score", None)
        if not score:
            return Response({"error": "Score not provided"}, status=400)
        try:
            player = User.objects.get(username=player_username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if not game.players.filter(id=player.id).exists():
            return Response({"error": "User is not part of the game"}, status=400)
        game_score, created = GameScore.objects.get_or_create(game=game, player=player)
        game_score.score = score
        game_score.save()
        return Response(
            {"message": f"Score of the player {player_username} added or updated"},
            status=200,
        )

    @action(detail=True, methods=["post"])
    def updateWinnerOfGame(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        # Find the winner from game scores
        scores = GameScore.objects.filter(game=game)
        if not scores.exists():
            return Response({"error": "No scores found"}, status=400)
        max_score = scores.order_by("-score").first()
        winner = max_score.player
        game.winner = winner
        game.winnerScore = max_score.score
        game.save()
        return Response({"message": "Winner updated successfully"}, status=200)

    @action(detail=True, methods=["post"])
    def levelUpWinner(self, request, game_id):
        # Get the winner of the game
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        if game.status != "end":
            return Response({"error": "Game is not ended"}, status=400)
        winner = game.winner
        if not winner:
            return Response({"error": "No winner found"}, status=400)
        # Update the level of the winner
        if game.mode == "tournament":
            winner.level += Decimal(0.5)
        elif game.mode == "ranked":
            winner.level += Decimal(0.25)
        winner.save()
        return Response({"message": "Winner level up successfully"}, status=200)

    # List all game of a user
    @action(detail=True, methods=["post"])
    def listAllGamesByUser(self, request):
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        games = Game.objects.filter(players=user)
        serializer = self.get_serializer(games, many=True)
        return Response(serializer.data, status=200)

    # List all scores of a user
    @action(detail=True, methods=["post"])
    def listAllScoresByUser(self, request):
        username = request.data.get("username", None)
        if not username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        scores = GameScore.objects.filter(player=user)
        serializer = GameScoreSerializer(scores, many=True)
        return Response(serializer.data, status=200)
    
    @action(detail=True, methods=["get"])
    def listGamesByTournament(self, request, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=404)
        games = Game.objects.filter(tournament=tournament)
        serializer = self.get_serializer(games, many=True)
        return Response(serializer.data, status=200)

    def get_permissions(self):
        if self.action in [
            "createGame",
            "getGame",
            "addPlayerToGame",
            "removePlayerFromGame",
            "endGame",
            "addScore",
            "updateWinnerOfGame",
            "levelUpWinner",
            "listAllGamesByUser",
            "listAllScoresByUser",
            "listGamesByTournament",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
