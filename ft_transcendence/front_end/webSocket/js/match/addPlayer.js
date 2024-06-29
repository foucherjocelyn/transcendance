const { define_user_by_ID } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { leave_match } = require("./acceptInvitationPlay");
const { inforPlayer, create_match } = require("./createMatch");
const { define_match, update_match } = require("./updateMatch");

function    kick_out_of_the_match(player)
{
    leave_match(player);
    const   user = define_user_by_ID(player.id);
    create_match(user, 'with friends');
}

function    add_player_mode_friend(user, match, position)
{
    const   player = match.listPlayer[position];
    const   admin = match.listPlayer[0];

    if (player.type === 'none') {
        match.listPlayer[position] = new inforPlayer('#42', 'AI ' + (position + 1), "../../img/avatar/AI.png", 42, 'AI');
    }
    else
    {
        // can't kick a person if not admin
        if (player.type === 'player' && user.id !== admin.id) {
            return ;
        }

        (player.type === 'AI') ?
        send_data('display invitation play layer', 'flex', 'server', user):
        kick_out_of_the_match(player);
        
        match.listPlayer[position] = new inforPlayer('', '', "../../img/button/button_add_player.png", 42, 'none');
    }
    update_match(user);
}

function    add_player_mode_ranked(user, match, position)
{
    const   player = match.listPlayer[position];
    if (player.type === 'none') {
        match.listPlayer[position] = new inforPlayer('#42', 'AI ' + (position + 1), "../../img/avatar/AI.png", 42, 'AI');
    }
    else if (player.type === 'AI') {
        match.listPlayer[position] = new inforPlayer('#42', 'Player ' + (position + 1), "../../img/avatar/avatar2.png", 42, 'player');
    }
    else {
        match.listPlayer[position] = new inforPlayer('', '', "../../img/button/button_add_player.png", 42, 'none');
    }
    update_match(user);
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
    add_player_mode_ranked(user, match, position);
}

module.exports = {
    add_player
};
