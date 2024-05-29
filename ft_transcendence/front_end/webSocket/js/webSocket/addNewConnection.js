const { webSocket } = require("./webSocket");
const { leave_match } = require("../match/acceptInvitationPlay");
const { send_data } = require("./dataToClient");

class   connection {
    constructor(user, socket) {
        this.user = user,
        this.socket = socket
    }
};

function    add_new_connection(data, socket)
{
    const   user = new connection(data.content, socket);
    webSocket.listConnection.push(user);
    webSocket.listUser.push(data.content);
}

function    disconnect(socket)
{
    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.socket === socket)
        {
            const   user = connection.user;
            if ((user !== undefined) && (user.status === 'creating match' || user.status === 'playing game')) {
                leave_match(user);
            }

            webSocket.listConnection.splice(i, 1);
            webSocket.listUser.splice(i, 1);
            return ;
        }
    }
}

module.exports = {
    add_new_connection,
    disconnect
};

