const { setup_game } = require("../game/setupGame");
const { accept_invitation_to_play } = require("./acceptInvitationPlay");
const { create_match } = require("./createMatch");
const { define_match } = require("./updateMatch");

class MatchMaking {
    constructor(players) {
        this.players = players;
        this.matches = [];
    }

    generateMatches() {
        if (this.players.length === 1) {
            return this.players[0];
        }

        this.shufflePlayers();
        const winners = [];
        for (let i = 0; i < this.players.length; i += 2) {
            const player1 = this.players[i];
            const player2 = this.players[i + 1] || null;
            this.matches.push([player1, player2]);
            const winner = this.simulateMatch(player1, player2);
            winners.push(winner);
        }

        this.players = winners;
        return this.generateMatches();
    }

    shufflePlayers() {
        for (let i = this.players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
        }
    }

    simulateMatch(player1, player2) {

        // create match + run
        create_match(player1, 'tournament');
        const   match = define_match(player1);
        match.listInvite.push(player2);
        accept_invitation_to_play(player2, player1);
        setup_game(match);

        // get winner
        const intervalId = setInterval(function()
        {
            if (match.pongGame.gameOver)
            {
                clearInterval(intervalId);
                const   winner = match.result[0]
                return winner;
            }
        }, 1000);
    }
}

const   listPlayer = [];

function    join_the_tournament(user)
{
    listPlayer.push(user);
    if (listPlayer.length !== 2) {
        return ;
    }

    const matchMaker = new MatchMaking(listPlayer);
    const champion = matchMaker.generateMatches();
    console.log(`The champion is: ${champion}`);
}

module.exports = {
    join_the_tournament
}
