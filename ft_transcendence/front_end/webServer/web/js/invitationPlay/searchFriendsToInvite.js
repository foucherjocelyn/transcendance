import { getCookie } from "../authentication/auth_cookie.js";
import { match } from "../createMatch/createMatch.js";
import { display_results_search_friends_to_play } from "./displayResultsSearchInvitationPlay.js";

function    check_str_in_str(str, str2) {
    return String(str).includes(String(str2));
}

function    check_user_in_list_player(user) {
    for (let i = 0; i < match.listUser.length; i++)
    {
        const   player = match.listUser[i];
        if (player.id === user.id)
            return false;
    }
    return true;
}

async function    get_list_friends() {
    try {
        const listFriends = await fetch("https://localhost:8000/api/v1/user/friendship", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${getCookie("token")}`
        }
    })
        return listFriends.json();
    } catch(err) {
        console.log(err);
    }
}

async function    search_friends_to_invite(input) {
    const   listFriends = await get_list_friends();
    const   results = [];
    
    for (let i = 0; i < listFriends.length; i++)
    {
        const   user = listFriends[i];
        if ((user.status !== 'offline') && (check_str_in_str(user.id, input) || check_str_in_str(user.username, input)))
        {
            if (check_user_in_list_player(user))
            {
                if (user.id === input)
                {
                    const   tmp = results[0];
                    results[0] = user;
                    results[i] = tmp;
                }
                else if (user.status !== 'playing game')
                    results.push(user);
            }
        }
    }
    return results;
}

async function    search_friends_to_invite_play(input)
{
    if (input === '')
        return ;

    const   results = await search_friends_to_invite(input);
    display_results_search_friends_to_play(results);

    document.getElementById('searchInvitationPlayInput').value = '';
}

export {
    search_friends_to_invite_play
};
