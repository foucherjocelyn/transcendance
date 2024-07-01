import { client, dataToServer } from "../client/client.js";
import { reset_contents_in_invitation_play_layer } from "./getSignButtonsInInvitationPlay.js";

export function send_invitation_to_play(recipient)
{
    const sendData = new dataToServer('invite to play', '', recipient);
    client.socket.send(JSON.stringify(sendData));
}

function    get_sign_invite_to_play_button(user)
{
    const   results = document.querySelectorAll('.resultsSearchInvitationPlay');
    const   buttons = document.querySelectorAll('.invitePlayButton');

    for (let i = 0; i < buttons.length; i++)
    {
        const   button = buttons[i];
        button.onclick = () =>
        {
            send_invitation_to_play(user[i]);
            results[i].outerHTML = null;
        }
    }
}

function    display_results_search_friends_to_play_on_html(user)
{
    const   resultsSearchInvitationPlay = document.createElement('div');
    resultsSearchInvitationPlay.className = 'resultsSearchInvitationPlay';

    const   div = document.createElement('div');

    const   avatarInvitationPlay = document.createElement('div');
    avatarInvitationPlay.className = 'avatarInvitationPlay';
    avatarInvitationPlay.style.backgroundImage = `url("img/${user.avatarPath}")`;

    const   idInvitationPlay = document.createElement('span');
    idInvitationPlay.className = 'idInvitationPlay';
    idInvitationPlay.textContent = `ID: ${user.id} - ${user.username}`;

    div.appendChild(avatarInvitationPlay);
    div.appendChild(idInvitationPlay);

    const   invitePlayButton = document.createElement('invitePlayButton');
    invitePlayButton.className = 'invitePlayButton';
    invitePlayButton.textContent = 'Invite';

    resultsSearchInvitationPlay.appendChild(div);
    resultsSearchInvitationPlay.appendChild(invitePlayButton);

    document.getElementById('resultsSearchInvitationPlayPanel').appendChild(resultsSearchInvitationPlay);
}

export async function    display_results_search_friends_to_play(results)
{
    if (results.length === 0) {
        return ;
    }

    // delete old results
    if (document.querySelectorAll('#resultsSearchInvitationPlayPanel > div').length !== 0) {
        await reset_contents_in_invitation_play_layer();
    }

    results.forEach((result, index) => {
        if (index < 10) {
            display_results_search_friends_to_play_on_html(result);
        }
    })

    get_sign_invite_to_play_button(results);
}
