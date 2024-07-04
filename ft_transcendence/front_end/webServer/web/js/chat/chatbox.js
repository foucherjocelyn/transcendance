import { client, dataToServer } from "../client/client.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { postMuteUser, postNewMessage, postUnmuteUser } from "../backend_operation/messages.js";
import { getListMutedUsers } from "../backend_operation/get_user_info.js";
import { postNotification } from "../backend_operation/notification.js";
import { domain_name } from "../backend_operation/authentication.js";
import { notice } from "../authentication/auth_main.js";

const renderMessages = async (friendUsername) => {
    let f_token = getCookie("token");

    const friendIdObject = await fetch(`https://${domain_name}:8000/api/v1/users/id/${friendUsername}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getUserId: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error("getUserId : ", error);
        });
    const friendId = friendIdObject.user_id.toString();
    const messagesSent = await fetch(`https://${domain_name}:8000/api/v1/user/friend/${friendId}/message/sent`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("renderMessages : Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error("renderMessages : ", error);
        });
    const messagesReceived = await fetch(`https://${domain_name}:8000/api/v1/user/friend/${friendId}/message/received`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("renderMessages : Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error("renderMessages : ", error);
        });

    const messages = messagesSent.concat(messagesReceived);
    const messagesSortedByDate = messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const chatMessagesDiv = document.getElementById("c-chat-messages");
    const myUsername = getCookie("username");
    chatMessagesDiv.innerHTML = '';
    messagesSortedByDate.forEach(message => {
        const type = message.sender_username === myUsername ? "outgoing" : "incoming";
        const messageHTML = document.createElement("div");
        messageHTML.classList.add("chat-bubble", type);
        messageHTML.innerText = message.content;
        chatMessagesDiv.appendChild(messageHTML);
        //const messageHTML = `<div class="chat-bubble ${type}">${message.content}</div>`;
        //chatMessagesDiv.innerHTML += messageHTML;
    });
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;

};

const sendMessage = async (friendUsername) => {
    const chatInputContent = document.querySelector("#c-chat-input input");
    if (chatInputContent.value === '')
        return;
    const newMessage = {
        type: "outgoing",
        content: chatInputContent.value
    }
    chatInputContent.value = "";
    await postNewMessage({ username: friendUsername, content: newMessage.content });
    renderMessages(friendUsername);

    const connectedReceiver = client.listUser.find(user => user.username == friendUsername)
    if (connectedReceiver) {
        const sendData = new dataToServer('message', newMessage.content, connectedReceiver);
        client.socket.send(JSON.stringify(sendData));
    }
    postNotification({ username: friendUsername, content: `New message from ${client.inforUser.username}` });
    const sendData = new dataToServer('notification', '', client.listUser.find(user => user.username === friendUsername));
    client.socket.send(JSON.stringify(sendData));
};

const receiveMessage = (receivedData) => {
    const senderName = receivedData.from.username;
    const chattingWith = getCookie("chatboxOpenedWith");
    if (chattingWith === senderName) {
        renderMessages(senderName);
    }
};

const renderUnmuteButton = (username) => {
    document.getElementById("c-chat-box-header").insertAdjacentHTML('afterbegin', `<button id="c-unmute-button-${username}" class="c-unmute-button"></button>`);
    document.getElementById(`c-unmute-button-${username}`).addEventListener("click", () => { unmuteUser(username) });
}

const renderMuteButton = (username) => {
    document.getElementById("c-chat-box-header").insertAdjacentHTML('afterbegin', `<button id="c-mute-button-${username}" class="c-mute-button"></button>`);
    document.getElementById(`c-mute-button-${username}`).addEventListener("click", () => { muteUser(username) });
}

const unmuteUser = async (username) => {
    await postUnmuteUser(username);
    await renderChatInput(username);

    const connectedReceiver = client.listUser.find(user => user.username == username)
    if (connectedReceiver) {
        const sendData = new dataToServer('unmute', '', connectedReceiver);
        client.socket.send(JSON.stringify(sendData));
    }
}

const muteUser = async (username) => {
    await postMuteUser(username);
    await renderChatInput(username);

    const connectedReceiver = client.listUser.find(user => user.username == username)
    if (connectedReceiver) {
        const sendData = new dataToServer('mute', '', connectedReceiver);
        client.socket.send(JSON.stringify(sendData));
    }
}

export const renderChatInput = async (friendUsername) => {
    const chattingWith = getCookie("chatboxOpenedWith");
    if (chattingWith !== friendUsername)
        return;
    //display mute/unmute button except when muted by the other user
    //when muted or muting don't display input section of the chat box, but display a message instead
    const listMutedUsers = await getListMutedUsers();
    const amIMuted = listMutedUsers.some(elem => elem.sender_username === friendUsername);
    const amIMuting = listMutedUsers.some(elem => elem.receiver_username === friendUsername);
    document.getElementById(`c-mute-button-${friendUsername}`)?.remove();
    document.getElementById(`c-unmute-button-${friendUsername}`)?.remove();
    if (!amIMuting && !amIMuted) {
        document.getElementById("c-chat-input").innerHTML = `<input id="c-sending-message" name="message" type="text" placeholder="Type your message..." maxlength="512">
        <button>Send</button>`;
        const sendMessageButton = document.querySelector("#c-chat-input button");
        const chatInputContent = document.querySelector("#c-chat-input input");
        sendMessageButton.addEventListener("click", () => {
            if (document.getElementById("c-sending-message").value.length > 512) {
                notice("Sent text cannot exceed 512 characters", 2, "#fc2403");
                return;
            }
            sendMessage(friendUsername);
        });
        chatInputContent.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                sendMessage(friendUsername);
            }
        });
        renderMuteButton(friendUsername);
    } else {
        if (!amIMuted) {
            renderUnmuteButton(friendUsername);
        }
        document.getElementById("c-chat-input").innerHTML = `<p class="c-chat-mute-text">This conversation is currently muted.</p>`
    }
}

const openChatBox = async (friendUsername) => {
    const chatBox = document.getElementById("c-chat-box");
    chatBox.innerHTML = `
        <div id="c-chat-box-header" class="chat-box-header">
        <h3></h3>
        <button id="c-chat-box-close-button" class="c-close-button">&times;</button>
        </div>
        <div class="chat-box-body">
        <div id="c-chat-messages" class="chat-messages">
        </div>
        <div id="c-chat-input" class="chat-input">
        </div>
        </div>
        `;
    const chatBoxHeaderFriendName = document.querySelector("#c-chat-box-header h3");
    const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
    chatBoxHeaderFriendName.textContent = friendUsername;
    document.cookie = `chatboxOpenedWith=${friendUsername}; SameSite=Strict`;

    renderChatInput(friendUsername);
    renderMessages(friendUsername);
    chatBoxCloseButton.addEventListener("click", closeChatBox);
    chatBox.classList.remove("hidden");
};

const closeChatBox = () => {
    const chatBox = document.getElementById("c-chat-box");
    chatBox.classList.add("hidden");
    chatBox.innerHTML = "";
    document.cookie = `chatboxOpenedWith=; SameSite=Strict`;
};

export {
    openChatBox,
    receiveMessage,
};
