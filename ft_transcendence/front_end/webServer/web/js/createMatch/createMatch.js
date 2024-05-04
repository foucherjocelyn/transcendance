import { client, dataToServer } from "../client/client.js";
import { screen } from "../screen/screen.js";
import { create_players, define_player, display_players, setup_content_add_player_button } from "./createPlayers.js";
import { get_signe_buttons_in_create_match } from "./getSignButtonsInCreateMatch.js";

class   pMatch {
    constructor() {
        this.admin = undefined,
        this.id = undefined,
        this.mode = undefined,
        this.listUser = [],
        this.listPlayer = [],
        this.result = [],
        this.timeStart = undefined,
        this.timeStop = undefined,
        this.dateStart = undefined,
        this.dateStop = undefined
    }
};
let match = undefined;

function    setup_size_add_player_layer()
{
    const   addPlayerLayer = document.getElementById('addPlayerLayer');
    addPlayerLayer.style.height = `${screen.height}px`;
    addPlayerLayer.style.width = `${screen.width}px`;
}

function    setup_size_add_player_button()
{
    const   buttons = document.querySelectorAll('#addPlayerLayer > button');

    buttons.forEach(button => {
        button.style.height = `${screen.height}px`;
        button.style.width = `${screen.width / 4}px`;
    })
}

function    setup_size_create_match_layer()
{
    const   createMatchLayer = document.getElementById('createMatchLayer');
    createMatchLayer.style.height = `${screen.height}px`;
    createMatchLayer.style.width = `${screen.width}px`;
}

function    update_match_informations(data)
{
    Object.assign(match, data.content);
    client.inforUser.status = 'creating match';

    if (match.admin.id !== client.inforUser.id)
        document.getElementById('startCreateMatchButton').style.display = 'none';

    // if (match.mode !== 'default')
    setup_content_add_player_button();
}

function    match_default()
{
    match = new pMatch();
    match.mode = 'default';
    match.admin = client.inforUser;
    match.listUser.push(client.inforUser);

    create_players();

    const  sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
    client.socket.send(JSON.stringify(sendData));
}

function    create_match(mode)
{
    document.getElementById('createMatchLayer').style.display = 'flex';
    client.inforUser.status = 'creating match';

    // add mode game
    match.mode = mode;

    setup_size_create_match_layer();
    setup_size_add_player_layer();
    display_players();
    setup_size_add_player_button();
    get_signe_buttons_in_create_match();

    const  sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
    client.socket.send(JSON.stringify(sendData));
}

export {
    match,
    create_match,
    update_match_informations,
    match_default
};
