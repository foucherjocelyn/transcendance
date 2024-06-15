const { webSocket, define_user_by_ID } = require("../webSocket/webSocket");
const { setup_game } = require("../game/setupGame");
const { formMatch, create_match_ID, inforPlayer } = require("./createMatch");
const { define_match, update_match } = require("./updateMatch");
const { create_request } = require("../dataToDB/createRequest");
const { isNumeric } = require("../gameSettings/checkInputSize");

class MatchMaking {
    constructor(players) {
        this.players = players;
    }

    shufflePlayers() {
        for (let i = this.players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
        }
    }

    async generateMatches(tournamentName) {
        let roundNumber = 1;

        // Shuffle players before the first round
        if (roundNumber === 1) {
            this.shufflePlayers();
            console.log("Players have been shuffled for the first round.");
        }

        let currentRound = this.players;
        while (currentRound.length > 1) {
            console.log(`\nRound ${roundNumber}:`);
            console.log(`Current round players: ${currentRound.join(", ")}`);

            const matches = [];
            for (let i = 0; i < currentRound.length; i += 2) {
                const player1 = currentRound[i];
                const player2 = i + 1 < currentRound.length ? currentRound[i + 1] : null;
                matches.push(this.simulateMatch(player1, player2, tournamentName));
            }

            // Wait for all matches in the current round to complete
            const winners = await Promise.all(matches);
            currentRound = winners.filter((winner) => winner !== null);
            roundNumber++;
        }

        console.log("\nTournament completed!");
        return currentRound[0]; // Return the champion
    }

    checkGameOver(match, player1, player2) {
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (match.pongGame.gameOver) {
                    clearInterval(intervalId);
                    let winner = (player1.id === match.winner.id) ? player1 : player2;
                    resolve(winner);
                }
            }, 1000);
        });
    }

    async simulateMatch(player1, player2, tournamentName) {
        if (player1 === null || player2 === null)
        {
            let   player = (player1 !== null) ? player1 : player2;
            player1 = player;
            player2 = null;
            console.table(player);
            return player;
        }

        // create match + run
        await create_match_tournament(player1, player2);
        const   match = define_match(player1);
        match.tournamentName = tournamentName;
        setup_game(match);

        // get winner
        const winner = await this.checkGameOver(match, player1, player2);
        return winner;
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

async function    create_match_tournament(player1, player2)
{
    const   match = new formMatch();
    match.id = await create_match_ID();
    match.id += player1.id;
    match.mode = 'tournament';

    for (let i = 0; i < 4; i++)
    {
        let   player = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
        if (i === 0) {
            player = new inforPlayer(player1.id, player1.username, player1.avatarPath, player1.level, 'player');
        }
        else if (i === 1) {
            if (player2 === null) {
                player = new inforPlayer('#42', 'AI', "../../img/avatar/AI.png", 42, 'AI');
            }
            else {
                player = new inforPlayer(player2.id, player2.username, player2.avatarPath, player2.level, 'player');
            }
        }
        match.listPlayer.push(player);
    }

    const   user = define_user_by_ID(player1.id);
    user.matchID = match.id;
    user.status = 'creating match';

    if (player2 !== null) {
        const   user2 = define_user_by_ID(player2.id);
        user2.matchID = match.id;
        user2.status = 'creating match';
    }

    match.admin = match.listPlayer[0];
    webSocket.listMatch.push(match);

    update_match(user);
}

function create_list_player_tournament(listName) {
    return new Promise((resolve, reject) => {
        try {
            const listPlayer = [];
            listName.forEach((name, index) => {
                const user = webSocket.listUser[index];
                if (user.username === name) {
                    listPlayer.push(user);
                }
            });
            resolve(listPlayer);
        } catch (error) {
            reject(error);
        }
    });
}

async function    start_tournament(tournamentID, sender)
{
    if (tournamentID === undefined || !isNumeric(tournamentID)) {
        return ;
    }

    const   tournament = await create_request('GET', `/api/v1/tournament/${tournamentID}`, '');
    const   tournamentName = tournament.name;
    const   listPlayer = await create_list_player_tournament(tournament.player_usernames);

    if (sender.username !== tournament.owner_username) {
        console.log('------> not owner_username: ' + sender.username);
        return ;
    }
    
    // sign start tournament
    await create_request('POST', `/api/v1/tournament/${tournament.id}/start`, '');

    // call matchmaking
    const matchMaker = new MatchMaking(listPlayer);
    const champion = await matchMaker.generateMatches(tournamentName);

    // sign end tournament
    await create_request('POST', `/api/v1/tournament/${tournament.id}/end`, '');
    
    // Update the champion of a tournament
    const   postData = {
        username: `${champion.username}`
    };
    await create_request('POST', `/api/v1/tournament/${tournament.id}/champion/update`, postData);
    console.log(`The champion is: ${champion.username}`);
}

module.exports = {
    start_tournament
}
