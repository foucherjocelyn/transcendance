const { calculate_ball_speed } = require("../game/countdown");
const { isNumeric } = require("./checkInputSize");

function    check_game_settings_speed_ball(gameSettings)
{
    let ball = gameSettings.speed.ball;

    if (!isNumeric(ball)) {
        return false;
    }

    gameSettings.speed.ball = Math.min(Math.max(ball, 0.001), 0.008);
    return true;
}

function    check_game_settings_speed_paddle(gameSettings)
{
    let paddle = gameSettings.speed.paddle;

    if (!isNumeric(paddle)) {
        return false;
    }

    const { minSpeed, maxSpeed } = calculate_ball_speed(gameSettings);
    gameSettings.speed.paddle = Math.min(Math.max(paddle, maxSpeed), 1.608);
    return true;
}

function    check_game_settings_speed(gameSettings)
{
    if (!check_game_settings_speed_ball(gameSettings)) {
        return false;
    }
    if (!check_game_settings_speed_paddle(gameSettings)) {
        return false;
    }
    return true;
}

module.exports = {
    check_game_settings_speed,
};
