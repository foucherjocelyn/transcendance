import { receiveAnnouncement } from "./announcements";
import { receiveMessage } from "./chatbox";
import { loadChat } from "./load-chat";

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
    listChat: [],
    listAnnouncements: []
}

const   client = {
    socket: undefined,
    inforUser: undefined,
    listUser: []
};

// user.id = '#' + ((Math.floor(Math.random() * 6)) * 2);
user.id = '#' + 10 + ((Math.floor(Math.random() * 6)) * 2);
//user.name = 'xuluu' + user.id + 'abc';
user.name = "Antoine";
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

async function loginTestUser()                      //Fonction asynchrone, elle s'execute en parallele et peut se terminer plus tard, pour utilisé son contenu il faut utilisé "await"
{
    const test_user = {
        username: client.inforUser.name,
        password: "abcd*1234"
    };
    console.log("Starting loginTestUser");
    console.log(test_user);
        const r = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {     //adresse ip:port/ path du backend pour enregistrer un utilisateur
            method: "POST",                                                       //Type de méthode utilisé pour le fetch
            body: JSON.stringify(test_user),                                       //Convertie une string en .JSON
            headers: {                                                            //Informations sur le contenu envoyé
                "Accept": "application/json",
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response =>  {
            console.log("status =" + response.status);
            console.log(JSON.stringify(test_user));
            if (response.status >= 200 && response.status < 300)
            {
                console.log("login success");
            }
            else if (response.status === 400)
            {
                console.log("error");
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            console.log("On affiche le contenu qui est convertie depuis un JSON grace a response.json(): " + JSON.stringify(data));
            localStorage.setItem("refresh", "refreshvalue");
            localStorage.setItem("token", "tokenvalue");
        })
        .catch(error => {
            console.error("loginTestUser :", error);
        });
}

async function registerTestUser()                      //Fonction asynchrone, elle s'execute en parallele et peut se terminer plus tard, pour utilisé son contenu il faut utilisé "await"
{
    const test_user = {
        username: client.inforUser.name,
        password: "abcd*1234",
        email: user.name + "@example.org"
    };
    console.log("Starting postUser");
        const r = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {     //adresse ip:port/ path du backend pour enregistrer un utilisateur
            method: "POST",                                                       //Type de méthode utilisé pour le fetch
            body: JSON.stringify(test_user),                                       //Convertie une string en .JSON
            headers: {                                                            //Informations sur le contenu envoyé
                "Accept": "application/json",
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response =>  {
            console.log("status =" + response.status);
            console.log(JSON.stringify(test_user));
            if (response.status >= 200 && response.status < 300)
            {
            }
            else if (response.status === 400)
            {
                console.log("already registered");
                return reponse.json();
            }
            return response.json();
        })
        .then(data => {
            console.log("On affiche le contenu qui est convertie depuis un JSON grace a response.json(): " + JSON.stringify(data));
            localStorage.setItem("refresh", "refreshvalue");
            localStorage.setItem("token", "tokenvalue");
        })
        .catch(error => {
            console.error("postUser :", error);
        });
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
        if (receivedData.title === 'announcement')
            receiveAnnouncement(receivedData);
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
        loginTestUser();
        loadChat();
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
    registerTestUser();
    buttonConnection();
}

main()

export {
    client,
    dataToServer,
    userMessages
};
