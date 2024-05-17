const { send_data } = require("./dataToClient");
const { webSocket } = require("./webSocket");

function define_user_from_socket(socket)
{
    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.socket === socket)
            return connection.user;
    }
    return undefined;
}

function reponse_invitation_to_play_ws(socket)
{
    const   user = define_user_from_socket(socket);
    webSocket.listConnection.forEach(connection => {
        if (connection.socket === socket)
        {
            connection.listSenderInvitationPlay.forEach((sender, index) => {
                if (sender.status === 'creating match')
                    send_data('reponse invitation to play', user, user, sender);
            })
        }
    })
    webSocket.listSenderInvitationPlay = [];
}

function    request_invitation_to_play(data)
{
    webSocket.listConnection.forEach(connection => {
        if (connection.user.id === data.to.id)
            connection.listSenderInvitationPlay.push(data.from);
    })
    send_data(data.title, data.content, data.from, data.to);
}

module.exports = {
    request_invitation_to_play,
    reponse_invitation_to_play_ws,
    define_user_from_socket
};
