const { webSocket } = require("./webSocket");
const { define_match, update_match } = require("./updateMatch");
const { send_data, find_socket } = require("./dataToClient");
const { reponse_invitation_to_play_ws } = require("./invitationToPlay");

class   inforPlayer {
    constructor(id, name, avatar, level, type) {
        this.status = false,
        this.id = id,
        this.name = name,
        this.avatar = avatar,
        this.level = level,
        this.type = type,
        this.score = 0,
        this.paddle = undefined
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

    const   socket = find_socket(user);
    if (socket !== undefined)
        reponse_invitation_to_play_ws(socket);

    const   match = webSocket.listMatch[indexMatch];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.id === user.id)
        {
            match.listPlayer[i] = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
            update_match(user, match, 'update match');
            return ;
        }
    }
}

function    kick_out_of_the_match(data)
{
    leave_match(data.to);
    send_data('create match', data.to, data.to, data.to);
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
            match.listPlayer[i] = new inforPlayer(newPlayer.id, newPlayer.username, newPlayer.avatarPath, newPlayer.level, 'player');
            update_match(user, match, 'update match');
            send_data('reponse invitation to play', 'accepted the invitation to play', newPlayer, match.listUser);
            return ;
        }
    }
}

function check_list_invitation_to_play_ws(user, match)
{
    for (let i = 0; i < match.listInvite.length; i++)
    {
        const   check = match.listInvite[i];
        if (check.id === user.id)
            return i;
    }
    return undefined;
}

function    accept_invitation_to_play(data)
{
    let indexMatch = define_match(data.to);
    if (indexMatch === undefined)
        return ;

    const   match = webSocket.listMatch[indexMatch];
    if (check_list_invitation_to_play_ws(data.from, match) === undefined)
        return ;

    if (!check_place_in_match(data.to)) {
        send_data('reject invitation to play', 'Sorry guy, the match is full!', data.to, data.from);
        return ;
    }

    if (define_match(data.from) !== undefined) {
        leave_match(data.from);
    }
    
    add_user_in_a_match(data.to, data.from);
    console.log('---------------')
}

module.exports = {
    accept_invitation_to_play,
    leave_match,
    inforPlayer,
    kick_out_of_the_match,
};
