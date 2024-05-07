import { screen } from "../screen/screen.js";
import { get_sign_buttons_in_invitation_play_layer } from "./getSignButtonsInInvitationPlay.js";

function    setup_size_invitation_play_layer()
{
    const   invitationPlayLayer = document.getElementById('invitationPlayLayer');
    invitationPlayLayer.style.height = `${screen.height}px`;
    invitationPlayLayer.style.width = `${screen.width}px`;
}

function    setup_size_invitation_play_panel()
{
    const   invitationPlayPanel = document.getElementById('invitationPlayPanel');
    invitationPlayPanel.style.height = '80%';
    invitationPlayPanel.style.width = `${screen.width / 4}px`;
}

function    accept_invite_to_play()
{
    console.log('accept invitation to play function');
    if (document.getElementById('createMatchLayer') === null) {
        console.log("create match layer is null");
        return ;
    }

    document.getElementById('invitationPlayLayer').style.display = 'none';
    document.getElementById('createMatchLayer').style.display = 'flex';
}

function    invitation_to_play()
{
    document.getElementById('invitationPlayLayer').style.display = 'flex';

    setup_size_invitation_play_layer();
    setup_size_invitation_play_panel();
    get_sign_buttons_in_invitation_play_layer();
}

export {
    invitation_to_play,
    accept_invite_to_play
};
