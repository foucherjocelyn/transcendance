import { gameSettings } from "./updateGameSetting.js";

const   listButtons = [];

function    check_duplicate_button(button, index)
{
    if (listButtons.length < 8)
    {
        listButtons.push(button);
        return button;
    }
    else
    {
        if (button === '')
            return listButtons[index];

        let check = false;
        for (let i = 0; i < listButtons.length; i++)
        {
            if (listButtons[i] === button)
                check = true;
        }
        if (check === false)
            listButtons[index] = button;
        return listButtons[index];
    }
}

function    get_input_control_paddle1()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer1 > div > input');

    const   leftButton = check_duplicate_button(inputs[0].value, 0);
    const   rightButton = check_duplicate_button(inputs[1].value, 1);

    gameSettings.control.player1.left = leftButton;
    gameSettings.control.player1.right = rightButton;
}

function    get_input_control_paddle2()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer2 > div > input');
    
    const   leftButton = check_duplicate_button(inputs[0].value, 2);
    const   rightButton = check_duplicate_button(inputs[1].value, 3);

    gameSettings.control.player2.left = leftButton;
    gameSettings.control.player2.right = rightButton;
}

function    get_input_control_paddle3()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer3 > div > input');

    const   leftButton = check_duplicate_button(inputs[0].value, 4);
    const   rightButton = check_duplicate_button(inputs[1].value, 5);

    gameSettings.control.player3.left = leftButton;
    gameSettings.control.player3.right = rightButton;
}

function    get_input_control_paddle4()
{
    const   inputs = document.querySelectorAll('#gameSettingControlPlayer4 > div > input');
    
    const   leftButton = check_duplicate_button(inputs[0].value, 6);
    const   rightButton = check_duplicate_button(inputs[1].value, 7);

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
