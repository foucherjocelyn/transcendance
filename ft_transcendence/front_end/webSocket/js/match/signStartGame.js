const { webSocket } = require("../webSocket/webSocket");
const { define_match } = require("./updateMatch");
const { leave_match } = require("./acceptInvitationPlay");
const { matchmaking } = require("../matchmaking/matchmaking");
const { send_data } = require("../webSocket/dataToClient");
const { setup_game } = require("../game/setupGame");

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

function    check_number_player(match)
{
    const   nbrPlayer = 4 - match.listPlayer.filter(player => player.type === 'none').length;
    if (nbrPlayer < 2)
    {
        send_data('warning', 'You need at least 2 players to start', '../../img/avatar/informationsSign.png', match.admin);
        return false;
    }

    const   nbrPerson = match.listPlayer.filter(player => player.type === 'player').length;
    if ((match.mode === 'ranked' || match.mode === 'tournament') && nbrPerson < 2)
    {
        send_data('warning', 'You need at least 2 players ( not AI ) to start', '../../img/avatar/informationsSign.png', match.admin);
        return false;
    }
    return true;
}

function    call_matchmaking(match, data)
{
    if (match.mode === 'tournament')
            match.listPlayer[0].name = match.listPlayer[0].name + match.listPlayer[0].id;

    matchmaking(match, (result) => {
        if (!result)
            return ;
        
        match.listPlayer.forEach((player, index) => {
            if (index > 0 && player.type === 'player') {
                leave_match(player);
            }
        })
        setup_game(data, match);
    })
}

function    sign_start_game(data)
{
    let indexMatch = define_match(data.from);
    if (indexMatch === undefined)
        return;

    const   match = webSocket.listMatch[indexMatch];
    arrange_player_positions(match);
    if (!check_number_player(match)) {
        return ;
    }
    
    (match.mode === 'ranked' || match.mode === 'tournament') ?
    call_matchmaking(match, data) :
    setup_game(data, match);
}

module.exports = {
    sign_start_game
};
