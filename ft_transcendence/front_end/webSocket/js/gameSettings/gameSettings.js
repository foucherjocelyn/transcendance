const { send_data } = require("../webSocket/dataToClient");
const { define_match } = require("../match/updateMatch");

const { create_ball } = require("../game/createBall");
const { create_borders } = require("../game/createBorder");
const { create_paddles } = require("../game/createPaddle");

const { check_game_settings_size } = require("./checkInputSize");
const { check_game_settings_color } = require("./checkInputColor");
const { check_game_settings_speed } = require("./checkInputSpeed");
const { check_game_settings_control } = require("./checkInputControl");

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
            paddle: 1.608,
            ball: 0.001
        },
        this.control = {
            player1: {
                left: 'q',
                right: 'a'
            },
            player2: {
                left: 'p',
                right: 'l'
            },
            player3: {
                left: 'w',
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

function    setup_game_settings(match)
{
    match.gameSettings = new formGameSetting();
    setup_limit_table(match.pongGame, match.gameSettings);
    send_data('update game settings', match.gameSettings, 'server', match.listUser);
}

function    create_object_pong_game(match)
{
    create_borders(match);
    create_paddles(match);
    create_ball(match);
}

function    check_game_settings(match, gameSettings)
{
    if (!check_game_settings_size(gameSettings)) {
        return false;
    }
    if (!check_game_settings_color(gameSettings)) {
        return false;
    }
    if (!check_game_settings_speed(gameSettings)) {
        return false;
    }
    if (match.mode !== 'offline') {
        return true;
    }
    if (!check_game_settings_control(match.gameSettings, gameSettings)) {
        return false;
    }
    return true;
}

function    update_game_settings(sender, newGameSettings)
{
    const   match = define_match(sender);
    if (match === undefined) {
        return false;
    }

    // check the values of game settings before update on server
    if (check_game_settings(match, newGameSettings))
    {
        Object.assign(match.gameSettings, newGameSettings);

        setup_limit_table(match.pongGame, match.gameSettings);
        create_object_pong_game(match);
    }

    send_data('update game settings', match.gameSettings, sender, match.listUser);
}

module.exports = {
    setup_game_settings,
    update_game_settings,
    create_object_pong_game
};
