const { define_user_by_ID } = require("../webSocket/webSocket");
const { formPongGameWS } = require("./formBox");
const { send_data } = require("../webSocket/dataToClient");
const { countdown } = require("./countdown");
const { setup_game_settings, create_object_pong_game } = require("../gameSettings/gameSettings");
const { request_game_DB } = require("../dataToDB/requestGame");

function    start_game(match)
{
    send_data('start game', '', 'server', match.listUser);
    setup_game_settings(match);
    countdown(match);
    create_object_pong_game(match);
}

function    update_status_user(match, status)
{
    match.listUser.forEach(player => {
        const user = define_user_by_ID(player.id);
        user.status = status;
        user.matchID = match.id;
    })
}

async function    setup_game(match)
{
    if (match.mode !== 'offline')
    {
        let responseDB = await request_game_DB('/api/v1/game', match, match.listUser[0]);
        // if (!responseDB)
        //     return ;
        for (let i = 0; i < match.listPlayer.length; i++)
        {
            const   player = match.listPlayer[i];
            if (player.type === 'player') {
                responseDB = await request_game_DB(`/api/v1/game/${match.id}/player/add`, match, player);
                // if (!responseDB)
                //     return ;
                responseDB = await request_game_DB(`/api/v1/game/${match.id}/score`, match, player);
                // if (!responseDB)
                //     return ;
            }
        }
    }

    update_status_user(match, 'playing game');

    match.pongGame = new formPongGameWS();
    match.pongGame.tournamentID = match.tournamentID;
    match.pongGame.maxPoint = (match.mode === 'tournament') ? 3 : 5;
    match.pongGame.listPlayer = match.listPlayer;
    match.pongGame.listUser = match.listUser;

    send_data('update pongGame', match.pongGame, 'server', match.listUser);
    if (match.mode !== 'ranked' && match.mode !== 'tournament') {
        start_game(match);
    }
    else
    {
        setTimeout(function() {
            start_game(match);
        }, 5000);
    }
}

module.exports = {
    setup_game,
    update_status_user
};
