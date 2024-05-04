const http = require('http');
const WebSocketServer = require('websocket').server;

const   webSocket = {
    listUser: [],
    listConnection: [],
    listMatch: [],
    listFindMatch: []
};

function    update_user(user)
{
    for (let i = 0; i < webSocket.listUser.length; i++)
    {
        const   find = webSocket.listUser[i];
        if (find.id === user.id)
        {
            webSocket.listConnection[i].user = user;
            webSocket.listUser[i] = user;
            send_data('update list users', webSocket.listUser, user, webSocket.listUser);
            return ;
        }
    }
}

function    get_data_from_client(data, socket)
{
    data = JSON.parse(data);

    // console.log('title: ' + data.title);
    if (data.title === 'connection')
        add_new_connection(data, socket);
    else if (data.title === 'deconnection')
        deconnection(socket);
    else if (data.title === 'update match')
        update_match(data.from, data.content, data.title);
    else if (data.title === 'accept invitation to play')
        accept_invitation_to_play(data);
    else if (data.title === 'leave match')
        leave_match(data.from);
    else if (data.title === 'kick out of the match')
        kick_out_of_the_match(data);
    else if (data.title === 'start game')
        sign_start_game(data);
    else
        send_data(data.title, data.content, data.from, data.to);

    update_user(data.from);
}

function    listen_connection(wsServer)
{
    // Handle new connections from clients
    wsServer.on('request', (request) => {
        const connection = request.accept(null, request.origin);
        console.log('New WebSocket connection established.');

        // Handle messages from clients
        connection.on('message', (message) => {
            if (message.type === 'utf8') {
                get_data_from_client(message.utf8Data, connection);
            }
        });

        // Handle event when client closes connection
        connection.on('close', () => {
            deconnection(connection);
            console.log('WebSocket connection closed.');
        });
    });
}

function    setup_web_socket()
{
    // Create a simple HTTP server
    const server = http.createServer((req, res) => {
        // Do nothing for now
    });

    // Connect WebSocket with HTTP server
    const wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    listen_connection(wsServer);

    // Run server on port 4242
    const PORT = process.env.PORT || 4242;
    server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
}

setup_web_socket();

module.exports = {
    webSocket
};

const { add_new_connection, deconnection } = require('./addNewConnection');
const { send_data } = require('./dataToClient');
const { update_match } = require('./updateMatch');
const { accept_invitation_to_play, leave_match } = require('./acceptInvitationPlay');
const { kick_out_of_the_match } = require('./kickOutTheMatch');
const { sign_start_game } = require('./signStartGame');

