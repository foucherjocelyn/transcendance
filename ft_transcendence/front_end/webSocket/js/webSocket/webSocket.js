const https = require("https");
const fs = require('fs').promises;
const WebSocket = require('ws');

const webSocket = {
    listUser: [],
    listConnection: [],
    listMatch: []
};

async function    update_informations_user(sender)
{
    for (let i = 0; i < webSocket.listUser.length; i++)
    {
        const   user = webSocket.listUser[i];
        if (user.id === sender.id)
        {
            const   infor = await create_request('GET', `/api/v1/users/${sender.id}`, '');
            if (infor === null || infor === undefined) {
                return ;
            }

            infor.avatarPath = `img/${infor.avatarPath}`;
            webSocket.listUser[i] = infor;
            webSocket.listConnection[i].user = infor;

            send_data('update infor user', infor, 'server', infor);
            send_data('update list connection', webSocket.listUser, 'server', webSocket.listUser);
            return ;
        }
    }
}

function define_user_by_socket(socket) {
    for (let i = 0; i < webSocket.listConnection.length; i++) {
        const connection = webSocket.listConnection[i];
        if (connection.socket === socket) {
            return connection.user;
        }
    }
    return undefined;
}

function define_user_by_ID(userID) {
    for (let i = 0; i < webSocket.listConnection.length; i++) {
        const connection = webSocket.listConnection[i];
        if (connection.user.id === userID) {
            return connection.user;
        }
    }
    return undefined;
}

function handle_requirements(socket, title, content, sender, recipient) {
    if (sender.status === 'online')
    {
        if (title === 'disconnect') {
            disconnect(socket);
        }
        else if (title === 'accept invitation to play') {
            accept_invitation_to_play(sender, recipient);
        }
        else if (title === 'reject invitation to play') {
            reject_invitation_to_play(sender, recipient);
        }
        else if (title === 'create match') {
            create_match(sender, content);
        }
        else if (title === 'message') {
            send_data(title, content, sender, recipient);
        }
        else if (title === 'start tournament') {
            start_tournament(content, sender);
        }
        else if (title === 'update tournament board') {
            send_sign_update_tournament_board(sender);
        }
        else if (title === 'send notif') {
            send_to_all(content, sender, title);
        }
        else if (title === 'delete tournament') {
            delete_tournament(title, content, sender);
        }
        else if (title === 'joining tournament') {
            send_sign_join_tournament(title, content, sender);
        }
        else if (title === 'update informations user') {
            update_informations_user(sender);
        }
        else if (title === 'new friend' || title === 'remove friend') {
            update_list_friends(sender, recipient);
        }
        else if (title === 'invite to play') {
            request_invitation_to_play(sender, recipient);
        }
        else {
            send_data(title, content, sender, recipient);
        }
    }
    else if (sender.status === 'creating match')
    {
        if (title === 'disconnect') {
            disconnect(socket);
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
        else if (title === 'add player') {
            add_player(sender, content);
        }
        else if (title === 'invite to play') {
            request_invitation_to_play(sender, recipient);
        }
        else if (title === 'start game') {
            sign_start_game(sender);
        }
    }
    else if (sender.status === 'playing game')
    {
        if (title === 'disconnect') {
            disconnect(socket);
        }
        else if (title === 'leave match') {
            leave_match(sender);
        }
        else if (title === 'update game settings') {
            update_game_settings(sender, content);
        }
        else if (title === 'movement paddle') {
            get_sign_movement_paddle(sender, content);
        }
    }
}

function check_form_data_client(obj)
{
    return obj && typeof obj === 'object' &&
        'title' in obj &&
        'content' in obj &&
        'to' in obj;
}

function check_requirements(data, socket) {
    data = JSON.parse(data);

    if (!check_form_data_client(data) || socket === undefined) {
        return;
    }
    const sender = define_user_by_socket(socket);
    if (sender === undefined) {
        if (data.title === 'connection') {
            connect(data.content, socket);
        }
    }
    else
    {
        let recipient = data.to;
        if (recipient === undefined) {
            return;
        }

        if (recipient !== 'socket server') {
            recipient = define_user_by_ID(recipient.id);
            if (recipient === undefined) {
                return;
            }
        }

        handle_requirements(socket, data.title, data.content, sender, recipient);
    }
}

async function loadCertificates() {
    const key = await fs.readFile('./src/ssl/private.key');
    const cert = await fs.readFile('./src/ssl/certificate.crt');
    return { key, cert };
}

async function setup_web_socket() {
    const options = await loadCertificates();
    const server = https.createServer(options);

    const wsServer = new WebSocket.Server({ server });

    wsServer.on('connection', (socket) => {
        console.log('New WebSocket connection established.');

        socket.on('message', (message) => {
            check_requirements(message, socket);
        });

        socket.on('close', () => {
            disconnect(socket);
            console.log('WebSocket connection closed: from webSocket');
        });
    });

    server.listen(5555, () => {
        console.log('HTTPS and WebSocket server running on port 5555');
    });
}

setup_web_socket();

module.exports = {
    webSocket,
    define_user_by_socket,
    define_user_by_ID,
    update_informations_user
};

const { connect, disconnect, update_list_friends } = require('./addNewConnection');
const { send_data } = require('./dataToClient');
const { accept_invitation_to_play, leave_match, reject_invitation_to_play } = require('../match/acceptInvitationPlay');
const { sign_start_game } = require('../match/signStartGame');
const { request_invitation_to_play } = require('../match/invitationToPlay');
const { update_game_settings } = require("../gameSettings/gameSettings");
const { get_sign_movement_paddle } = require("../game/movementsPaddle");
const { create_match } = require("../match/createMatch");
const { add_player } = require("../match/addPlayer");
const { start_tournament, send_sign_join_tournament, send_sign_update_tournament_board, send_to_all, delete_tournament } = require("../match/tournament");
const { create_request } = require("../dataToDB/createRequest");
const { url } = require("inspector");
const { userInfo } = require("os");

