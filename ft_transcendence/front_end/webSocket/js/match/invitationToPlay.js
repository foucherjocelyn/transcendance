const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { define_match } = require("./updateMatch");
const { create_request } = require("../dataToDB/createRequest");

async function    request_invitation_to_play(sender, recipient)
{
    // check alias sender
    const   inforUser1 = await create_request('GET', `/api/v1/users/${sender.id}`, '');
    if (inforUser1.alias !== null && inforUser1.alias !== undefined) {
        return ;
    }

    // check alias recipient
    const   inforUser2 = await create_request('GET', `/api/v1/users/${recipient.id}`, '');
    if (inforUser2.alias !== null && inforUser2.alias !== undefined) {
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
