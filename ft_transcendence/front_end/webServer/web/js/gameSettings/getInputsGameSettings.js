import { client, dataToServer } from "../client/client.js";
import { match } from "../createMatch/createMatch.js";
import { get_input_game_setting_color } from "./gameSettingColor.js";
import { get_input_game_setting_control } from "./gameSettingControl.js";
import { get_input_game_setting_size } from "./gameSettingSize.js";
import { get_input_game_setting_speed } from "./gameSettingSpeed.js";
import { game_settings_default } from "./gameSettingsDefault.js";

class   formSetting {
    constructor() {
        this.size = {
            table: {
                width: undefined,
                height: undefined
            },
            border: undefined,
            paddle: {
                width: undefined,
                height: undefined
            },
            ball: undefined
        },
        this.color = {
            plane: undefined,
            border: undefined,
            paddles: {
                player1: undefined,
                player2: undefined,
                player3: undefined,
                player4: undefined
            },
            ball: undefined
        },
        this.speed = {
            paddle: undefined,
            ball: undefined
        },
        this.control = {
            player1: {
                left: undefined,
                right: undefined
            },
            player2: {
                left: undefined,
                right: undefined
            },
            player3: {
                left: undefined,
                right: undefined
            },
            player4: {
                left: undefined,
                right: undefined
            }
        }
    }
}
let gameSettings;

function    get_inputs_game_settings()
{
    get_input_game_setting_size();
    get_input_game_setting_color();
    get_input_game_setting_speed();
    get_input_game_setting_control();
}

function    get_sign_save_game_setting_button()
{
    gameSettings = new formSetting();
    game_settings_default();

    const   button = document.querySelector('#gameSaveButton > button');
    button.onclick = () => {
        get_inputs_game_settings();

        const  sendData = new dataToServer('update game settings', gameSettings, client.inforUser, match.listUser);
        client.socket.send(JSON.stringify(sendData));

        document.getElementById('gameSettingPanel').style.display = 'none';
    }
}

export {
    get_sign_save_game_setting_button,
    gameSettings
};
