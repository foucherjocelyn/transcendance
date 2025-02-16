const { webSocket, define_user_by_ID } = require("../webSocket/webSocket");
const { stop_finding_random_matches } = require("./matchmaking");
const { send_data } = require("../webSocket/dataToClient");

function    define_match(user)
{
    user = define_user_by_ID(user.id);
    if (user === undefined) {
        return undefined;
    }
    
    for (let i = 0; i < webSocket.listMatch.length; i++)
    {
        const   match = webSocket.listMatch[i];
        if (user.matchID !== undefined && match.id === user.matchID) {
            return match;
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
        if (player.type !== 'none' && player.id[0] !== '#') {
            match.listUser.push(match.listPlayer[i]);
        }
    }
}

function    update_match(user)
{
    const   match = define_match(user);
    if (match === undefined) {
        return ;
    }

    get_user_in_list_player_ws(match);

    if (match.listUser.length === 0)
    {
        if (match.mode === 'ranked') {
            stop_finding_random_matches(user, match);
        }
        const   indexMatch = webSocket.listMatch.findIndex(check => check.id === match.id);
        webSocket.listMatch.splice(indexMatch, 1);
    }
    else if (user.status === 'creating match') { //user.status !== 'playing game' && match.pongGame === undefined
        send_data('update match', match, user, match.listUser);
    }

    // delete matchID if leave match
    let foundPlayer = match.listUser.find(player => player.id === user.id);
    if (foundPlayer === undefined) {
        user.status = 'online';
        user.matchID = undefined;
    }

    console.log('length list match: ' + webSocket.listMatch.length);
}

module.exports = {
    update_match,
    define_match
};