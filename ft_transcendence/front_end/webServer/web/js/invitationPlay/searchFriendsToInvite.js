import { client } from "../client/client.js";
import { match } from "../createMatch/createMatch.js";
import { display_results_search_friends_to_play } from "./displayResultsSearchInvitationPlay.js";

function    check_str_in_str(str, str2)
{
    for (let i = 0; i < str.length; i++)
    {
        for (let j = 0; j < str2.length; j++)
        {
            if (str2[j] === str[i])
            {
                return true;
            }
        }
    }
    return false;
}

function    check_user_in_list_player(user)
{
    for (let i = 0; i < match.listUser.length; i++)
    {
        const   player = match.listUser[i];
        if (player.id === user.id)
            return false;
    }
    return true;
}

function    search_friends_to_invite(input)
{
    const   results = [];
    for (let i = 0; i < client.listUser.length; i++)
    {
        const   user = client.listUser[i];
        if (check_str_in_str(user.id, input))
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
        else if (check_str_in_str(user.name, input))
        {
            if (check_user_in_list_player(user))
            {
                if (user.name === input)
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

function    search_friends_to_invite_play(input)
{
    if (input === '')
        return ;

    const   results = search_friends_to_invite(input);
    display_results_search_friends_to_play(results);

    document.getElementById('searchInvitationPlayInput').value = '';
}

export {
    search_friends_to_invite_play
};
