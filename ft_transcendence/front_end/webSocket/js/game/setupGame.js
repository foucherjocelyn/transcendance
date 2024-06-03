const { define_user_by_ID } = require("../webSocket/webSocket");
const { formPongGameWS } = require("./formBox");
const { send_data } = require("../webSocket/dataToClient");
const { countdown } = require("./countdown");
const { setup_game_settings, create_object_pong_game } = require("../gameSettings/gameSettings");
const { send_to_DB } = require("../dataToDB/dataToDB");

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

function    setup_game(match)
{
    send_to_DB('/api/v1/game', match, '');
    update_status_user(match, 'playing game');

    match.pongGame = new formPongGameWS();
    match.pongGame.maxPoint = 1; // max = 5
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
        }, 3000); // 3 secondes
    }
}

module.exports = {
    setup_game,
    update_status_user
};
