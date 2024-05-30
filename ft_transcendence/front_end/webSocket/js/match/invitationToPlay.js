const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { define_match } = require("./updateMatch");

function    request_invitation_to_play(sender, recipient)
{
    if (recipient.status === 'playing game') {
        return ;
    }

    const   match = define_match(sender);
    if (match === undefined) {
        return ;
    }

    match.listInvite.push(recipient);
    send_data('invite to play', "Hey guy, do you want to play 'Pong Game' with me?", sender, recipient);
}

module.exports = {
    request_invitation_to_play
};
