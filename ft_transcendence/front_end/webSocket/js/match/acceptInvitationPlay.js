const { send_data } = require("../webSocket/dataToClient");
const { inforPlayer } = require("./createMatch");
const { define_match, update_match } = require("./updateMatch");

function    change_match_admin(match)
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (i > 0 && player.type === 'player')
        {
            match.admin = player;
            match.listPlayer[0] = player;
            match.listPlayer[i] = new inforPlayer('', '', "../../img/button/button_add_player.png", 42, 'none');
            return ;
        }
    }
}

function    leave_match(user)
{
    const   match = define_match(user);
    if (match === undefined) {
        return ;
    }

    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.id === user.id)
        {
            // admin leave
            (player.id === match.admin.id && user.status === 'creating match' && match.listUser.length > 1) ?
            change_match_admin(match) :
            match.listPlayer[i] = new inforPlayer('', '', "../../img/button/button_add_player.png", 42, 'none');
            
            // update status user
            user.status = 'online';
            update_match(user);
            return ;
        }
    }
}

function    add_user_in_match(user, newPlayer, match)
{
    newPlayer.status = 'creating match';
    newPlayer.matchID = match.id;
    
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type === 'none')
        {
            match.listPlayer[i] = new inforPlayer(newPlayer.id, newPlayer.username, newPlayer.avatarPath, newPlayer.level, 'player');
            if (match.mode === 'with friends' && match.listPlayer[i].type === 'player') {
                send_data('display invitation play layer', 'none', 'server', user);
            }
            update_match(user);
            return ;
        }
    }
}

function    accept_invitation_to_play(sender, recipient)
{
    const   match = define_match(recipient);
    if (match === undefined) {
        return ;
    }

    const   inListInvite = match.listInvite.some(user => user.id === sender.id);
    if (!inListInvite) {
        return ;
    }

    const   nbrPlace = match.listPlayer.filter(player => player.type === 'none').length;
    if (nbrPlace === 0) {
        send_data('refused participate match', 'Sorry guy, the match is full!', recipient, sender);
        return ;
    }

    leave_match(sender);
    add_user_in_match(recipient, sender, match);
}

function    reject_invitation_to_play(sender, recipient)
{
    send_data('reject invitation to play', "Sorry another time, I'm busy!", sender, recipient);
}

module.exports = {
    accept_invitation_to_play,
    reject_invitation_to_play,
    leave_match
};
