const { webSocket, define_user_by_ID } = require("./webSocket");
const { leave_match } = require("../match/acceptInvitationPlay");
const { define_socket_by_user } = require("./dataToClient");
const { isNumeric } = require("../gameSettings/checkInputSize");

class   connection {
    constructor(user, socket) {
        this.user = user,
        this.socket = socket
    }
};

function    add_new_connection(inforUser, socket)
{
    if (inforUser === undefined || inforUser.id === undefined || !isNumeric(inforUser.id)) {
        return ;
    }

    // check same user
    const   checkConnection = define_user_by_ID(inforUser.id);
    if (checkConnection !== undefined)
    {
        // const   oldSocket = define_socket_by_user(inforUser);
        // if (oldSocket === undefined) {
        //     return ;
        // }
        // disconnect(oldSocket);
        return ;
    }

    const   user = new connection(inforUser, socket);
    webSocket.listConnection.push(user);
    // webSocket.listUser.push(inforUser);
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
            // webSocket.listUser.splice(i, 1);
            return ;
        }
    }
}

module.exports = {
    add_new_connection,
    disconnect
};

