import { client, dataToServer } from "../client/client.js";
import { screen } from "../screen/screen.js";
import { display_add_player_buttons, setup_content_add_player_button } from "./createPlayers.js";
import { get_signe_buttons_in_create_match } from "./getSignButtonsInCreateMatch.js";
import { createMatchHTML } from "../home/game/home_creatematch.js";

export let match = undefined;

function setup_size_add_player_layer()
{
    const addPlayerLayer = document.getElementById('addPlayerLayer');
    addPlayerLayer.style.height = `${screen.height}px`;
    addPlayerLayer.style.width = `${screen.width}px`;
}

function setup_size_add_player_button()
{
    const buttons = document.querySelectorAll('#addPlayerLayer > button');

    buttons.forEach(button => {
        button.style.height = `${screen.height}px`;
        button.style.width = `${screen.width / 4}px`;
    })
}

function setup_size_create_match_layer()
{
    const createMatchLayer = document.getElementById('createMatchLayer');
    createMatchLayer.style.height = `${screen.height}px`;
    createMatchLayer.style.width = `${screen.width}px`;
}

export function    display_loader(status)
{
    const   loaderLayer = document.getElementById('loaderMatchmakingLayer');
    if (loaderLayer !== null) {
        loaderLayer.style.display = status;
    }
}

export function    display_create_match_layer()
{
    if (document.getElementById('createMatchLayer') === null) {
        createMatchHTML();
    }

    setup_size_create_match_layer();
    setup_size_add_player_layer();
    display_add_player_buttons();
    setup_size_add_player_button();
    get_signe_buttons_in_create_match();
}

export function update_match_informations(data)
{
    match = data.content;

    if (document.getElementById('invitationPlayLayer') !== null) {
        return ;
    }

    (document.getElementById('createMatchLayer') === null) ?
    display_create_match_layer() : setup_content_add_player_button();

    if ((match.mode === 'ranked' || match.mode === 'tournament') && (match.listUser.length > 1))
    {
        document.getElementById("cancelCreateMatchButton").style.display = 'none';
        document.getElementById("startCreateMatchButton").style.display = 'none';
    }
}

export function    create_match(mode)
{
    const sendData = new dataToServer('create match', mode, 'socket server');
    client.socket.send(JSON.stringify(sendData));
}
