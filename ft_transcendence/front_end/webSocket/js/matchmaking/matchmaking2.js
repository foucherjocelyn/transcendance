const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { define_match_in_list_find_match } = require("./matchmaking");

function    compare_type_match_in_list_find(match, match2)
{
    for (let i = 1; i < match.listPlayer.length; i++)
    {
        const   player1 = match.listPlayer[i];
        const   player2 = match2.listPlayer[i];
        if (player1.type !== player2.type)
            return false;
    }
    return true;
}

function    count_players_in_match_random(match)
{
    let   nbrPlayer = 0;
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type === 'player')
            nbrPlayer++;
    }
    return nbrPlayer;
}

function    add_players_random(match, maxPlayers)
{
    const   listPlayer = [];
    const   player = match.listPlayer[0];

    if (webSocket.listFindMatch.length > 1)
    {
        for (let i = 0; i < webSocket.listFindMatch.length; i++)
        {
            const   check = webSocket.listFindMatch[i].match;
            if (compare_type_match_in_list_find(match, check))
            {
                const   player2 = check.listPlayer[0];
                if (player.level === player2.level)
                {
                    if (listPlayer.length === maxPlayers)
                        break ;
                    if ((match.mode !== 'tournament') || (match.mode === 'tournament' && match.tournamentID === check.tournamentID))
                        listPlayer.push(check.listPlayer[0]);
                }
            }
        }
    }
    return listPlayer;
}

function    search_match_in_list_find_match(match, callback)
{
    // console.log('finding match ...');
    const   maxPlayers = count_players_in_match_random(match);
    const   listPlayer = add_players_random(match, maxPlayers);

    if (listPlayer.length !== maxPlayers)
    {
        callback(false);
        return ;
    }
    
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type !== 'player')
            listPlayer.push(player);
    }

    match.listPlayer = listPlayer;
    // console.log('--> length of list player: ' + listPlayer.length);
    // console.log('max nbr players: ' + maxPlayers);
    callback(true);
}

module.exports = {
    search_match_in_list_find_match
};
