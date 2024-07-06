const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");

function    check_type_player(match1, match2)
{
    for (let i = 1; i < match1.listPlayer.length; i++)
    {
        const   player1 = match1.listPlayer[i];
        const   player2 = match2.listPlayer[i];

        if (player1.type !== player2.type) {
            return false;
        }
    }
    return true;
}

function    founded_match(match, listPlayer, listMatch)
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (i > 0 && player.type === 'player')
        {
            const   user = listPlayer[i];
            match.listPlayer[i] = user;
            stop_finding_random_matches(user, listMatch[i]);
        }
    }
}

function    finding_random_matches(match)
{
    const   maxPlayer = match.listPlayer.filter(player => player.type === 'player').length;
    const   user1 = match.listPlayer[0];
    const   listRankedMatch = webSocket.listMatch.filter(check => check.mode === 'ranked');
    
    if (maxPlayer > listRankedMatch.length) {
        return false;
    }

    const   listPlayer = [user1];
    const   listMatch = [match];

    for (let i = 0; i < listRankedMatch.length; i++)
    {
        const   match2 = listRankedMatch[i];
        const   user2 = match2.listPlayer[0];

        if (listPlayer.length === maxPlayer)
        {
            founded_match(match, listPlayer, listMatch);
            return true;
        }

        // swap level
        let bigLevel = user1.level;
        let smallLevel = user2.level;
        
        if (bigLevel < smallLevel) {
            let tmp = bigLevel;
            bigLevel = smallLevel;
            smallLevel = tmp;
        }

        if (match.id !== match2.id && (bigLevel - smallLevel <= 1) && check_type_player(match, match2))
        {
            listPlayer.push(user2);
            listMatch.push(match2);
        }
    }
    return false;
}

function    stop_finding_random_matches(user, match)
{
    send_data('display loader', 'none', 'server', user);
    clearInterval(match.intervalId);
    match.intervalId = undefined;
}

function    start_finding_random_matches(user, match, callback)
{
    match.intervalId = setInterval(() => {
        if (finding_random_matches(match))
        {
            stop_finding_random_matches(user, match);
            callback(true);
            return ;
        }
    }, 1000);

    // after 1 minute
    const   timeoutId = setTimeout(() => {
        if (match.intervalId === undefined) {
            clearTimeout(timeoutId);
        }
        else {
            stop_finding_random_matches(user, match);
            send_data('warning', 'Sorry guy, no matches found right now !!!', '../../img/avatar/avatar1.png', match.listUser);
            send_data('display button start', 'flex', 'server', user);
        }

        callback(false);
        return ;
    }, 60000); // 60000 milliseconds = 1 minute
}

function    matchmaking(user, match, callback)
{
    if (match.intervalId === undefined)
    {
        start_finding_random_matches(user, match, (result) => {
            if (result)
            {
                callback(true);
                return ;
            }
        });
    }
    else {
        stop_finding_random_matches(user, match);
    }
    callback(false);
}

module.exports = {
    matchmaking,
    stop_finding_random_matches
};
