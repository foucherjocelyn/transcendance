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
    send_data('display loader', 'none', 'server', user);
    
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
                if (m.listPlayer[0].id === user.id)
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
                founded_match_random(match);
                callback(true);
                return;
            }
        })
    }, 1000);
    webSocket.listFindMatch[indexMatch].intervalId = intervalId;

    const   timeoutId = setTimeout(() => {
        delete_match_in_list_find_match(match, match.listUser);
        send_data('warning', 'Sorry guy, no matches found right now !!!', '../../img/avatar/informationsSign.png', match.listUser);
        callback(false);
    }, 60000);
    webSocket.listFindMatch[indexMatch].timeoutId = timeoutId;
}

function    matchmaking(match, callback)
{
    let   indexMatch = define_match_in_list_find_match(match);
    if (indexMatch === undefined)
        webSocket.listFindMatch.push(new matchRandom(match));

    // console.log('--------> length list find match: ' + webSocket.listFindMatch.length);
    
    // cancel search for a match
    indexMatch = define_match_in_list_find_match(match);
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
    delete_match_in_list_find_match
};
