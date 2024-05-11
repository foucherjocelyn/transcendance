const { matchmaking } = require("../matchmaking/matchmaking");
const { leave_match } = require("./acceptInvitationPlay");
const { send_data } = require("./dataToClient");
const { update_match, define_match } = require("./updateMatch");
const { webSocket } = require("./webSocket");

function    arrange_player_positions(match)
{
    const   listPlayer = [];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        for (let j = 0; j < match.listPlayer.length; j++)
        {
            const   player = match.listPlayer[j];
            if (i === 0 && player.type === 'player')
                listPlayer.push(player);
            else if (i === 1 && player.type === 'AI')
                listPlayer.push(player);
            else if (i === 2 && player.type === 'none')
                listPlayer.push(player);
        }
    }
    match.listPlayer = listPlayer;
}

function    sign_start_game(data)
{
    let indexMatch = define_match(data.from);
    if (indexMatch === undefined)
        return;

    const   match = webSocket.listMatch[indexMatch];
    arrange_player_positions(match);
    
    if (match.mode !== 'rank' && match.mode !== 'tournament')
    {
        update_match(data.from, match, 'update match');
        send_data(data.title, data.content, data.from, match.listUser);
    }
    else
    {
        matchmaking(match, (result) => {
            if (!result)
                return ;
            
            for (let i = 1; i < match.listPlayer.length; i++)
            {
                const   player = match.listPlayer[i];
                if (player.type === 'player')
                    leave_match(player);
            }
            update_match(data.from, match, 'update match');
            // send_data(data.title, data.content, data.from, match.listUser);
        })
    }
}

module.exports = {
    sign_start_game
};
