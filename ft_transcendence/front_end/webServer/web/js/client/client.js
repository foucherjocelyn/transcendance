import { create_match, display_loader, update_match_informations } from "../createMatch/createMatch.js";
import { setup_game_layer } from "../game/startGame.js";
import { notice_invitation_play } from "../noticeInvitationPlay/noticeInvitationPlay.js";
import { receiveMessage, renderChatInput } from "../chat/chatbox.js";
import { authCheck } from "../authentication/auth_main.js";
import { display_invitation_play_layer } from "../invitationPlay/invitationPlay.js";
import { update_game_settings } from "../gameSettings/updateGameSetting.js";
import { draw_score } from "../game/drawScore.js";
import { draw_paddle } from "../game/drawPaddles.js";
import { display_countdown } from "../game/displayCountdown.js";
import { display_button_game_over, display_game_over_layer } from "../game/gameOverLayer.js";
import { change_color_border } from "../game/drawBorders.js";
import { removeAlias } from "../backend_operation/alias.js";
import { refresh_tour_waiting_room } from "../home/tournament/home_tournament_room.js";
import { to_tournament } from "../home/tournament/home_tournament.js";
import { domain_name } from "../backend_operation/authentication.js";

class userNotifications {
    constructor() {
        this.from = data.from,
            this.type = data.content;
    }
};

export class userMessages {
    constructor() {
        this.user = undefined,
            this.listMessages = [];
    }
};

export const client = {
    socket: undefined,
    inforUser: undefined,
    listUser: []
};

export class dataToServer {
    constructor(title, content, to) {
        this.title = title,
            this.content = content,
            this.to = to
    }
}

export let pongGame;

function get_data_from_server(socket) {
    socket.onmessage = function (event) {
        let receivedData = JSON.parse(event.data);
        // console.log(receivedData.title);

        if (receivedData.title === 'message') {
            receiveMessage(receivedData);
        }
        if (receivedData.title === 'update list connection') {
            client.listUser = receivedData.content;
        }
        if (receivedData.title === 'invite to play') {
            notice_invitation_play(receivedData);
        }
        if (receivedData.title === 'refused participate match') {
            notice_invitation_play(receivedData);
        }
        if (receivedData.title === 'reject invitation to play') {
            notice_invitation_play(receivedData);
        }
        if (receivedData.title === 'warning') {
            notice_invitation_play(receivedData);
        }
        if (receivedData.title === 'update match') {
            update_match_informations(receivedData);
        }
        if (receivedData.title === 'display invitation play layer') {
            display_invitation_play_layer(receivedData.content);
        }
        if (receivedData.title === 'display loader') {
            display_loader(receivedData.content);
        }
        if (receivedData.title === 'start game') {
            setup_game_layer();
        }
        if (receivedData.title === 'countdown') {
            display_countdown(receivedData.content);
        }
        if (receivedData.title === 'update game settings') {
            update_game_settings(receivedData);
        }
        if (receivedData.title === 'update pongGame') {
            pongGame = receivedData.content;
        }
        if (receivedData.title === 'update borders') {
            pongGame.listBorder = receivedData.content;
        }
        if (receivedData.title === 'update paddles') {
            pongGame.listPaddle = receivedData.content;
        }
        if (receivedData.title === 'update ball') {
            pongGame.ball = receivedData.content;
        }
        if (receivedData.title === 'movement ball') {
            pongGame.ball.position = receivedData.content;
        }
        if (receivedData.title === 'draw score') {
            draw_score(receivedData.content);
        }
        if (receivedData.title === 'draw paddles') {
            draw_paddle();
        }
        if (receivedData.title === 'change color border') {
            change_color_border(receivedData.content);
        }
        if (receivedData.title === 'game over') {
            display_game_over_layer(receivedData.content);
        }
        if (receivedData.title === 'update tournament board') {
            if (document.querySelector("#h_tournament_board")) {
                to_tournament("true");
            }
        }
        if (receivedData.title === 'joining tournament') {
            refresh_tour_waiting_room(receivedData.content);
        }
        if (receivedData.title === 'delete alias') {
            removeAlias();
        }
        if (receivedData.title === 'display exit match') {
            display_button_game_over(receivedData.content);
        }
        if (receivedData.title === 'mute') {
            renderChatInput(receivedData.from.username);
        }
        if (receivedData.title === 'unmute') {
            renderChatInput(receivedData.from.username);
        }
        if (receivedData.title === 'update tournament tree') {
            console.log('update tournament tree');
            console.table(receivedData.content);
        }
    };
}

function connection() {
    // Connect to WebSocket with secure connection
    const protocol = (window.location.protocol === 'https:') ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${domain_name}:5555`);

    socket.onopen = function () {
        console.log('Connected to WebSocket server');
        get_data_from_server(socket);
        authCheck();
    };

    client.socket = socket;

    socket.onclose = function () {
        console.log('WebSocket connection closed: from client');
    };
}

connection();
