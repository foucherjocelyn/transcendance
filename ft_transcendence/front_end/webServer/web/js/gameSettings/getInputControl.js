import { gameSettings } from "./updateGameSetting.js";

function    get_input_control_paddle1()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer1 > div > input');
    const   leftButton = inputs[0].value;
    const   rightButton = inputs[1].value;

    gameSettings.control.player1.left = leftButton;
    gameSettings.control.player1.right = rightButton;
}

function    get_input_control_paddle2()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer2 > div > input');
    const   leftButton = inputs[0].value;
    const   rightButton = inputs[1].value;

    gameSettings.control.player2.left = leftButton;
    gameSettings.control.player2.right = rightButton;
}

function    get_input_control_paddle3()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer3 > div > input');
    const   leftButton = inputs[0].value;
    const   rightButton = inputs[1].value;

    gameSettings.control.player3.left = leftButton;
    gameSettings.control.player3.right = rightButton;
}

function    get_input_control_paddle4()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer4 > div > input');
    const   leftButton = inputs[0].value;
    const   rightButton = inputs[1].value;

    gameSettings.control.player4.left = leftButton;
    gameSettings.control.player4.right = rightButton;
}

function    get_input_game_setting_control()
{
    get_input_control_paddle1();
    get_input_control_paddle2();
    get_input_control_paddle3();
    get_input_control_paddle4();
}

export {
    get_input_game_setting_control
};
