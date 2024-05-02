const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { search_match_in_list_find_match } = require("./matchmaking2");

class   matchRandom {
    constructor(match) {
        this.match = match,
        this.intervalId = undefined,
        this.timeoutId = undefined
    }
};

function    count_players(match)
{
    let nbrPlayer = 0;
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type === 'player')
            nbrPlayer++;
    }
    return nbrPlayer;
}

function    define_match_in_list_find_match(match)
{
    for (let i = 0; i < webSocket.listFindMatch.length; i++)
    {
        if (webSocket.listFindMatch[i].match === match)
            return i;
    }
    return undefined;
}

function    delete_match_in_list_find_match(match, user)
{
    send_data('hide loader', '', '', user);
    
    let   indexMatch = define_match_in_list_find_match(match);
    if (indexMatch === undefined)
        return ;
    
    clearInterval(webSocket.listFindMatch[indexMatch].intervalId);
    clearTimeout(webSocket.listFindMatch[indexMatch].timeoutId);
    
    webSocket.listFindMatch.splice(indexMatch, 1);
    console.log('--------> length list find match: ' + webSocket.listFindMatch.length);
}

function    founded_match_random(match)
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   user = match.listPlayer[i];
        if (user.type === 'player')
        {
            for (let j = 0; j < webSocket.listFindMatch.length; j++)
            {
                const   m = webSocket.listFindMatch[j].match;
                if (m.listPlayer[0] === user)
                {
                    delete_match_in_list_find_match(m, user);
                }
            }
        }
    }
}

function    search_match_in_one_minute(match, indexMatch, callback)
{
    // 60000 milliseconds = 1 minute
    const   intervalId = setInterval(() => {
        search_match_in_list_find_match(match, (result) => {
            if (result)
            {
                // console.log('found a match for you !');
                founded_match_random(match);
                callback(true);
                return;
            }
        })
    }, 1000);
    webSocket.listFindMatch[indexMatch].intervalId = intervalId;

    const   timeoutId = setTimeout(() => {
        // console.log("Parent program ends after 1 minute. " + webSocket.listFindMatch.length);
        delete_match_in_list_find_match(match, match.listUser);
        callback(false);

        send_data('hide loader', '', '', match.listUser);
        send_data('warning', 'Sorry guy, no matches found right now !!!', '../../img/avatar/informationsSign.jpg', match.listUser);
    }, 60000);
    webSocket.listFindMatch[indexMatch].timeoutId = timeoutId;
}

function    matchmaking(match, callback)
{
    if (count_players(match) === 1)
    {
        send_data('warning', 'You need at least 2 players to start', '../../img/avatar/informationsSign.jpg', match.listUser);
        callback(false);
        return ;
    }

    send_data('display loader', '', '', match.listUser);

    let   indexMatch = define_match_in_list_find_match(match);
    if (indexMatch === undefined)
        webSocket.listFindMatch.push(new matchRandom(match));

    indexMatch = define_match_in_list_find_match(match);
    // console.log('--------> length list find match: ' + webSocket.listFindMatch.length);

    if (webSocket.listFindMatch[indexMatch].intervalId !== undefined)
    {
        delete_match_in_list_find_match(match, match.listUser);
        callback(false);
        return ;
    }

    search_match_in_one_minute(match, indexMatch, (result) => {
        callback(result);
    });
}

module.exports = {
    matchmaking,
    define_match_in_list_find_match,
    delete_match_in_list_find_match,
    count_players
};
