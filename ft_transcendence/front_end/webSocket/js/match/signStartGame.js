const { define_user_by_ID } = require("../webSocket/webSocket");
const { define_match, update_match } = require("./updateMatch");
const { matchmaking } = require("./matchmaking");
const { send_data } = require("../webSocket/dataToClient");
const { setup_game } = require("../game/setupGame");
const { leave_match } = require("./acceptInvitationPlay");

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
        send_data('warning', 'You need at least 2 players to start', '../../img/avatar/avatar1.png', match.admin);
        return false;
    }

    const   nbrPerson = match.listPlayer.filter(player => player.type === 'player').length;
    if ((match.mode === 'ranked' || match.mode === 'with friends') && nbrPerson < 2)
    {
        send_data('warning', 'You need at least 2 players ( not AI ) to start', '../../img/avatar/avatar1.png', match.admin);
        return false;
    }
    return true;
}

function    call_matchmaking(user, match)
{
    send_data('display loader', 'flex', 'server', user);
    send_data('display button start', 'none', 'server', user);
    matchmaking(user, match, (result) => {
        if (result)
        {
            match.listPlayer.forEach((player, index) => {
                if (player.type === 'player')
                {
                    const   user2 = define_user_by_ID(player.id);
                    if (index > 0)
                    {
                        leave_match(user2);
                        user2.matchID = match.id;
                    }
                    update_match(user2);
                }
            });
            setup_game(match);
        }
    });
}

function    sign_start_game(sender)
{
    const   match = define_match(sender);
    if (match === undefined || match.mode === 'tournament') {
        return;
    }

    arrange_player_positions(match);
    
    if (!check_number_player(match)) {
        return ;
    }
    
    (match.mode === 'ranked') ? call_matchmaking(sender, match) : setup_game(match);
}

module.exports = {
    sign_start_game
};
