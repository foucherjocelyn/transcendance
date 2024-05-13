import { match } from "../createMatch/createMatch.js";
import { screen } from "../screen/screen.js";
import { get_sign_save_game_setting_button } from "./getInputsGameSettings.js";

function    setup_size_game_settings_layer()
{
    const   gameSettingsLayer = document.getElementById('gameSettingsLayer');
    gameSettingsLayer.style.height = `${screen.height}px`;
    gameSettingsLayer.style.width = `${screen.width / 4}px`;
}

function    display_game_setting_panel(index)
{
    const   settingPanel = document.querySelectorAll('#gameSettingContents > div');
    settingPanel.forEach((panel, id) => {
        panel.style.display = (id === index) ? 'flex' : 'none';
    })
}

function    get_sign_buttons_game_setting_bar()
{
    const   buttons = document.querySelectorAll('#gameSettingBar > button');

    buttons.forEach((button, index) => {
        button.onclick = () => {
            display_game_setting_panel(index);
        }
    })
    display_game_setting_panel(0);
}

function    get_sign_game_setting_button()
{
    const   button = document.getElementById('gameSettingButton');
    let countClick = 0;

    button.onclick = () => {
        countClick++;
        document.getElementById('gameSettingPanel').style.display = (countClick % 2 !== 0) ? 'flex' : 'none';
        countClick = (countClick === 2) ? 0 : countClick;
    }
}

function    setup_game_settings()
{
    setup_size_game_settings_layer();
    get_sign_game_setting_button();
    get_sign_buttons_game_setting_bar();
    get_sign_save_game_setting_button();

    if (match.mode !== 'offline') {
        document.querySelector('#gameSettingBar > :last-child').style.display = 'none';
    }
}

export {
    setup_game_settings
};
