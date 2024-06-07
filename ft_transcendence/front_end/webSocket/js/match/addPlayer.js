const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { leave_match } = require("./acceptInvitationPlay");
const { inforPlayer } = require("./createMatch");
const { define_match, update_match } = require("./updateMatch");

function    kick_out_of_the_match(user, match, player)
{
    if (user.id !== match.admin.id) {
        return ;
    }

    leave_match(player);
    send_data('create match', '', 'server', player);
}

function    add_player_mode_friend(user, match, position)
{
    const   player = match.listPlayer[position];
    if (player.type === 'none') {
        match.listPlayer[position] = new inforPlayer('#42', 'AI ' + (position + 1), "../../img/avatar/AI.png", 42, 'AI');
    }
    else
    {
        (player.type === 'AI') ?
        send_data('display invitation play layer', 'flex', 'server', user):
        kick_out_of_the_match(user, match, player);
        
        match.listPlayer[position] = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
    }
}

function    add_player_mode_ranked(match, position)
{
    const   player = match.listPlayer[position];
    if (player.type === 'none') {
        match.listPlayer[position] = new inforPlayer('#42', 'AI ' + (position + 1), "../../img/avatar/AI.png", 42, 'AI');
    }
    else if (player.type === 'AI') {
        match.listPlayer[position] = new inforPlayer('#42', 'Player ' + (position + 1), "../../img/avatar/avatar2.png", 42, 'player');
    }
    else {
        match.listPlayer[position] = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
    }
}

function    add_player(user, position)
{
    if (position === 0) {
        return ;
    }

    const   match = define_match(user);
    if (match === undefined) {
        return ;
    }

    (match.mode === 'with friends') ?
    add_player_mode_friend(user, match, position) :
    add_player_mode_ranked(match, position);

    update_match(user);
}

module.exports = {
    add_player
};
