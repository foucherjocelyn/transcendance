function isNumeric(str) {
    const numericRegex = /^-?\d+(\.\d+)?$/;
    return numericRegex.test(str);
}

function    check_game_settings_size_table(gameSettings)
{
    let table = gameSettings.size.table;
    
    if (!isNumeric(table.width) || !isNumeric(table.height)) {
        return false;
    }

    table.width = Math.min(Math.max(table.width, 30), 50);
    table.height = Math.min(Math.max(table.height, 30), 50);

    if (table.width % 2 === 0) {
        table.width++;
    }
    return true;
}

function    check_game_settings_size_border(gameSettings)
{
    let border = gameSettings.size.border;

    if (!isNumeric(border)) {
        return false;
    }

    gameSettings.size.border = Math.min(Math.max(border, 1), 3);
    return true;
}

function    check_game_settings_size_paddle(gameSettings)
{
    let paddle = gameSettings.size.paddle;
    let table = gameSettings.size.table;

    if (!isNumeric(paddle.width) || !isNumeric(paddle.height)) {
        return false;
    }

    let smallestBorder = (table.width < table.height) ? table.width : table.height;
    paddle.width = Math.min(Math.max(paddle.width, 5), (smallestBorder / 5));
    paddle.height = Math.min(Math.max(paddle.height, 1), paddle.width);
    
    return true;
}

function    check_game_settings_size_ball(gameSettings)
{
    let ball = gameSettings.size.ball;
    let paddle = gameSettings.size.paddle;

    if (!isNumeric(ball)) {
        return false;
    }

    gameSettings.size.ball = Math.min(Math.max(ball, 1), (paddle.width / 5));
    return true;
}

function    check_game_settings_size(gameSettings)
{
    if (!check_game_settings_size_table(gameSettings)) {
        return false;
    }
    if (!check_game_settings_size_border(gameSettings)) {
        return false;
    }
    if (!check_game_settings_size_paddle(gameSettings)) {
        return false;
    }
    if (!check_game_settings_size_ball(gameSettings)) {
        return false;
    }
    return true;
}

module.exports = {
    check_game_settings_size,
    isNumeric
};
