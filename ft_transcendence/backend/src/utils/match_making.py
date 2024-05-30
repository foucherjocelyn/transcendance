import random

class MatchMaking:
    def __init__(self, players):
        self.players = players
        self.matchs = []

    def generate_matches(self):
        if len(self.players) == 1:
            return self.players[0]

        random.shuffle(self.players)
        matches = []
        winners = []
        for i in range(0, len(self.players), 2):
            player1 = self.players[i]
            player2 = self.players[i + 1] if i + 1 < len(self.players) else None
            matches.append([player1, player2])
            winner = self.simulate_match(player1, player2)
            winners.append(winner)

        self.players = winners
        self.matchs.extend(matches)
        return self.generate_matches()

    def simulate_match(self, player1, player2):
        print(f"Simulating match between {player1} and {player2}")
        if not player2:
            return player1

        winner = random.choice([player1, player2])
        loser = player2 if winner == player1 else player1
        return winner

players = ["Seed 1", "Seed 2", "Seed 3", "Seed 4", "Seed 5", "Seed 6", "Seed 7", "Seed 8"]
match_maker = MatchMaking(players)
champion = match_maker.generate_matches()
print(f"Matchs: {match_maker.matchs}")
print(f"The champion is: {champion}")
