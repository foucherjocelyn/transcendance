import { client } from "../client/client.js";
import { match } from "./createMatch.js";

class   inforPlayer {
    constructor(id, name, avatar, level, type) {
        this.status = false,
        this.id = id,
        this.name = name,
        this.avatar = avatar,
        this.level = level
        this.type = type,
        this.score = 0
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

function    setup_content_add_player_button()
{
    get_user_in_list_player_cl();

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

function    display_players()
{
    document.querySelectorAll('#addPlayerLayer > button').forEach(button => {
        button.remove();
    })

    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const player = match.listPlayer[i];
        create_add_player_button();
    }
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

function    create_players()
{
    const   player1 = new inforPlayer(client.inforUser.id, client.inforUser.name, client.inforUser.avatar, client.inforUser.level, 'player');
    const   player2 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.jpg", 42, 'none');
    const   player3 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.jpg", 42, 'none');
    const   player4 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.jpg", 42, 'none');

    match.listPlayer.push(player1);
    match.listPlayer.push(player2);
    match.listPlayer.push(player3);
    match.listPlayer.push(player4);
}

export {
    create_players,
    inforPlayer,
    get_user_in_list_player_cl,
    setup_content_add_player_button,
    define_player,
    display_players
};