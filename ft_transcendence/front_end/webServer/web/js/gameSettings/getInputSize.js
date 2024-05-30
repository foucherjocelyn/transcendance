import { gameSettings } from "./updateGameSetting.js";

function    get_input_size_table()
{
    const   inputs = document.querySelectorAll('#gameSettingSizeTable > div > input');
    const   widthTable = parseInt(inputs[0].value);
    const   heightTable = parseInt(inputs[1].value);

    gameSettings.size.table.width = widthTable;
    gameSettings.size.table.height = heightTable;
}

function    get_input_size_border()
{
    const   input = document.querySelector('#gameSettingSizeBorder > div > input');
    const   sizeBorder = parseFloat(input.value);

    gameSettings.size.border = sizeBorder;
}

function    get_input_size_paddle()
{
    const   inputs = document.querySelectorAll('#gameSettingSizePaddle > div > input');
    const   widthPaddle = parseInt(inputs[0].value);
    const   heightPaddle = parseInt(inputs[1].value);

    gameSettings.size.paddle.width = widthPaddle;
    gameSettings.size.paddle.height = heightPaddle;
}

function    get_input_size_ball()
{
    const   input = document.querySelector('#gameSettingSizeBall > div > input');
    const   sizeBall = parseFloat(input.value);

    gameSettings.size.ball = sizeBall;
}

function    get_input_game_setting_size()
{
    get_input_size_table();
    get_input_size_border();
    get_input_size_paddle();
    get_input_size_ball();
}

export {
    get_input_game_setting_size
};
