const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { inforPlayer } = require("./createMatch");
const { define_match, update_match } = require("./updateMatch");

function    change_match_admin(match)
{
    const   admin = match.admin;
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (i > 0 && player.id !== admin.id)
        {
            match.admin = player;
            match.listPlayer[0] = player;
            match.listPlayer[i] = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
            return ;
        }
    }

    console.table(match.listPlayer);
    console.table(match.admin.id);
}

function    leave_match(user)
{
    let indexMatch = define_match(user);
    if (indexMatch === undefined)
        return ;

    const   match = webSocket.listMatch[indexMatch];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.id === user.id)
        {
            // admin leave
            (player.id === match.admin.id) ?
            change_match_admin(match) :
            match.listPlayer[i] = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');

            update_match(user, match);
            return ;
        }
    }
}

function    add_user_in_a_match(user, newPlayer, match)
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type === 'none')
        {
            match.listPlayer[i] = new inforPlayer(newPlayer.id, newPlayer.username, newPlayer.avatarPath, newPlayer.level, 'player');
            update_match(user, match);
            
            send_data('reponse invitation to play', 'accepted the invitation to play', newPlayer, match.listUser);
            return ;
        }
    }
}

function    accept_invitation_to_play(data)
{
    let indexMatch = define_match(data.to);
    if (indexMatch === undefined)
        return ;

    const   match = webSocket.listMatch[indexMatch];
    const   inListInvite = match.listInvite.some(user => user.id === data.from.id);
    if (!inListInvite) {
        return ;
    }

    const   nbrPlace = match.listPlayer.filter(player => player.type === 'none').length;
    if (nbrPlace === 0) {
        send_data('reject invitation to play', 'Sorry guy, the match is full!', data.to, data.from);
        return ;
    }

    leave_match(data.from);
    add_user_in_a_match(data.to, data.from, match);
}

module.exports = {
    accept_invitation_to_play,
    leave_match
};
