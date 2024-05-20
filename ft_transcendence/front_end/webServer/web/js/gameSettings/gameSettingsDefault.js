import { gameSettings } from "./getInputsGameSettings.js";

function    game_settings_size_default()
{
    gameSettings.size.table.width = 30;
    gameSettings.size.table.height = 30;

    gameSettings.size.border = 1;

    gameSettings.size.paddle.width = 5;
    gameSettings.size.paddle.height = 1;

    gameSettings.size.ball = 1;
}

function    game_settings_color_default()
{
    gameSettings.color.plane = '#241f31';
    gameSettings.color.border = '#ffffff';

    gameSettings.color.paddles.player1 = '#3584e4';
    gameSettings.color.paddles.player2 = '#9141ac';
    gameSettings.color.paddles.player3 = '#f6d32d';
    gameSettings.color.paddles.player4 = '#33d17a';

    gameSettings.color.ball = '#ff0000';
}

function    game_settings_speed_default()
{
    gameSettings.speed.paddle = 0.004;
    gameSettings.speed.ball = 0.004;
}

function    game_settings_control_default()
{
    gameSettings.control.player1.left = 'q';
    gameSettings.control.player1.right = 'a';

    gameSettings.control.player2.left = 'p';
    gameSettings.control.player2.right = 'm';

    gameSettings.control.player3.left = 'z';
    gameSettings.control.player3.right = 'e';

    gameSettings.control.player4.left = 'i';
    gameSettings.control.player4.right = 'o';
}

export function    game_settings_default()
{
    game_settings_size_default();
    game_settings_color_default();
    game_settings_speed_default();
    game_settings_control_default();
}
