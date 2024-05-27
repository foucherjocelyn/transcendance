const { webSocket } = require("../webSocket/webSocket");
const { define_user } = require("./createMatch");
const { send_data } = require("../webSocket/dataToClient");
const { define_match } = require("./updateMatch");

function    request_invitation_to_play(socket, recipient)
{
    const   sender = define_user(socket);
    if (sender === undefined || recipient === undefined) {
        return ;
    }

    let indexMatch = define_match(sender);
    if (indexMatch === undefined) {
        return ;
    }

    const   match = webSocket.listMatch[indexMatch];
    match.listInvite.push(recipient);

    send_data('invite to play', "Hey guy, do you want to play 'Pong Game' with me?", sender, recipient);
}

module.exports = {
    request_invitation_to_play
};
