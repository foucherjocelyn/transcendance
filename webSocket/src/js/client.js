import { receiveFriendInvite, friendInviteHasBeenAccepted, friendInviteHasBeenDeclined } from "./add-friend";
import { receiveMessage } from "./chat";
import { renderFriendList } from "./friend-list";

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
    socket: undefined,
    avatar: undefined,
    listFriends: [],
    listMessages: [],
    listAnnouncements: []
}

const   client = {
    socket: undefined,
    inforUser: undefined,
    listUser: []
};

// user.id = '#' + ((Math.floor(Math.random() * 6)) * 2);
user.id = '#' + 10 + ((Math.floor(Math.random() * 6)) * 2);
user.name = 'xuluu' + user.id + 'abc';
user.status = 'connection';
user.avatar = "../../img/avatar/avatar2.jpg";
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
        if (receivedData.title === 'friend invite received')
            receiveFriendInvite(receivedData.from);
        if (receivedData.title === 'friend invite accepted')
            friendInviteHasBeenAccepted(receivedData.from);
        if (receivedData.title === 'friend invite declined')
            friendInviteHasBeenDeclined(receivedData.from);
        // gerer ici
    }
}

function    buttonConnection()
{
    const   createMatchLayer = document.getElementById('chat');

    const   button = document.getElementById('buttonConnection');
    button.addEventListener('click', function() {
        console.log('Button pressed');
        createMatchLayer.style.display = 'flex';
        button.style.display = 'none';

        const  sendData = new dataToServer('connection', client.inforUser, client.inforUser);
        client.socket.send(JSON.stringify(sendData));

        // create_match('offline');
        // create_match('with friends');
        renderFriendList();
    });
}

function    main()
{
    const socket = new WebSocket('ws://localhost:4242');

    socket.onopen = function() {
        console.log('Connected to server');
    };

    client.socket = socket;

    getDataFromServer();
    buttonConnection();
}

main()

export {
    client,
    dataToServer,
    userMessages
};
