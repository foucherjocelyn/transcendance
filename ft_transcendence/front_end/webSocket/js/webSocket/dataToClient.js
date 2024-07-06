const { isNumeric } = require("../gameSettings/checkInputSize");
const { webSocket } = require("./webSocket");

class   dataToClient {
    constructor(t, c, f) {
        this.title = t,
        this.content = c,
        this.from = f
    }
};

function    define_socket_by_user(user)
{
    if (user === undefined || !isNumeric(user.id)) {
        return undefined;
    }

    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.user !== undefined && connection.user.id === user.id)
            return connection.socket;
    }
    return undefined;
}

function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return undefined;
            }
            seen.add(value);
        }
        return value;
    };
}

function    send_data(title, content, from, to)
{
    let   sendData = new dataToClient(title, content, from);
    //console.log("PROBLEM HERE--------------------------------------------------------");
    //console.log("title =" + title);
    //console.log(sendData);
    // sendData = (title === 'update paddles') ?
    // JSON.stringify(sendData, getCircularReplacer()) :
    // JSON.stringify(sendData);

    if (title === "update paddles" || title === "draw score")
        sendData = JSON.stringify(sendData, getCircularReplacer());
    else
        sendData = JSON.stringify(sendData);

    // flatted.stringify(sendData, getCircularReplacer()) :
    // flatted.stringify(sendData);

    
    let destinations = Array.isArray(to) ? to : [to];
    destinations.forEach(user => {
        const socket = define_socket_by_user(user);
        if (socket !== undefined) {
            // socket.sendUTF(sendData);
            socket.send(sendData);
        } else {
            if (title === 'notification' || title === 'message') {
                console.log('connect with database');
            }
        }
    });
}

// function getCircularReplacer() {
//     const seen = new WeakSet();
//     return (key, value) => {
//         if (typeof value === "object" && value !== null) {
//             if (seen.has(value)) {
//                 return undefined; // Handle circular reference
//             }
//             seen.add(value);
//         }
//         return value;
//     };
// }

// function send_data(title, content, from, to) {
//     let sendData = new dataToClient(title, content, from);

//     // Serialize sendData with circular reference handling
//     let serializedData = JSON.stringify(sendData, getCircularReplacer());

//     let destinations = Array.isArray(to) ? to : [to];
//     destinations.forEach(user => {
//         const socket = define_socket_by_user(user);
//         if (socket !== undefined) {
//             socket.send(serializedData);
//         } else {
//             // Handle case when socket is undefined if needed
//             // For example, connect with a database for notifications/messages
//             // console.log('connect with database');
//         }
//     });
// }


module.exports = {
    send_data,
    dataToClient,
    define_socket_by_user
};
