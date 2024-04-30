import { receiveAnnouncement } from "../chat/announcements.js";
import { receiveMessage } from "../chat/chatbox.js";
import { loadChat } from "../chat/load-chat.js";
import { authCheck } from "../authentication/auth_main.js";
import { getCookie } from "../authentication/auth_cookie.js";

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
    avatar: undefined,
    listFriends: [],
    listChat: [],
    listAnnouncements: []
}

const   client = {
    socket: undefined,
    inforUser: undefined,
    listUser: []
};

// user.id = '#' + ((Math.floor(Math.random() * 6)) * 2);
user.id = getCookie('id');
user.name = getCookie('username');
user.status = getCookie('status');
// user.avatar = "../../img/avatar/avatar2.jpg";
client.inforUser = user;

class   dataToServer {
    constructor(t, c, d) {
        this.title = t,
        this.content = c,
        this.destination = d
    }
}

function    getDataFromServer()
{
    client.socket.onmessage = function(event) {
        const   receivedData = JSON.parse(event.data);
        console.log('------------------> data: ' + receivedData.title);

        if (receivedData.title === 'connection')
            client.listUser = receivedData.content;
        if (receivedData.title === 'game settings')
            update_game_settings_from_server(receivedData.content);
        if (receivedData.title === 'start game')
            console.log('start game');
        if (receivedData.title === 'invite play')
            display_announcement_invitation_play(receivedData);
        if (receivedData.title === 'decline invite play')
            display_announcement_invitation_play(receivedData);
        if (receivedData.title === 'accept invite play')
            accept_invitation_play(receivedData);
        if (receivedData.title === 'update match informations')
            update_match_informations(receivedData);
        if (receivedData.title === 'message')
            receiveMessage(receivedData);
        if (receivedData.title === 'announcement')
            receiveAnnouncement(receivedData);
        // gerer ici
    }
}

function    buttonConnection()
{
    const   createMatchLayer = document.getElementById('chat');

        console.log('Button pressed');
        createMatchLayer.style.display = 'flex';
        button.style.display = 'none';

        const  sendData = new dataToServer('connection', client.inforUser, client.inforUser);
        client.socket.send(JSON.stringify(sendData));

        // create_match('offline');
        // create_match('with friends');
        loginTestUser();
        loadChat();
}

function    main()
{
    const socket = new WebSocket('ws://127.0.0.1:4242');

    socket.onopen = function() {
        console.log('Connected to server');
        getDataFromServer();
        authCheck();
    };

    client.socket = socket;

    // getDataFromServer();
    // authCheck();
    // buttonConnection();
}

main()

export {
    client,
    dataToServer,
    userMessages
};
