const https = require("https");
const fs = require('fs').promises;
const WebSocket = require('ws');

const webSocket = {
    listUser: [],
    listConnection: [],
    listMatch: []
};

function    define_user_by_socket(socket)
{
    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.socket === socket) {
            return connection.user;
        }
    }
    return undefined;
}

function    define_user_by_ID(userID)
{
    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.user.id === userID) {
            return connection.user;
        }
    }
    return undefined;
}

function    handle_requirements(title, content, sender, recipient)
{
    if (sender.status === 'online')
    {
        if (title === 'disconnect') {
            disconnect(socket);
        }
        else if (title === 'create match') {
            create_match(sender, content);
        }
        else if (title === 'accept invitation to play') {
            accept_invitation_to_play(sender, recipient);
        }
        else if (title === 'reject invitation to play') {
            reject_invitation_to_play(sender, recipient);
        }
        else if (title === 'message') {
            send_data(title, content, sender, recipient);
        }
        // else {
        //     send_data(title, content, sender, recipient);
        // }
    }
    else if (sender.status === 'creating match')
    {
        if (title === 'add player') {
            add_player(sender, content);
        }
        else if (title === 'invite to play') {
            request_invitation_to_play(sender, recipient);
        }
        else if (title === 'accept invitation to play') {
            accept_invitation_to_play(sender, recipient);
        }
        else if (title === 'reject invitation to play') {
            reject_invitation_to_play(sender, recipient);
        }
        else if (title === 'leave match') {
            leave_match(sender);
        }
        else if (title === 'start game') {
            sign_start_game(sender);
        }
    }
    else if (sender.status === 'playing game')
    {
        if (title === 'update game settings') {
            update_game_settings(sender, content);
        }
        else if (title === 'movement paddle') {
            get_sign_movement_paddle(sender, content);
        }
        else if (title === 'leave match') {
            leave_match(sender);
        }
    }
}

function    check_form_data_client(obj)
{
    return obj && typeof obj === 'object' &&
           'title' in obj &&
           'content' in obj &&
           'to' in obj;
}

function    check_requirements(data, socket)
{
    data = JSON.parse(data);

    if (!check_form_data_client(data)) {
        return ;
    }

    if (data.title === 'connection') {
        add_new_connection(data.content, socket);
    }
    else
    {
        const   sender = define_user_by_socket(socket);
        if (sender === undefined) {
            return ;
        }

        let   recipient = data.to;
        if (recipient !== 'socket server')
        {
            recipient = define_user_by_ID(recipient.id);
            if (recipient === undefined) {
                return ;
            }
        }

        handle_requirements(data.title, data.content, sender, recipient);
    }
}

async function loadCertificates() {
    const key = await fs.readFile('./src/ssl/private.key');
    const cert = await fs.readFile('./src/ssl/certificate.crt');
    return { key, cert };
}

async function setup_web_socket()
{
    // Create a simple HTTPS server
    // const options = await loadCertificates();
    // const server = https.createServer(options, (req, res) => {
    //     // Do nothing for now
    // });

    // Connect WebSocket with HTTPS server
    // const wsServer = new WebSocket.Server({ server });
    const wsServer = new WebSocket.Server({ port: 5555, secure: true });

    wsServer.on('connection', (socket) => {
        console.log('New WebSocket connection established.');

        // Handle messages from clients
        socket.on('message', (message) => {
            check_requirements(message, socket);
        });

        // Handle event when client closes connection
        socket.on('close', () => {
            disconnect(socket);
            console.log('WebSocket connection closed.');
        });
    });

    // Run server on port 5555
    // const PORT = process.env.PORT || 5555;
    // server.listen(PORT, () => console.log(`WebSocket server running on port ${PORT}`));
    console.log(`WebSocket server running on port 5555`)
}

setup_web_socket();

module.exports = {
    webSocket,
    define_user_by_socket,
    define_user_by_ID
};

const { add_new_connection, disconnect } = require('./addNewConnection');
const { send_data } = require('./dataToClient');
const { accept_invitation_to_play, leave_match, reject_invitation_to_play } = require('../match/acceptInvitationPlay');
const { sign_start_game } = require('../match/signStartGame');
const { request_invitation_to_play } = require('../match/invitationToPlay');
const { update_game_settings } = require("../gameSettings/gameSettings");
const { get_sign_movement_paddle } = require("../game/movementsPaddle");
const { create_match } = require("../match/createMatch");
const { add_player } = require("../match/addPlayer");

