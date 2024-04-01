
const   user = {
    id: undefined,
    status: undefined,
    socket: undefined,
    avatar: undefined
}

const   client = {
    socket: undefined,
    inforUser: undefined,
    listUser: []
};

user.id = Math.random() * 10;
user.status = 'connection';
// user.avatar = './img/avatar';
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

        // read title from server and add your function is here
        
    }
}

function    buttonConnection()
{
    const   createMatchLayer = document.getElementById('createMatchLayer');

    const   button = document.getElementById('buttonConnection');
    button.addEventListener('click', function() {
        console.log('Button pressed');
        createMatchLayer.style.display = 'flex';
        button.style.display = 'none';

        const  sendData = new dataToServer('connection', client.inforUser, client.inforUser);
        client.socket.send(JSON.stringify(sendData));

        create_match('offline');
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
    dataToServer
};
