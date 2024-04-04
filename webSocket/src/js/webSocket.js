const { log } = require('console');

const   webSocket = {
    listUser: [],
    listConnection: []
};

class   connection {
    constructor(user, socket) {
        this.user = user,
        this.socket = socket
    }
};

class   dataToClient {
    constructor(t, c, f) {
        this.title = t,
        this.content = c,
        this.from = f
    }
};

/* ------------------------------  ------------------------------ */
function    find_socket(id)
{
    let socket = undefined;
    webSocket.listConnection.forEach(connection => {
        if (connection.user.id === id)
            socket = connection.socket;
    })
    return socket;
}

function    send_data(listDestination, data, title)
{
    listDestination.forEach(user => {
        const   socket = find_socket(user.id);
        if (socket !== undefined)
        {
            socket.sendUTF(data);
        }
        else
        {
            if (title === 'notification' || title === 'message')
                console.log(data);
        }
    })
}

function    define_user(socket)
{
    let user = undefined;
    webSocket.listConnection.forEach(connection => {
        if (connection.socket === socket)
            user = connection.user;
    })
    return user;
}

function    data_packaging(data, socket)
{
    const   user = define_user(socket);
    if (user === undefined)
        return ;

    let   sendData = new dataToClient(data.title, data.content, user);
    sendData = JSON.stringify(sendData);
    // console.log('data send: ' + sendData);

    let   listDestination = [];
    if (Array.isArray(data.destination))
        listDestination = data.destination;
    else
        listDestination[0] = data.destination;

    send_data(listDestination, sendData, data.title);
}

/* ------------------------------  ------------------------------ */
function    add_new_connection(data, socket)
{
    const   user  = new connection(data.content, socket);
    webSocket.listConnection.push(user);
    webSocket.listUser.push(data.content);

    // Change content of package data
    data.content = webSocket.listUser;
    data.destination = webSocket.listUser;

    data_packaging(data, socket);
}

function    delete_old_connection(socket)
{
    let i = 0;

    webSocket.listConnection.forEach(connection => {
        if (connection.socket === socket)
        {
            webSocket.listConnection.splice(i, 1);
            webSocket.listUser.splice(i, 1);
        }
        i++;
    })
}

/* ------------------------------  ------------------------------ */
function    get_data(data, socket)
{
    data = JSON.parse(data);

    // read title
    if (data.title === 'connection')
        add_new_connection(data, socket);
    else
        data_packaging(data, socket);
}

/* ------------------------------  ------------------------------ */
function listen_connection(wsServer)
{
    wsServer.on('request', function(request) {
        // Accept connection from client
        const connection = request.accept(null, request.origin);
        
        console.log('Client connected');

        // Handle message from client
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                // console.log(message);
                get_data(message.utf8Data, connection);
            }
        });

        // Handle event when client closes connection
        connection.on('close', function(reasonCode, description) {
            console.log('Client deconnected');
            delete_old_connection(connection);
        });
    });
}

function setup_web_socket_server()
{
    // Import module 'http' and 'websocket' integrated in Node.js
    const http = require('http');
    const websocket = require('websocket');

    // Create HTTP server
    const server = http.createServer(function(request, response) {
        // Handle HTTP request, temporarily not handled here
    });

    // Listen for connection from client and create WebSocket connection
    const wsServer = new websocket.server({
        httpServer: server
    });

    listen_connection(wsServer);

    // Listen on port 4242
    const PORT = 4242;
    server.listen(PORT, function() {
        console.log(`Server is listening on port ${PORT}`);
    });
}

setup_web_socket_server();
