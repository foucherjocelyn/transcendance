const { send_data } = require("../webSocket/dataToClient");
const { define_match } = require("../webSocket/updateMatch");
const { webSocket } = require("../webSocket/webSocket");
const { create_ball_ws } = require("./createBallWS");
const { create_borders_ws } = require("./createBorderWS");
const { create_paddles_ws } = require("./createPaddleWS");

class formGameSetting {
    constructor() {
        this.size = {
            table: {
                width: 31,
                height: 30
            },
            border: 1,
            paddle: {
                width: 5,
                height: 1
            },
            ball: 1
        },
        this.color = {
            plane: '#241f31',
            border: '#ffffff',
            paddles: {
                player1: '#3584e4',
                player2: '#9141ac',
                player3: '#f6d32d',
                player4: '#33d17a'
            },
            ball: '#ff0000'
        },
        this.speed = {
            paddle: 0.5,
            ball: 0.1
        },
        this.control = {
            player1: {
                left: 'q',
                right: 'a'
            },
            player2: {
                left: 'p',
                right: 'm'
            },
            player3: {
                left: 'z',
                right: 'e'
            },
            player4: {
                left: 'i',
                right: 'o'
            }
        }
    }
}

function    setup_limit_table(pongGame, gameSettings)
{
    pongGame.limit.top = -(gameSettings.size.table.height / 2);
    pongGame.limit.bottom = gameSettings.size.table.height / 2;
    pongGame.limit.left = -(gameSettings.size.table.width / 2);
    pongGame.limit.right = gameSettings.size.table.width / 2;
}

function    setup_game_settings_WS(match)
{
    match.gameSettings = new formGameSetting();
    setup_limit_table(match.pongGame, match.gameSettings);
    send_data('update game settings', match.gameSettings, 'server', match.listUser);
}

function    create_object_pong_game(match)
{
    create_borders_ws(match);
    create_paddles_ws(match);
    create_ball_ws(match);
}

function    update_game_settings_ws(data)
{
    let indexMatch = define_match(data.from);
    if (indexMatch === undefined)
        return false;

    const   match = webSocket.listMatch[indexMatch];
    match.gameSettings = data.content;
    setup_limit_table(match.pongGame, match.gameSettings);
    create_object_pong_game(match);
    send_data(data.title, data.content, data.from, data.to);
}

module.exports = {
    setup_game_settings_WS,
    update_game_settings_ws,
    create_object_pong_game
};
