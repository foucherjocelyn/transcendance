const https = require("https");
const fs = require('fs').promises;
const WebSocket = require('ws');

const webSocket = {
    listUser: [],
    listConnection: [],
    listMatch: [],
    listFindMatch: []
};

function update_user(user) {
    for (let i = 0; i < webSocket.listUser.length; i++) {
        const find = webSocket.listUser[i];
        if (find.id === user.id) {
            webSocket.listConnection[i].user = user;
            webSocket.listUser[i] = user;
            send_data('update list users', webSocket.listUser, user, webSocket.listUser);
            return;
        }
    }
}

function get_data_from_client(data, socket) {
    data = JSON.parse(data);

    // console.log('title: ' + data.title);
    if (data.title === 'connection')
        add_new_connection(data, socket);
    else if (data.title === 'disconnect')
        disconnect(socket);
    else if (data.title === 'update match')
        update_match(data.from, data.content, data.title);
    else if (data.title === 'invite to play')
        request_invitation_to_play(data);
    else if (data.title === 'accept invitation to play')
        accept_invitation_to_play(data);
    else if (data.title === 'leave match')
        leave_match(data.from);
    else if (data.title === 'kick out of the match')
        kick_out_of_the_match(data);
    else if (data.title === 'start game')
        sign_start_game(data);
    else if (data.title === 'update game settings')
        update_game_settings_ws(data);
    else if (data.title === 'game over')
        informations_match_end(data.from, data.content);
    else
        send_data(data.title, data.content, data.from, data.to);

    update_user(data.from);
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
            get_data_from_client(message, socket);
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
    update_user
};

const { add_new_connection, disconnect } = require('./addNewConnection');
const { send_data } = require('./dataToClient');
const { update_match } = require('./updateMatch');
const { accept_invitation_to_play, leave_match, kick_out_of_the_match } = require('./acceptInvitationPlay');
const { sign_start_game } = require('./signStartGame');
const { request_invitation_to_play } = require('./invitationToPlay');
const { informations_match_end } = require("./getResultsMatch");const { update_game_settings_ws } = require("../game/gameSettingsWS");

