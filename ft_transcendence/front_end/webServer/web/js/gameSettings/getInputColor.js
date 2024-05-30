import { gameSettings } from "./updateGameSetting.js";

function    get_input_color_table()
{
    const   inputs = document.querySelectorAll('#gameSettingColorTable > div > input');
    const   colorPlane = inputs[0].value;
    const   colorBorder = inputs[1].value;

    gameSettings.color.plane = colorPlane;
    gameSettings.color.border = colorBorder;
}

function    get_input_color_paddles()
{
    const   inputs = document.querySelectorAll('#gameSettingColorPaddles > div > input');
    
    const   colorPlayer1 = inputs[0].value;
    const   colorPlayer2 = inputs[1].value;
    const   colorPlayer3 = inputs[2].value;
    const   colorPlayer4 = inputs[3].value;

    gameSettings.color.paddles.player1 = colorPlayer1;
    gameSettings.color.paddles.player2 = colorPlayer2;
    gameSettings.color.paddles.player3 = colorPlayer3;
    gameSettings.color.paddles.player4 = colorPlayer4;
}

function    get_input_color_ball()
{
    const   input = document.querySelector('#gameSettingColorBall > div > input')
    const   colorBall = input.value;

    gameSettings.color.ball = colorBall;
}

function    get_input_game_setting_color()
{
    get_input_color_table();
    get_input_color_paddles();
    get_input_color_ball();
}

export {
    get_input_game_setting_color
};
