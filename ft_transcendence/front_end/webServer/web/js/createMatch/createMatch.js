import { client, dataToServer } from "../client/client.js";
import { screen } from "../screen/screen.js";
import { display_add_player_buttons, inforPlayer, setup_content_add_player_button } from "./createPlayers.js";
import { get_signe_buttons_in_create_match } from "./getSignButtonsInCreateMatch.js";
import { drawCreateMatch, to_game } from "../home/home_game.js";

class pMatch {
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

function setup_size_add_player_layer() {
    const addPlayerLayer = document.getElementById('addPlayerLayer');
    addPlayerLayer.style.height = `${screen.height}px`;
    addPlayerLayer.style.width = `${screen.width}px`;
}

function setup_size_add_player_button() {
    const buttons = document.querySelectorAll('#addPlayerLayer > button');

    buttons.forEach(button => {
        button.style.height = `${screen.height}px`;
        button.style.width = `${screen.width / 4}px`;
    })
}

function setup_size_create_match_layer() {
    const createMatchLayer = document.getElementById('createMatchLayer');
    createMatchLayer.style.height = `${screen.height}px`;
    createMatchLayer.style.width = `${screen.width}px`;
}

function match_default() {
    match = new pMatch();
    match.mode = 'default';
    match.admin = client.inforUser;

    const player1 = new inforPlayer(client.inforUser.id, client.inforUser.name, client.inforUser.avatar, client.inforUser.level, 'player');
    const player2 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.jpg", 42, 'none');
    const player3 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.jpg", 42, 'none');
    const player4 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.jpg", 42, 'none');

    match.listPlayer.push(player1);
    match.listPlayer.push(player2);
    match.listPlayer.push(player3);
    match.listPlayer.push(player4);
}

function update_match_informations(data) {
    match = data.content;
    client.inforUser.status = 'creating match';

    console.log('-----------------> ' + match.mode);
    //console.table(match.listPlayer);

    const createMatchLayer = document.getElementById('createMatchLayer');
    if (createMatchLayer === null)
        create_match(match.mode);
    else if (createMatchLayer.style.display === 'flex') {
        setup_content_add_player_button();
    }
}

async function create_match(mode) {
    to_game();
    /*
    if (document.getElementById("g_match_html") === undefined || document.getElementById("g_match_html") === null)
    {
        console.trace();
        console.log("Error: g_match_html not found");
        return;
    }
    */
    //    await drawGame((result) => {
    //      if (result) {
    if (match === undefined)
        match_default();
    drawCreateMatch();
    document.getElementById("loadspinner").classList.add("hide");
    document.getElementById('createMatchLayer').style.display = 'flex';
    client.inforUser.status = 'creating match';

    // add mode game
    match.mode = mode;

    setup_size_create_match_layer();
    setup_size_add_player_layer();
    display_add_player_buttons();
    setup_size_add_player_button();
    get_signe_buttons_in_create_match();

    const sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
    client.socket.send(JSON.stringify(sendData));
    //        }
    //    });
}

export {
    match,
    create_match,
    update_match_informations,
    match_default
};
