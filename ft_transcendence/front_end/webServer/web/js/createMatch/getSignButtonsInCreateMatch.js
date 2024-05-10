import { invitation_to_play } from "../invitationPlay/invitationPlay.js";
import { match } from "./createMatch.js";
import { inforPlayer } from "./createPlayers.js";
import { client, dataToServer } from "../client/client.js";
import { to_game } from "../home/home_game.js";
import { invitationPlayLayerHTML } from "../home/home_creatematch.js";

function    add_player_mode_offline_random(button, clickCount, index)
{
    if (match.mode === 'with friends')
        return 0;

    let player = undefined;
    if (clickCount === 1)
        player = new inforPlayer(42, 'AI ' + (index + 1), "../../img/avatar/AI.png", 42, 'AI');
    else if (clickCount === 2)
        player = new inforPlayer(42, 'Player ' + (index + 1), "../../img/avatar/avatar2.png", 42, 'player');
    else
        player = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');

    match.listPlayer[index] = player;

    button.style.backgroundImage = `url("${player.avatar}")`;
    button.querySelector('span.idPlayer').textContent = player.id;
    button.querySelector('span.namePlayer').textContent = player.name;
    return clickCount;
}

function    add_player_mode_friends(button, clickCount, index)
{
    if (match.mode !== 'with friends')
        return 0;

    if (match.listPlayer[index].type === 'player')
    {
        if (match.admin.id !== client.inforUser.id)
            return 0;
        else
        {
            const  sendData = new dataToServer('kick out of the match', match, client.inforUser, match.listPlayer[index]);
            client.socket.send(JSON.stringify(sendData));
        }
    }
    
    let player = undefined;
    if (clickCount === 1)
    {
        player = new inforPlayer(42, 'AI ' + (index + 1), "../../img/avatar/AI.png", 42, 'AI');
    }
    else
    {
        invitationPlayLayerHTML();
        invitation_to_play();
        player = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
    }
    match.listPlayer[index] = player;

    button.style.backgroundImage = `url("${player.avatar}")`;
    button.querySelector('span.idPlayer').textContent = player.id;
    button.querySelector('span.namePlayer').textContent = player.name;

    return clickCount;
}

function    get_sign_add_player_button()
{
    const   buttons = document.querySelectorAll('#addPlayerLayer > button')

    for (let i = 1; i < buttons.length; i++)
    {
        let clickCount = 0;
        const   button = buttons[i];

        button.onclick = () => {
            clickCount++;
            // console.log('click on button ' + i + ' - ' + clickCount);
            if (add_player_mode_offline_random(button, clickCount, i) === 3)
                clickCount = 0;
            if (add_player_mode_friends(button, clickCount, i) === 2)
                clickCount = 0;

            const  sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
            client.socket.send(JSON.stringify(sendData));
        }
    }
}

function    get_sign_cancel_create_match_button()
{
    const   button = document.getElementById('cancelCreateMatchButton');

    button.onclick = () => {
        const  sendData = new dataToServer('leave match', match, client.inforUser, match.listUser);
        client.socket.send(JSON.stringify(sendData));

        to_game();
    }
}

function    get_sign_start_create_match_button()
{
    const   button = document.getElementById('startCreateMatchButton');
    button.onclick = () => {
        // console.log('ready to play');
        document.getElementById('noticeInvitationPlayLayer').style.display = 'none';

        const  sendData = new dataToServer('start game', match, client.inforUser, match.listUser);
        client.socket.send(JSON.stringify(sendData));
    }
}

function    get_signe_buttons_in_create_match()
{
    get_sign_cancel_create_match_button();
    get_sign_start_create_match_button();
    get_sign_add_player_button();
}

export {
    get_signe_buttons_in_create_match
};
