import { client, dataToServer } from "../client/client.js";
import { display_create_match_layer, match } from "../createMatch/createMatch.js";
import { invitationPlayLayerHTML } from "../home/home_creatematch.js";
import { notice_invitation_play } from "../noticeInvitationPlay/noticeInvitationPlay.js";
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

export function reponse_invitation_to_play_cl(data)
{
    if (data.content === "accepted the invitation to play") // accepted
    {
        if (document.getElementById('loaderMatchmakingLayer') !== null)
            document.getElementById('loaderMatchmakingLayer').style.display = 'none';
        display_create_match_layer();
    }
    else if (data.content === "Sorry another time, I'm busy!") // reject
    {
        notice_invitation_play(data);
    }
}

export function    display_invitation_play_layer()
{
    invitationPlayLayerHTML();
    setup_size_invitation_play_layer();
    setup_size_invitation_play_panel();
    get_sign_buttons_in_invitation_play_layer();
}
