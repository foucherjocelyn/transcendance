const { log } = require('console');

const   server = {
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
    server.listConnection.forEach(connection => {
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
    server.listConnection.forEach(connection => {
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
    console.log(data.content.id);
    const   user  = new connection(data.content, socket);
    server.listConnection.push(user);
    server.listUser.push(data.content);

    // Change content of package data
    data.content = server.listUser;
    data.destination = server.listUser;

    data_packaging(data, socket);
}

function    delete_old_connection(socket)
{
    let i = 0;

    server.listConnection.forEach(connection => {
        if (connection.socket === socket)
        {
            server.listConnection.splice(i, 1);
            server.listUser.splice(i, 1);
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
    else if (data.title === 'message')
        data_packaging(data, socket);
    else if (data.title === 'game settings')
        data_packaging(data, socket);
    else if (data.title === 'friend invite received')
        data_packaging(data, socket);
    else if (data.title === 'friend invite accepted')
        data_packaging(data, socket);
    else if (data.title === 'friend invite declined')
        data_packaging(data, socket);

    // add your title

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

function setup_server()
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

setup_server();
