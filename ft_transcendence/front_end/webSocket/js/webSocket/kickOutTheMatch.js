const { leave_match } = require("./acceptInvitationPlay");
const { send_data } = require("./dataToClient");

function    kick_out_of_the_match(data)
{
    leave_match(data.to);
    send_data('create match', data.to, data.from, data.to);
}

module.exports = {
    kick_out_of_the_match
};
