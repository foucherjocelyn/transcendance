import { client } from "../client/client.js";
import { match } from "./createMatch.js";

function create_add_player_button() {
    const button = document.createElement('button');

    const div = document.createElement('div');

    const spanID = document.createElement('span');
    spanID.className = 'idPlayer';

    const spanName = document.createElement('span');
    spanName.className = 'namePlayer';

    div.appendChild(spanID);
    div.appendChild(spanName);

    button.appendChild(div);

    document.getElementById('addPlayerLayer').appendChild(button);
}

export function setup_content_add_player_button() {
    if (document.getElementById('startCreateMatchButton')) {
        document.getElementById('startCreateMatchButton').style.display =
            ((match.admin.id === client.inforUser.id) && (match.mode !== 'tournament')) ? 'flex' : 'none';
    }

    const buttons = document.querySelectorAll('#addPlayerLayer > button');
    const spanID = document.querySelectorAll('.idPlayer');
    const spanName = document.querySelectorAll('.namePlayer');

    let nbrButton = (match.mode === 'tournament') ? 2 : 4;
    for (let i = 0; i < nbrButton; i++) {
        const player = match.listPlayer[i];
        buttons[i].style.backgroundImage = `url("${player.avatar}")`;
        spanID[i].textContent = player.id;
        spanName[i].textContent = player.name;
    }
}

export function display_add_player_buttons() {
    document.querySelectorAll('#addPlayerLayer > button').forEach(button => {
        button.remove();
    })

    let nbrButton = (match.mode === 'tournament') ? 2 : 4;
    for (let i = 0; i < nbrButton; i++) {
        create_add_player_button();
    }

    setup_content_add_player_button();
}
