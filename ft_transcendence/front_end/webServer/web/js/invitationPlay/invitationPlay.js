import { display_create_match_layer, match } from "../createMatch/createMatch.js";
import { invitationPlayLayerHTML } from "../home/home_creatematch.js";
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

export function    display_invitation_play_layer()
{
    const   createMatchLayer = document.getElementById('createMatchLayer');
    if (createMatchLayer === null)
    {
        display_create_match_layer();
        return ;
    }

    invitationPlayLayerHTML();
    setup_size_invitation_play_layer();
    setup_size_invitation_play_panel();
    get_sign_buttons_in_invitation_play_layer();
}
