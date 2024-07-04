const { webSocket, define_user_by_ID } = require("./webSocket");
const { leave_match } = require("../match/acceptInvitationPlay");
const { define_socket_by_user, send_data } = require("./dataToClient");
const { isNumeric } = require("../gameSettings/checkInputSize");
const { create_request } = require("../dataToDB/createRequest");

class   connection {
    constructor(user, socket) {
        this.user = user,
        this.socket = socket
    }
};

function  update_list_friends(sender, recipient)
{
    send_data('update list friends', '', sender, recipient);
    // console.log('---> send to: ' + recipient.username);
}

async function    connect(userID, socket)
{
    if (userID === undefined || !isNumeric(userID)) {
        return ;
    }

    await create_request('POST', `/api/v1/users/${userID}/status/update`, { status: 'online' });
    const   inforUser = await create_request('GET', `/api/v1/users/${userID}`, '');
    if (inforUser.id === undefined) {
        return ;
    }

    // check same user
    inforUser.avatarPath = `img/${inforUser.avatarPath}`;
    const   checkConnection = define_user_by_ID(userID);
    if (checkConnection !== undefined)
    {
        // const   oldSocket = define_socket_by_user(inforUser);
        // if (oldSocket === undefined) {
        //     return ;
        // }
        // disconnect(oldSocket);
        return ;
    }

    const   user = new connection(inforUser, socket);
    webSocket.listConnection.push(user);
    webSocket.listUser.push(inforUser);
    
    send_data('update infor user', inforUser, 'server', inforUser);
    send_data('update list connection', webSocket.listUser, 'server', webSocket.listUser);

    // console.log('-------> get list friends of: ' + inforUser.username);
    // send sign update status list friends
    const   listFriends = await create_request('GET', '/api/v1/user/friendship', { user: inforUser.username });
    listFriends.forEach(friend => {
        update_list_friends('server', friend);
    })
}

async function    disconnect(socket)
{
    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.socket === socket)
        {
            const   user = connection.user;
            if ((user !== undefined) && (user.status === 'creating match' || user.status === 'playing game')) {
                leave_match(user);
            }

            webSocket.listConnection.splice(i, 1);
            webSocket.listUser.splice(i, 1);
            send_data('update list connection', webSocket.listUser, 'server', webSocket.listUser);
            await create_request('POST', `/api/v1/users/${user.id}/status/update`, { status: 'offline' });
            
            // send sign update status list friends
            const   listFriends = await create_request('GET', '/api/v1/user/friendship', { user: user.username });
            listFriends.forEach(friend => {
                update_list_friends('server', friend);
            })
            return ;
        }
    }
}

module.exports = {
    connect,
    disconnect,
    update_list_friends
};
