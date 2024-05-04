import { create_match, match, update_match_informations } from "../createMatch/createMatch.js";
import { update_position_ball } from "../game/movementsBall.js";
import { update_position_paddle } from "../game/movementsPaddle.js";
import { pongGame, setup_game_layer } from "../game/startGame.js";
import { update_game_settings } from "../gameSettings/updateGameSetting.js";
import { accept_invite_to_play } from "../invitationPlay/invitationPlay.js";
import { notice_invitation_play } from "../noticeInvitationPlay/noticeInvitationPlay.js";
import { receiveAnnouncement } from "../chat/announcements.js";
import { receiveMessage } from "../chat/chatbox.js";
import { loadChat } from "../chat/load-chat.js";
import { authCheck } from "../authentication/auth_main.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { getAvatar } from "../backend_operation/profile_picture.js";

class   userAnnouncements {
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
    listAnnouncements: []
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

function    informations_match_in_client(match)
{
    console.log('--> match admin: ' + match.admin.id);
    console.log('--> match mode: ' + match.mode);

    console.log('--> match list User:');
    match.listUser.forEach(user => {
        console.log('[ ' + user.id + ' ]');
    });

    console.log('--> match list Players:');
    match.listPlayer.forEach(player => {
        console.log('[ ' + player.type + ' ]');
    });

    console.log('--> match time start: ' + match.timeStart.hour + ':' + match.timeStart.minute + ':' + match.timeStart.second);
    // console.log('--> match time end: ');
    
    console.log('--> match date start: ' + match.dateStart.day + '/' + match.dateStart.month + '/' + match.dateStart.year);
    
    // console.log('--> match : ');
    // this.lostPoint = false,
    // this.gameOver = false
}

function    get_data_from_server(socket)
{
    socket.onmessage = function(event) {
        let   receivedData = JSON.parse(event.data);
        // console.log(receivedData.title);

        if (receivedData.title === 'message')
            receiveMessage(receivedData);
        if (receivedData.title === 'update list users')
            client.listUser = receivedData.content;
        if (receivedData.title === 'invite to play')
            notice_invitation_play(receivedData);
        if (receivedData.title === 'accept invitation to play')
            accept_invite_to_play();
        if (receivedData.title === 'reject invitation to play')
            notice_invitation_play(receivedData);
        if (receivedData.title === 'warning')
            notice_invitation_play(receivedData);
        if (receivedData.title === 'update match')
            update_match_informations(receivedData);
        if (receivedData.title === 'create match')
            create_match('with friends');
        if (receivedData.title === 'display loader')
            document.getElementById('loaderMatchmakingLayer').style.display = 'flex';
        if (receivedData.title === 'hide loader')
            document.getElementById('loaderMatchmakingLayer').style.display = 'none';
        if (receivedData.title === 'start game')
            setup_game_layer();
        if (receivedData.title === 'update game settings')
            update_game_settings(receivedData);
        if (receivedData.title === 'update vector ball')
            Object.assign(pongGame.ball.vector, receivedData.content);
        if (receivedData.title === 'update movement paddle')
            update_position_paddle(receivedData.content);
        if (receivedData.title === 'update movement ball')
            update_position_ball(receivedData.content);
    };
}

function    get_sign_connection_button()
{
    const   button = document.getElementById('connectionButton');
    button.onclick = () => {
        button.style.display = 'none';

        const  sendData = new dataToServer('connection', client.inforUser, client.inforUser, client.inforUser);
        client.socket.send(JSON.stringify(sendData));

        // create_match('rank');
        create_match('with friends');
        // create_match('offline');
    }
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
