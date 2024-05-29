import { client, dataToServer } from "../client/client.js";
import { gameSettings } from "./updateGameSetting.js";

import { get_input_game_setting_size } from "./getInputSize.js";
import { get_input_game_setting_color } from "./getInputColor.js";
import { get_input_game_setting_speed } from "./getInputSpeed.js";
import { get_input_game_setting_control } from "./getInputControl.js";

function    get_inputs_game_settings()
{
    get_input_game_setting_size();
    get_input_game_setting_color();
    get_input_game_setting_speed();
    get_input_game_setting_control();
}

export function    get_sign_save_game_setting_button()
{
    const   button = document.querySelector('#gameSaveButton > button');
    button.onclick = () => {
        get_inputs_game_settings();

        const  sendData = new dataToServer('update game settings', gameSettings, 'socket server');
        client.socket.send(JSON.stringify(sendData));
    }
}
