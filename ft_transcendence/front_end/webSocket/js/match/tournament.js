const { webSocket, define_user_by_ID } = require("../webSocket/webSocket");
const { setup_game } = require("../game/setupGame");
const { formMatch, create_match_ID, inforPlayer } = require("./createMatch");
const { define_match, update_match } = require("./updateMatch");

class MatchMaking {
    constructor(players) {
        this.players = players;
        this.matches = [];
    }

    async generateMatches() {
        if (this.players.length === 1) {
            return this.players[0];
        }

        this.shufflePlayers();
        const winners = [];
        for (let i = 0; i < this.players.length; i += 2) {
            const player1 = this.players[i];
            const player2 = this.players[i + 1] || null;
            this.matches.push([player1, player2]);
            const winner = await this.simulateMatch(player1, player2);
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

    async simulateMatch(player1, player2) {

        // create match + run
        create_match_tournament(player1, player2);
        const   match = define_match(player1);
        setup_game(match);

        // get winner
        function checkGameOver() {
            return new Promise((resolve) => {
                const intervalId = setInterval(() => {
                    if (match.pongGame.gameOver) {
                        clearInterval(intervalId);
                        const winner = match.result[0];
                        resolve(winner);
                    }
                }, 1000);
            });
        }
        
        async function getWinner() {
            const winner = await checkGameOver();
            return winner;
        }
        try {    
            const winner = await getWinner();
            return winner
        }
        catch(e) {
            console.log(e);
        }
    }
}

function    create_match_tournament(player1, player2)
{
    const   match = new formMatch();
    match.id = create_match_ID();
    match.mode = 'tournament';

    for (let i = 0; i < 4; i++)
    {
        let   player = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
        if (i === 0) {
            player = new inforPlayer(player1.id, player1.username, player1.avatarPath, player1.level, 'player');
        }
        else if (i === 1) {
            player = new inforPlayer(player2.id, player2.username, player2.avatarPath, player2.level, 'player');
        }
        match.listPlayer.push(player);
    }

    const   user = define_user_by_ID(player1.id);
    const   user2 = define_user_by_ID(player2.id);

    user.matchID = match.id;
    user2.matchID = match.id;

    user.status = 'creating match';
    user2.status = 'creating match';

    match.admin = match.listPlayer[0];
    webSocket.listMatch.push(match);

    update_match(user);
}

const   listPlayer = [];

async function    join_the_tournament(user)
{
    listPlayer.push(user);
    if (listPlayer.length !== 2) {
        return ;
    }

    const matchMaker = new MatchMaking(listPlayer);
    const champion = await matchMaker.generateMatches();
    console.log(`The champion is: ${champion}`);
}

module.exports = {
    join_the_tournament
}
