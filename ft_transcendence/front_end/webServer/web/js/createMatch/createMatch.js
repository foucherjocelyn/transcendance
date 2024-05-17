import { client, dataToServer } from "../client/client.js";
import { screen } from "../screen/screen.js";
import { display_add_player_buttons, inforPlayer, setup_content_add_player_button } from "./createPlayers.js";
import { get_signe_buttons_in_create_match } from "./getSignButtonsInCreateMatch.js";
import { createMatchHTML } from "../home/home_creatematch.js";
import { setup_game_layer } from "../game/startGame.js";

export class pMatch
{
    constructor() {
        this.admin = undefined,
            this.id = undefined,
            this.mode = undefined,
            this.listUser = [],
            this.listPlayer = [],
            this.listInvite = [],
            this.result = [],
            this.timeStart = undefined,
            this.timeStop = undefined,
            this.dateStart = undefined,
            this.dateStop = undefined
    }
};
let match = undefined;

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

export function    display_create_match_layer()
{
    if (document.getElementById('createMatchLayer') === null)
        createMatchHTML();
    client.inforUser.status = 'creating match';

    setup_size_create_match_layer();
    setup_size_add_player_layer();
    display_add_player_buttons();
    setup_size_add_player_button();
    get_signe_buttons_in_create_match();

    const sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
    client.socket.send(JSON.stringify(sendData));
}

export function update_match_informations(data)
{
    match = data.content;

    if (client.inforUser.status === 'playing game')
        return ;

    client.inforUser.status = 'creating match';

    // console.log('-----------------> ' + match.mode);

    if (document.getElementById('invitationPlayLayer') !== null)
        return ;

    // console.table(match.listPlayer);

    document.getElementById('createMatchLayer') === null ?
    display_create_match_layer() : setup_content_add_player_button();

    if (match.mode === 'rank' || match.mode === 'tournament')
    {
        if (match.listUser.length > 1)
        {
            document.getElementById("cancelCreateMatchButton").style.display = 'none';
            document.getElementById("startCreateMatchButton").style.display = 'none';

            setTimeout(function() {
                setup_game_layer();
            }, 3000); // 3 secondes
        }
    }
}

export function    join_the_tournament(alias, tournamentID)
{
    match = new pMatch();
    match.mode = 'tournament';
    match.admin = client.inforUser;

    // tournamentID = ?
    match.tournamentID = tournamentID;

    const player1 = new inforPlayer(client.inforUser.id, alias, client.inforUser.avatarPath, client.inforUser.level, 'player');
    const player2 = new inforPlayer('#42', 'Player 2', "../../img/avatar/avatar2.png", 42, 'player');
    const player3 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
    const player4 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');

    match.listPlayer.push(player1);
    match.listPlayer.push(player2);
    match.listPlayer.push(player3);
    match.listPlayer.push(player4);

    display_create_match_layer();

    document.getElementById('loaderMatchmakingLayer').style.display = 'flex';

    const  sendData = new dataToServer('start game', match, client.inforUser, match.listUser);
    client.socket.send(JSON.stringify(sendData));
}

export function    create_match(mode)
{
    match = new pMatch();
    match.mode = mode;
    match.admin = client.inforUser;

    const player1 = new inforPlayer(client.inforUser.id, client.inforUser.username, client.inforUser.avatarPath, client.inforUser.level, 'player');
    const player2 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
    const player3 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
    const player4 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');

    match.listPlayer.push(player1);
    match.listPlayer.push(player2);
    match.listPlayer.push(player3);
    match.listPlayer.push(player4);

    display_create_match_layer();
}

export {
    match
};
