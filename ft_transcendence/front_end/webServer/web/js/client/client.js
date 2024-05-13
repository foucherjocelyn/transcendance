import { create_match, display_create_match_layer, match, update_match_informations } from "../createMatch/createMatch.js";
import { update_position_ball } from "../game/movementsBall.js";
import { update_position_paddle } from "../game/movementsPaddle.js";
import { pongGame, setup_game_layer } from "../game/startGame.js";
import { update_game_settings } from "../gameSettings/updateGameSetting.js";
import { accept_invite_to_play } from "../invitationPlay/invitationPlay.js";
import { notice_invitation_play } from "../noticeInvitationPlay/noticeInvitationPlay.js";
import { receiveMessage } from "../chat/chatbox.js";
import { authCheck } from "../authentication/auth_main.js";
import { gameEventListener, to_game } from "../home/home_game.js";

class   userNotifications {
    constructor() {
        this.from = data.from,
        this.type = data.content;
    }
};

class   userMessages {
    constructor() {
        this.user = undefined,
        this.listMessages = [];
    }
};

const   user = {
    id: undefined,
    name: undefined,
    status: undefined,
    avatar: '../img/avatar/avatar_default.png',
    level: undefined,
    listFriends: [],
    listChat: [],
    listNotifications: []
}

const   client = {
    socket: undefined,
    inforUser: undefined,
    listUser: []
};

class   dataToServer {
    constructor(title, content, from, to) {
        this.title = title,
        this.content = content,
        this.from = from,
        this.to = to
    }
}

function    get_data_from_server(socket)
{
    socket.onmessage = function(event) {
        let   receivedData = JSON.parse(event.data);
        // console.log(receivedData.title);

        if (receivedData.title === 'message')
            receiveMessage(receivedData);
        if (receivedData.title === 'update list users')
        {
            client.listUser = receivedData.content;
            // console.table(client.listUser);   
        }
        if (receivedData.title === 'invite to play')
            notice_invitation_play(receivedData);
        if (receivedData.title === 'accept invitation to play')
            display_create_match_layer();
        if (receivedData.title === 'reject invitation to play')
            notice_invitation_play(receivedData);
        if (receivedData.title === 'warning')
            notice_invitation_play(receivedData);
        if (receivedData.title === 'update match')
            update_match_informations(receivedData);
        if (receivedData.title === 'create match')
			create_match("with friends");
        if (receivedData.title === 'hide loader')
        {
            if (document.getElementById('loaderMatchmakingLayer') !== null)
                document.getElementById('loaderMatchmakingLayer').style.display = 'none';
        }
        if (receivedData.title === 'start game')
            setup_game_layer();
        if (receivedData.title === 'update game settings')
            update_game_settings(receivedData);
        if (receivedData.title === 'update vector ball')
            Object.assign(pongGame.ball.vector, receivedData.content);
        if (receivedData.title === 'update movement ball')
            Object.assign(pongGame.ball.position, receivedData.content);
        if (receivedData.title === 'update movement paddle')
            update_position_paddle(receivedData.content);
        if (receivedData.title === 'update movement ball')
            update_position_ball(receivedData.content);
    };
}

function    connection()
{
    // Connect to web socket
    const socket = new WebSocket('ws://127.0.0.1:5555');
    
    socket.onopen = function() {
        console.log('Connected to WebSocket server');
        get_data_from_server(socket);
        authCheck();
    };

    client.socket = socket;

    socket.onclose = function() {
        console.log('WebSocket connection closed');
    };
}

connection();

export {
    user,
    client,
    dataToServer,
    userMessages
};
