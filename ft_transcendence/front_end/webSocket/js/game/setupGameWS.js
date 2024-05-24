const { send_data } = require("../webSocket/dataToClient");
const { countdownWS } = require("./countdownWS");
const { formPongGameWS } = require("./formBox");
const { setup_game_settings_WS, create_object_pong_game } = require("./gameSettingsWS");

function    start_game(data, match)
{
    send_data(data.title, data.content, data.from, match.listUser);
    setup_game_settings_WS(match);
    countdownWS(match);
    create_object_pong_game(match);
}

function    setup_game_WS(data, match)
{
    match.pongGame = new formPongGameWS();
    match.pongGame.maxPoint = 5;
    match.pongGame.listPlayer = match.listPlayer;
    match.pongGame.listUser = match.listUser;

    send_data('update pongGame', match.pongGame, 'server', match.listUser);
    if (match.mode !== 'ranked' && match.mode !== 'tournament')
        start_game(data, match);
    else
    {
        setTimeout(function() {
            start_game(data, match);
        }, 3000); // 3 secondes
    }
}

module.exports = {
    setup_game_WS
};
