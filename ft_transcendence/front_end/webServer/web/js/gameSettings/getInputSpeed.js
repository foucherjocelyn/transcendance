import { gameSettings } from "./updateGameSetting.js";

function    get_input_speed_paddle()
{
    const   input = document.querySelector('#gameSettingSpeedPaddle > div > input');
    const   speedPaddle = parseFloat(input.value);

    gameSettings.speed.paddle = speedPaddle;
}

function    get_input_speed_ball()
{
    const   input = document.querySelector('#gameSettingSpeedBall > div > input');
    const   speedBall = parseFloat(input.value);

    gameSettings.speed.ball = speedBall;
}

function    get_input_game_setting_speed()
{
    get_input_speed_paddle();
    get_input_speed_ball();
}

export {
    get_input_game_setting_speed
};
