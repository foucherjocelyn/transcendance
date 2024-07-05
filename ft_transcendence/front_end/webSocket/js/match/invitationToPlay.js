const { send_data } = require("../webSocket/dataToClient");
const { define_match } = require("./updateMatch");

async function    request_invitation_to_play(sender, recipient)
{
    // check alias sender
    if (sender.alias !== null && sender.alias !== undefined) {
        return ;
    }

    // check alias recipient
    if (recipient.alias !== null && recipient.alias !== undefined) {
        return ;
    }

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
