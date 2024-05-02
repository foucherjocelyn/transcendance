import { screen } from "../screen/screen.js";
import { client, dataToServer } from "../client/client.js";

function    get_sign_accept_invitation_play(user, title)
{
    const   button = document.getElementById('acceptInvitationPlayButton');
    button.onclick = () => {
        // console.log('click accept invitation to play');
        
        if (title === 'invite to play')
        {
            const  sendData = new dataToServer('accept invitation to play', client.inforUser, client.inforUser, user);
            client.socket.send(JSON.stringify(sendData));
        }

        document.getElementById('noticeInvitationPlayLayer').style.display = 'none';
    }
}

function    get_sign_reject_invitation_play(user)
{
    const   button = document.getElementById('rejectInvitationPlayButton');
    button.onclick = () => {
        // console.log('click reject invitation to play');

        const  sendData = new dataToServer('reject invitation to play', "Sorry another time, I'm busy!", client.inforUser, user);
        client.socket.send(JSON.stringify(sendData));

        document.getElementById('noticeInvitationPlayLayer').style.display = 'none';
    }
}

function    set_content_notive_invitation_play(avatarUser, user, message)
{
    const   avatar = document.getElementById('avatarPlayerInvite');
    avatar.style.backgroundImage = `url("${avatarUser}")`;

    const   contentForm = document.querySelector('#contentInvitationPlay > h3');
    contentForm.textContent = 'From: ' + user;

    const   content = document.querySelector('#contentInvitationPlay > span');
    content.textContent = 'Content: ' + message;
}

function    setup_size_notice_invitation_play_layer()
{
    const   noticeInvitationPlayLayer = document.getElementById('noticeInvitationPlayLayer');
    noticeInvitationPlayLayer.style.height = `${screen.height / 3}px`;
    noticeInvitationPlayLayer.style.width = `${screen.width / 4}px`;
}

function    notice_invitation_play(data)
{
    document.getElementById('noticeInvitationPlayLayer').style.display = 'flex';
    if (data.title !== 'invite to play')
        document.getElementById('rejectInvitationPlayButton').style.display = 'none';

    setup_size_notice_invitation_play_layer();
    if (data.title !== 'warning')
        set_content_notive_invitation_play(data.from.avatar, data.from.id, data.content);
    else
        set_content_notive_invitation_play(data.from, 'Pong Game', data.content);
    get_sign_reject_invitation_play(data.from);
    get_sign_accept_invitation_play(data.from, data.title);
}

export {
    notice_invitation_play
};
