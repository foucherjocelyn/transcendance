import { client, dataToServer } from "../client/client.js";
import { display_create_match_layer, match } from "../createMatch/createMatch.js";
import { notice_invitation_play } from "../noticeInvitationPlay/noticeInvitationPlay.js";
import { screen } from "../screen/screen.js";
import { check_list_invitation_to_play } from "./displayResultsSearchInvitationPlay.js";
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
    const   index = check_list_invitation_to_play(data.from);
    if (index === undefined)
        return ;

    match.listInvite.splice(index, 1);

    // console.log('length delete: ' + match.listInvite.length);
    if (data.content === "accepted the invitation to play") // accepted
    {
        if (document.getElementById('loaderMatchmakingLayer') !== null)
            document.getElementById('loaderMatchmakingLayer').style.display = 'none';
        
        // update list invite
        let sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
        client.socket.send(JSON.stringify(sendData));

        display_create_match_layer();
    }
    else if (data.content === "Sorry another time, I'm busy!") // reject
    {
        // update list invite
        let sendData = new dataToServer('update match', match, client.inforUser, match.listUser);
        client.socket.send(JSON.stringify(sendData));

        notice_invitation_play(data);
    }
}

export function    invitation_to_play()
{
    setup_size_invitation_play_layer();
    setup_size_invitation_play_panel();
    get_sign_buttons_in_invitation_play_layer();
}
