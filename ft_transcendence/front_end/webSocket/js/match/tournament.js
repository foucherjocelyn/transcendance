const { webSocket, define_user_by_ID, update_informations_user } = require("../webSocket/webSocket");
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

    async generateMatches(tournamentID, tournamentName) {
        let roundNumber = 1;
    
        // Shuffle players before the first round
        if (roundNumber === 1) {
            this.shufflePlayers();
            const orderedPlayersUsername = this.players.map(player => player.username);
            const response = await create_request("POST", `/api/v1/tournament/${tournamentID}/players/order/update`, {"players" : orderedPlayersUsername});
            if (!response)
                return ;
        }

        let currentRound = this.players;
        while (currentRound.length > 1) {
            const matches = [];
    
            // Send signal to update tournament tree
            // send_data("update tournament tree", currentRound, tournamentID, currentRound);
            send_data("update tournament tree", tournamentID, 'server', currentRound);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds
    
            for (let i = 0; i < currentRound.length; i += 2) {
                const player1 = currentRound[i];
                const player2 = i + 1 < currentRound.length ? currentRound[i + 1] : null;
                matches.push(this.simulateMatch(player1, player2, tournamentID, tournamentName, currentRound.length));
            }
    
            // Wait for all matches in the current round to complete
            const winners = await Promise.all(matches);
            currentRound = winners.filter((winner) => winner !== null);
            roundNumber++;
        }
    
        console.log("\nTournament completed!");
        return currentRound[0]; // Return the champion
    }

    checkGameOver(match, player1, player2)
    {
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (match.pongGame.gameOver && match.winner !== undefined)
                {
                    clearInterval(intervalId);
                    let winner = player1.id === match.winner.id ? player1 : player2;
                    resolve(winner);
                }
            }, 1000);
        });
    }

    async simulateMatch(player1, player2, tournamentID, tournamentName, nbrPlayer)
    {
        // disconnect befor create match
        if (define_user_by_ID(player1.id) === undefined) {
            player1 = null;
        }
        if (player2 !== null && define_user_by_ID(player2.id) === undefined) {
            player2 = null;
        }
        
        // 2 user disconnect
        if (player1 === null && player2 === null) {
            return null;
        }
        if (player1 === null || player2 === null)
        {
            let player = player1 !== null ? player1 : player2;
            player1 = player;
            player2 = null;
        }

        if (nbrPlayer === 2 && player2 === null) {
            send_data('display exit match', 'flex', 'server', player1);
            return player1;
        }

        // create match + run
        await create_match_tournament(player1, player2, nbrPlayer);
        const match = define_match(player1);
        if (match === undefined) {
            return player1;
        }
        
        match.tournamentID = tournamentID,
        match.tournamentName = tournamentName;
        setup_game(match);

        // get winner
        const winner = await this.checkGameOver(match, player1, player2);

        // stop match AI
        const list_match_in_tournament = webSocket.listMatch.filter((match) => match.tournamentName === tournamentName);
        if (list_match_in_tournament.length > 0)
        {
            const list_match_AI = list_match_in_tournament.filter((match) => match.listPlayer[1].type === 'AI');
            if (list_match_AI.length > 0)
            {
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
    match.winner = player1;

    // define final match
    match.finalMatch = (nbrPlayer === 2) ? true : false;

    for (let i = 0; i < 4; i++)
    {
        let player = new inforPlayer("", "", "../../img/button/button_add_player.png", 42, "none");
        if (i === 0) {
            player = new inforPlayer(player1.id, player1.alias, player1.avatarPath, player1.level, "player");
        }
        else if (i === 1)
        {
            if (player2 === null) {
                player = new inforPlayer("#42", "AI", "../../img/avatar/AI.png", 42, "AI");
            }
            else {
                player = new inforPlayer(player2.id, player2.alias, player2.avatarPath, player2.level, "player");
            }
        }
        match.listPlayer.push(player);
    }

    const user = define_user_by_ID(player1.id);
    user.matchID = match.id;
    user.status = "creating match";

    if (player2 !== null)
    {
        const user2 = define_user_by_ID(player2.id);
        user2.matchID = match.id;
        user2.status = "creating match";
    }

    match.admin = match.listPlayer[0];
    webSocket.listMatch.push(match);

    update_match(user);
}

async function create_list_player_tournament(listName)
{
    try {
        const listPlayer = [];
        for (const name of listName)
        {
            for (let i = 0; i < webSocket.listUser.length; i++)
            {
                const user = await create_request("GET", `/api/v1/users/${webSocket.listUser[i].id}`, "");
                if (user !== undefined && user.username === name)
                {
                    user.avatarPath = `img/${user.avatarPath}`;
                    listPlayer.push(user);
                    break;
                }
            }
        }
        return listPlayer;
    } catch (error) {
        throw error;
    }
}

function send_sign_update_tournament_board(sender)
{
    // update alias on socket server
    update_informations_user(sender);

    for (let i = 0; i < webSocket.listUser.length; i++)
    {
        const user = webSocket.listUser[i];
        if (user !== undefined && user.username !== sender.username) {
            send_data('update tournament board', "", "server", user);
        }
    }
}

async function send_sign_join_tournament(title, tournamentID, sender)
{
    if (tournamentID === undefined || !isNumeric(tournamentID)) {
        return;
    }

    // update alias on socket server
    update_informations_user(sender);

    const tournament = await create_request("GET", `/api/v1/tournament/${tournamentID}`, "");
    if (!tournament)
        return ;
    tournament.player_usernames.forEach((userName) => {
        for (let i = 0; i < webSocket.listUser.length; i++)
        {
            const user = webSocket.listUser[i];
            if (user !== undefined && user.username === userName)
            {
                send_data(title, tournament, "server", user);
                break;
            }
        }
    });
}

async function  send_to_all(tournamentID, sender, title)
{
    // check number tournament ID from client
    if (tournamentID === undefined || !isNumeric(tournamentID)) {
        return;
    }

    const tournament = await create_request("GET", `/api/v1/tournament/${tournamentID}`, "");
    if (!tournament)
        return ;
    if (sender.username !== tournament.owner_username) {
        return ;
    }
    
    const listPlayer = await create_list_player_tournament(tournament.player_usernames);
    send_data(title, "", "server", listPlayer);
}

async function  delete_alias(listPlayer)
{
    for (let i = 0; i < listPlayer.length; i++)
    {
        const   user = listPlayer[i];
        const   postData = {
            user: user.username
        }
        let responseDB = await create_request('POST', '/api/v1/profile/me/alias/remove', postData);
        if (!responseDB)
            return ;

        // update alias on socket server
        update_informations_user(user);
    }
}

async function  delete_tournament(title, tournamentID, sender)
{
    // check number tournament ID from client
    if (tournamentID === undefined || !isNumeric(tournamentID)) {
        return;
    }

    // get tournament Obj from DB
    const tournament = await create_request("GET", `/api/v1/tournament/${tournamentID}`, "");
    
    // check sender is admin + number of player in tournament
    if (tournament === undefined || sender.username !== tournament.owner_username) {
        return;
    }

    const   listPlayer = await create_list_player_tournament(tournament.player_usernames);
    delete_alias(listPlayer);
    send_data(title, '', sender, listPlayer);
}

async function start_tournament(tournamentID, sender)
{
    let responseDB;
    // check number tournament ID from client
    if (tournamentID === undefined || !isNumeric(tournamentID)) {
        return;
    }

    // get tournament Obj from DB
    const tournament = await create_request("GET", `/api/v1/tournament/${tournamentID}`, "");
    
    // check sender is admin + number of player in tournament
    if (tournament === undefined || sender.username !== tournament.owner_username || tournament.player_usernames.length < 2) {
        return;
    }

    // notify all users that the tournament is about to start
    send_to_all(tournament.id, sender, 'send notif');

    // sign start tournament
    responseDB = await create_request("POST", `/api/v1/tournament/${tournament.id}/start`, "");
    if (!responseDB)
        return ;

    // call matchmaking
    const listPlayer = await create_list_player_tournament(tournament.player_usernames);
    const matchMaker = new MatchMaking(listPlayer);
    const champion = await matchMaker.generateMatches(tournament.id, tournament.name);

    // sign end tournament
    responseDB = await create_request("POST", `/api/v1/tournament/${tournament.id}/end`, "");
    if (!responseDB)
        return ;

    // Update the champion of a tournament
    if (champion !== undefined)
    {
        const postData = {
            username: `${champion.username}`,
        };
        responseDB = await create_request("POST", `/api/v1/tournament/${tournament.id}/champion/update`, postData);
        if (!responseDB)
            return ;
        console.log(`The champion is: ${champion.username}`);
        send_data('display exit match', 'flex', 'server', champion);
    }

    // delete alias
    delete_alias(listPlayer);

    // update status tournament on client
    send_data('update tournament board', "", "server", webSocket.listUser);
}

module.exports = {
    start_tournament,
    send_sign_update_tournament_board,
    send_sign_join_tournament,
    send_to_all,
    delete_alias,
    delete_tournament
};
