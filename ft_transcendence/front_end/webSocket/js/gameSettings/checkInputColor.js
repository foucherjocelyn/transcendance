function isValidHexColor(str) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(str);
}

function    check_game_settings_color_table(gameSettings)
{
    let plane = gameSettings.color.plane;
    if (!isValidHexColor(plane)) {
        return false;
    }
    return true;
}

function    check_game_settings_color_border(gameSettings)
{
    let border = gameSettings.color.border;
    if (!isValidHexColor(border)) {
        return false;
    }
    return true;
}

function    check_game_settings_color_paddle(gameSettings)
{
    let paddle = gameSettings.color.paddles;
    for (let i = 0; i < paddle.length; i++)
    {
        if (!isValidHexColor(paddle[i])) {
            return false;
        }
    }
    return true;
}

function    check_game_settings_color_ball(gameSettings)
{
    let ball = gameSettings.color.ball;
    if (!isValidHexColor(ball)) {
        return false;
    }
    return true;
}

function    check_game_settings_color(gameSettings)
{
    if (!check_game_settings_color_table(gameSettings)) {
        return false;
    }
    if (!check_game_settings_color_border(gameSettings)) {
        return false;
    }
    if (!check_game_settings_color_paddle(gameSettings)) {
        return false;
    }
    if (!check_game_settings_color_ball(gameSettings)) {
        return false;
    }
    return true;
}

module.exports = {
    check_game_settings_color
};
