import { display_create_match_layer } from "../createMatch/createMatch.js";
import { search_friends_to_invite_play } from "./searchFriendsToInvite.js";

function    reset_contents_in_invitation_play_layer()
{
    document.getElementById('searchInvitationPlayInput').value = '';
    document.querySelectorAll('#resultsSearchInvitationPlayPanel > div').forEach(result => {
        result.outerHTML = null;
    });
}

function    get_sign_cancel_invitation_play_button()
{
    const   button = document.getElementById('cancelInvitationPlayButton');
    button.onclick = () => {
        display_create_match_layer();
    }
}

function    get_sign_clear_invitation_play_button()
{
    const   button = document.getElementById('clearInvitationPlayButton');
    button.onclick = () => {
        reset_contents_in_invitation_play_layer();
    }
}

function    get_sign_search_invitation_play_button()
{
    const   button = document.getElementById('searchInvitationPlayButton');
    button.onclick = () => {
        const   input = document.getElementById('searchInvitationPlayInput').value;
        search_friends_to_invite_play(input);
    }
}

function    get_sign_buttons_in_invitation_play_layer()
{
    reset_contents_in_invitation_play_layer();
    get_sign_cancel_invitation_play_button();
    get_sign_clear_invitation_play_button();
    get_sign_search_invitation_play_button();
}

export {
    get_sign_buttons_in_invitation_play_layer
};
