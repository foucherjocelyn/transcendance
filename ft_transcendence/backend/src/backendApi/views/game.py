from backendApi.serializers.game import GameSerializer
from backendApi.models import Game, User, GameScore

from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action


class GameViewSet(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    # Create game view
    @action(detail=False, methods=["post"])
    def createGame(self, request):
        user = request.user
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
        # Check if user is part of the game
        user = request.user
        if not game.players.filter(id=user.id).exists():
            return Response({"error": "You are not part of this game"}, status=403)
        serializer = self.get_serializer(game)
        return Response(serializer.data, status=200)

    # Add player to game
    @action(detail=True, methods=["post"])
    def addPlayerToGame(self, request, game_id):
        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist:
            return Response({"error": "Game not found"}, status=404)
        user = request.user
        if game.owner != user:
            return Response(
                {"error": "Only the owner can add players to the game"}, status=403
            )
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
        user = request.user
        if game.owner != user:
            return Response(
                {"error": "Only the owner can remove players from the game"},
                status=403,
            )
        player_username = request.data.get("username", None)
        if not player_username:
            return Response({"error": "Username not provided"}, status=400)
        try:
            player = User.objects.get(username=player_username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if not game.players.filter(id=player.id).exists():
            return Response({"error": "User is not part of the game"}, status=400)
        if player == game.owner:
            return Response({"error": "Cannot remove the owner"}, status=400)
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
        user = request.user
        # Check if user is part of the game
        if not game.players.filter(id=user.id).exists():
            return Response({"error": "You are not part of this game"}, status=403)
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
        # Update the winner of the game
        scores = GameScore.objects.filter(game=game)
        # Get the player with the highest score
        winner = scores.order_by("-score").first().player
        winnerScore = scores.order_by("-score").first().score
        game.winner = winner
        game.winnerScore = winnerScore
        game.save()
        return Response(
            {"message": f"Score of the player {player_username} added or updated"},
            status=200,
        )

    def get_permissions(self):
        if self.action in [
            "createGame",
            "getGame",
            "addPlayerToGame",
            "removePlayerFromGame",
            "endGame",
            "addScore",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
