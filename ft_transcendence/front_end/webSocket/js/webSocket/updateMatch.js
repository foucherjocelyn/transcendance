const { dataToClient, send_data } = require("./dataToClient");
const { delete_match_in_list_find_match } = require("../matchmaking/matchmaking");
const { webSocket } = require("./webSocket");

function    define_match(user)
{
    for (let i = 0; i < webSocket.listMatch.length; i++)
    {
        const   match = webSocket.listMatch[i];
        for (let j = 0; j < match.listUser.length; j++)
        {
            const   player = match.listUser[j];
            if (player.id === user.id)
                return i;
        }
    }
    return undefined;
}

function    get_user_in_list_player_ws(match)
{
    match.listUser = [];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.id[0] === '#')
        {
            match.listUser.push(match.listPlayer[i]);
        }
    }
}

function    update_match(user, inforMatch, title)
{
    let indexMatch = define_match(user)
    if (indexMatch === undefined)
        webSocket.listMatch.push(inforMatch);

    indexMatch = define_match(user);

    webSocket.listMatch[indexMatch] = inforMatch;
    const   match = webSocket.listMatch[indexMatch];

    get_user_in_list_player_ws(match);

    if (match.listUser.length === 0)
    {
        if (match.mode === 'rank')
            delete_match_in_list_find_match(match, user);
        webSocket.listMatch.splice(indexMatch, 1);
    }
    else
    {
        send_data(title, match, user, match.listUser);
    }

    console.log('length list match: ' + webSocket.listMatch.length);
}

module.exports = {
    update_match,
    define_match
};