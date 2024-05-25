import { add_objects } from "../game/gameWindows.js";

function    update_game_setting_size()
{
    const   gameSettingSizeTable = document.querySelectorAll('#gameSettingSizeTable > div > input');
    gameSettingSizeTable[0].value = gameSettings.size.table.width;
    gameSettingSizeTable[1].value = gameSettings.size.table.height;

    const   gameSettingSizeBorder = document.querySelector('#gameSettingSizeBorder > div > input');
    gameSettingSizeBorder.value = gameSettings.size.border;

    const   gameSettingSizePaddle = document.querySelectorAll('#gameSettingSizePaddle > div > input');
    gameSettingSizePaddle[0].value = gameSettings.size.paddle.width;
    gameSettingSizePaddle[1].value = gameSettings.size.paddle.height;

    const   gameSettingSizeBall = document.querySelector('#gameSettingSizeBall > div > input');
    gameSettingSizeBall.value = gameSettings.size.ball;
}

function    update_game_setting_color()
{
    const   gameSettingColorTable = document.querySelectorAll('#gameSettingColorTable > div > input');
    gameSettingColorTable[0].value = gameSettings.color.plane;
    gameSettingColorTable[1].value = gameSettings.color.border;

    const   gameSettingColorPaddles = document.querySelectorAll('#gameSettingColorPaddles > div > input');
    gameSettingColorPaddles[0].value = gameSettings.color.paddles.player1;
    gameSettingColorPaddles[1].value = gameSettings.color.paddles.player2;
    gameSettingColorPaddles[2].value = gameSettings.color.paddles.player3;
    gameSettingColorPaddles[3].value = gameSettings.color.paddles.player4;

    const   gameSettingColorBall = document.querySelector('#gameSettingColorBall > div > input');
    gameSettingColorBall.value = gameSettings.color.ball;
}

function    update_game_setting_speed()
{
    const   gameSettingSpeedPaddle = document.querySelector('#gameSettingSpeedPaddle > div > input');
    gameSettingSpeedPaddle.value = gameSettings.speed.paddle;

    const   gameSettingSpeedBall = document.querySelector('#gameSettingSpeedBall > div > input');
    gameSettingSpeedBall.value = gameSettings.speed.ball;
}

function    update_game_setting_control()
{
    const   gameSettingControlPlayer1 = document.querySelectorAll('#gameSettingControlPlayer1 > div > input');
    gameSettingControlPlayer1[0].value = gameSettings.control.player1.left;
    gameSettingControlPlayer1[1].value = gameSettings.control.player1.right;

    const   gameSettingControlPlayer2 = document.querySelectorAll('#gameSettingControlPlayer2 > div > input');
    gameSettingControlPlayer2[0].value = gameSettings.control.player2.left;
    gameSettingControlPlayer2[1].value = gameSettings.control.player2.right;

    const   gameSettingControlPlayer3 = document.querySelectorAll('#gameSettingControlPlayer3 > div > input');
    gameSettingControlPlayer3[0].value = gameSettings.control.player3.left;
    gameSettingControlPlayer3[1].value = gameSettings.control.player3.right;

    const   gameSettingControlPlayer4 = document.querySelectorAll('#gameSettingControlPlayer4 > div > input');
    gameSettingControlPlayer4[0].value = gameSettings.control.player4.left;
    gameSettingControlPlayer4[1].value = gameSettings.control.player4.right;
}

export let gameSettings;
export function    update_game_settings(data)
{
    gameSettings = data.content;

    update_game_setting_size();
    update_game_setting_color();
    update_game_setting_speed();
    update_game_setting_control();
    
    if (data.from === 'server')
        return ;
    
    add_objects();
    // setup_start_game();
}
