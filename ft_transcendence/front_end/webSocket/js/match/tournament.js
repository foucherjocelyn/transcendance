const { webSocket, define_user_by_ID } = require("../webSocket/webSocket");
const { setup_game } = require("../game/setupGame");
const { formMatch, create_match_ID, inforPlayer } = require("./createMatch");
const { define_match, update_match } = require("./updateMatch");
const { create_request } = require("../dataToDB/createRequest");
const { isNumeric } = require("../gameSettings/checkInputSize");
const { send_data } = require("../webSocket/dataToClient");

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
        }

        let currentRound = this.players;
        while (currentRound.length > 1) {
            const matches = [];
            for (let i = 0; i < currentRound.length; i += 2) {
                const player1 = currentRound[i];
                const player2 = i + 1 < currentRound.length ? currentRound[i + 1] : null;
                matches.push(this.simulateMatch(player1, player2, tournamentName, currentRound.length));
            }

            // Wait for all matches in the current round to complete
            const winners = await Promise.all(matches);
            currentRound = winners.filter((winner) => winner !== null);
            roundNumber++;
        }

        console.log("\nTournament completed!");
        return currentRound[0]; // Return the champion
    }

    checkGameOver(match, player1, player2, nbrPlayer) {
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (match.pongGame.gameOver && match.winner !== undefined) {
                    clearInterval(intervalId);
                    let winner = player1.id === match.winner.id ? player1 : player2;
                    resolve(winner);
                }
            }, 1000);
        });
    }

    async simulateMatch(player1, player2, tournamentName, nbrPlayer) {
        if (player1 === null || player2 === null) {
            let player = player1 !== null ? player1 : player2;
            player1 = player;
            player2 = null;
        }

        // player disconnect
        if (player2 !== null)
        {
            const   user = define_user_by_ID(player2.id);
            if (user === undefined) {
                player2 = null;
            }
        }

        if (nbrPlayer === 2 && player2 === null) {
            send_data('display exit match', 'flex', 'server', player1);
            return player1;
        }

        // create match + run
        await create_match_tournament(player1, player2, nbrPlayer);
        const match = define_match(player1);
        match.tournamentName = tournamentName;
        setup_game(match);

        // get winner
        const winner = await this.checkGameOver(match, player1, player2, nbrPlayer);

        // stop match AI
        const list_match_in_tournament = webSocket.listMatch.filter((match) => match.tournamentName === tournamentName);
        if (list_match_in_tournament.length > 0) {
            const list_match_AI = list_match_in_tournament.filter((match) => match.listUser.length === 1);
            if (list_match_AI.length > 0) {
                const matchAI = list_match_AI[0];
                matchAI.pongGame.gameOver = true;
            }
        }

        return winner;
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

async function create_match_tournament(player1, player2, nbrPlayer) {
    const match = new formMatch();
    match.id = await create_match_ID();
    match.id += player1.id;
    match.mode = "tournament";

    // define final match
    match.finalMatch = (nbrPlayer === 2) ? true : false;

    // get alias
    player1 = await create_request("GET", `/api/v1/users/${player1.id}`, "");
    player1.avatarPath = `img/${player1.avatarPath}`;
    if (player2 !== null) {
        player2 = await create_request("GET", `/api/v1/users/${player2.id}`, "");
        player2.avatarPath = `img/${player2.avatarPath}`;
    }

    for (let i = 0; i < 4; i++) {
        let player = new inforPlayer("", "", "../../img/button/button_add_player.png", 42, "none");
        if (i === 0) {
            player = new inforPlayer(player1.id, player1.alias, player1.avatarPath, player1.level, "player");
        } else if (i === 1) {
            if (player2 === null) {
                match.winner = player1;
                player = new inforPlayer("#42", "AI", "../../img/avatar/AI.png", 42, "AI");
            } else {
                player = new inforPlayer(player2.id, player2.alias, player2.avatarPath, player2.level, "player");
            }
        }
        match.listPlayer.push(player);
    }

    const user = define_user_by_ID(player1.id);
    user.matchID = match.id;
    user.status = "creating match";

    if (player2 !== null) {
        const user2 = define_user_by_ID(player2.id);
        user2.matchID = match.id;
        user2.status = "creating match";
    }

    match.admin = match.listPlayer[0];
    webSocket.listMatch.push(match);

    update_match(user);
}

function create_list_player_tournament(listName) {
    return new Promise((resolve, reject) => {
        try {
            const listPlayer = [];
            listName.forEach((name) => {
                for (let i = 0; i < webSocket.listUser.length; i++) {
                    const user = webSocket.listUser[i];
                    if (user !== undefined && user.username === name) {
                        listPlayer.push(user);
                        break;
                    }
                }
            });
            resolve(listPlayer);
        } catch (error) {
            reject(error);
        }
    });
}

function send_sign_create_tournament(title, sender) {
    for (let i = 0; i < webSocket.listUser.length; i++) {
        const user = webSocket.listUser[i];
        if (user !== undefined && user.username !== sender.username) {
            send_data(title, "", "server", user);
        }
    }
}

async function send_sign_join_tournament(title, tournamentID) {
    if (tournamentID === undefined || !isNumeric(tournamentID)) {
        return;
    }

    const tournament = await create_request("GET", `/api/v1/tournament/${tournamentID}`, "");
    tournament.player_usernames.forEach((userName) => {
        for (let i = 0; i < webSocket.listUser.length; i++) {
            const user = webSocket.listUser[i];
            if (user !== undefined && user.username === userName) {
                send_data(title, tournament, "server", user);
                break;
            }
        }
    });
}

async function start_tournament(tournamentID, sender) {
    console.table(`Start tournament: ${tournamentID}`);
    console.table(`Sender: ${sender}`);
    if (tournamentID === undefined || !isNumeric(tournamentID)) {
        return;
    }

    const tournament = await create_request("GET", `/api/v1/tournament/${tournamentID}`, "");
    if (sender.username !== tournament.owner_username || tournament.player_usernames.length < 2) {
        return;
    }

    // sign start tournament
    await create_request("POST", `/api/v1/tournament/${tournament.id}/start`, "");

    // call matchmaking
    const listPlayer = await create_list_player_tournament(tournament.player_usernames);
    listPlayer.forEach((player) => console.log(player.username));

    const matchMaker = new MatchMaking(listPlayer);
    const champion = await matchMaker.generateMatches(tournament.name);

    // sign end tournament
    await create_request("POST", `/api/v1/tournament/${tournament.id}/end`, "");

    // Update the champion of a tournament
    const postData = {
        username: `${champion.username}`,
    };
    await create_request("POST", `/api/v1/tournament/${tournament.id}/champion/update`, postData);
    console.log(`The champion is: ${champion.username}`);

    // display button exit match + send sign delete alias
    for (let i = 0; i < listPlayer.length; i++) {
        let user = listPlayer[i];
        send_data("delete alias", "", "server", user);
    }
}

module.exports = {
    start_tournament,
    send_sign_create_tournament,
    send_sign_join_tournament,
};
