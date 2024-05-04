const { webSocket } = require("./webSocket");
const { define_match, update_match } = require("./updateMatch");
const { send_data } = require("./dataToClient");

class   inforPlayer {
    constructor(id, name, avatar, level, type) {
        this.status = false,
        this.id = id,
        this.name = name,
        this.avatar = avatar,
        this.level = level,
        this.type = type,
        this.score = 0
    }
};

function    check_place_in_match(user)
{
    let indexMatch = define_match(user);
    if (indexMatch === undefined)
        return false;

    const   match = webSocket.listMatch[indexMatch];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type === 'none')
            return true;
    }
    return false;
}

function    leave_match(user)
{
    let indexMatch = define_match(user);
    if (indexMatch === undefined)
        return false;

    const   match = webSocket.listMatch[indexMatch];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.id === user.id)
        {
            match.listPlayer[i] = new inforPlayer('', '', "../../img/avatar/addPlayerButton.jpg", 42, 'none');
            update_match(user, match, 'update match');
            return ;
        }
    }
}

function    add_user_in_a_match(user, newPlayer)
{
    let indexMatch = define_match(user);
    if (indexMatch === undefined)
        return ;

    const   match = webSocket.listMatch[indexMatch];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type === 'none')
        {
            match.listPlayer[i] = new inforPlayer(newPlayer.id, newPlayer.name, newPlayer.avatar, newPlayer.level, 'player');
            update_match(user, match, 'update match');
            send_data('accept invitation to play', '', user, match.listUser);
            return ;
        }
    }
}

function    accept_invitation_to_play(data)
{
    if (!check_place_in_match(data.to))
    {
        send_data('reject invitation to play', 'Sorry guy, the match is full!', data.to, data.from);
        return ;
    }

    send_data('load create match layer', '', data.to, data.from);
    // if (data.from.status === 'creating match')
    leave_match(data.from);
    add_user_in_a_match(data.to, data.from);
}

module.exports = {
    accept_invitation_to_play,
    leave_match,
    inforPlayer
};
