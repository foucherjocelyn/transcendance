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

export function    invitation_to_play()
{
    setup_size_invitation_play_layer();
    setup_size_invitation_play_panel();
    get_sign_buttons_in_invitation_play_layer();
}
