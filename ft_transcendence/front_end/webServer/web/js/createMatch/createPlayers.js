import { client, dataToServer } from "../client/client.js";
import { match } from "./createMatch.js";

class   inforPlayer {
    constructor(id, name, avatar, level, type) {
        this.status = false,
        this.id = id,
        this.name = name,
        this.avatar = avatar,
        this.level = level
        this.type = type,
        this.score = 0,
        this.paddle = undefined
    }
};

function    create_add_player_button()
{
    const   button = document.createElement('button');

    const   div = document.createElement('div');

    const   spanID = document.createElement('span');
    spanID.className = 'idPlayer';

    const   spanName = document.createElement('span');
    spanName.className = 'namePlayer';

    div.appendChild(spanID);
    div.appendChild(spanName);

    button.appendChild(div);

    document.getElementById('addPlayerLayer').appendChild(button);
}

function    get_user_in_list_player_cl()
{
    match.listUser = [];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.id[0] === '#')
        {
            match.listUser.push(match.listPlayer[i]);
        }
    }
}

function    change_match_admin()
{
    const   tmp = match.listPlayer[0];
    match.listPlayer[0] = match.listUser[0];
    match.admin = match.listUser[0];

    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (i > 0 && player.id === match.listUser[0].id)
        {
            match.listPlayer[i] = tmp;

            const  sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
			client.socket.send(JSON.stringify(sendData));
            return ;
        }
    }
}

function    setup_content_add_player_button()
{
    if (match.listPlayer[0].type === 'none')
        change_match_admin();

    document.getElementById('startCreateMatchButton').style.display =
    ((match.admin.id === client.inforUser.id) && (match.mode !== 'tournament')) ? 'flex' : 'none';

    const   buttons = document.querySelectorAll('#addPlayerLayer > button');
    const   spanID = document.querySelectorAll('.idPlayer');
    const   spanName = document.querySelectorAll('.namePlayer');

    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        buttons[i].style.backgroundImage = `url("${player.avatar}")`;
        spanID[i].textContent = player.id;
        spanName[i].textContent = player.name;
    }
}

function    display_add_player_buttons()
{
    document.querySelectorAll('#addPlayerLayer > button').forEach(button => {
        button.remove();
    })

    match.listPlayer.forEach(button => {
        create_add_player_button();
    })

    setup_content_add_player_button();
}

function    define_player(id)
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (i === id)
            return player;
    }
    return undefined;
}

export {
    inforPlayer,
    get_user_in_list_player_cl,
    setup_content_add_player_button,
    define_player,
    display_add_player_buttons
};