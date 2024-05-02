import { client, dataToServer } from "../client/client.js";

function    get_sign_invite_to_play_button(user)
{
    const   results = document.querySelectorAll('.resultsSearchInvitationPlay');
    const   buttons = document.querySelectorAll('.invitePlayButton');

    for (let i = 0; i < buttons.length; i++)
    {
        const   button = buttons[i];

        button.onclick = () => {
            const  sendData = new dataToServer('invite to play', "Hey guy, do you want to play 'Pong Game' with me?", client.inforUser, user[i]);
            client.socket.send(JSON.stringify(sendData));

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
    avatarInvitationPlay.style.backgroundImage = `url("${user.avatar}")`;

    const   idInvitationPlay = document.createElement('span');
    idInvitationPlay.className = 'idInvitationPlay';
    idInvitationPlay.textContent = user.id;

    div.appendChild(avatarInvitationPlay);
    div.appendChild(idInvitationPlay);

    const   invitePlayButton = document.createElement('invitePlayButton');
    invitePlayButton.className = 'invitePlayButton';
    invitePlayButton.textContent = 'Invite';

    resultsSearchInvitationPlay.appendChild(div);
    resultsSearchInvitationPlay.appendChild(invitePlayButton);

    document.getElementById('resultsSearchInvitationPlayPanel').appendChild(resultsSearchInvitationPlay);
}

function    display_results_search_friends_to_play(results)
{
    if (results.length === 0)
        return ;

    for (let i = 0; i < results.length; i++)
    {
        if (i < 10)
        {
            const   user = results[i];
            display_results_search_friends_to_play_on_html(user);
        }
    }

    get_sign_invite_to_play_button(results);
}

export {
    display_results_search_friends_to_play
};
