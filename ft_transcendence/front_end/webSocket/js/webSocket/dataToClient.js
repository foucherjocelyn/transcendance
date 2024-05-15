const { webSocket } = require("./webSocket");

class   dataToClient {
    constructor(t, c, f) {
        this.title = t,
        this.content = c,
        this.from = f
    }
};

function    find_socket(user)
{
    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (user !== undefined && connection.user.id === user.id)
            return connection.socket;
    }
    return undefined;
}

function    send_data(title, content, from, to)
{
    let   sendData = new dataToClient(title, content, from);
    sendData = JSON.stringify(sendData);

    let   destinations = [];
    if (Array.isArray(to))
        destinations = to;
    else
        destinations[0] = to;

    for (let i = 0; i < destinations.length; i++)
    {
        const   user = destinations[i];
        const   socket = find_socket(user);
        if (socket !== undefined)
        {
            // console.log('Server sent data to: ' + user.id);
            socket.sendUTF(sendData);
        }
        else
        {
            if (title === 'notification' || title === 'message')
                console.log('connect with data base');
        }
    }
}

module.exports = {
    send_data,
    dataToClient,
    find_socket
};
