const { send_data } = require("../webSocket/dataToClient");
const { countdownWS } = require("./countdownWS");
const { formPongGameWS } = require("./formBox");
const { setup_game_settings_WS, create_object_pong_game } = require("./gameSettingsWS");

function    setup_game_WS(match)
{
    match.pongGame = new formPongGameWS();
    match.pongGame.maxPoint = 5;
    match.pongGame.listPlayer = match.listPlayer;
    match.pongGame.listUser = match.listUser;
    send_data('update pongGame', match.pongGame, 'server', match.listUser);

    setup_game_settings_WS(match);
    countdownWS(match);
    create_object_pong_game(match);
}

module.exports = {
    setup_game_WS
};
