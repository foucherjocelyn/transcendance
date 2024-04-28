import { client, dataToServer } from "../client/client.js";
import { getCookie } from "../authentication/auth_cookie.js";

const postMessage = async (message) => {
    console.log("postMessage");
    let f_token = getCookie("token");
    await fetch("http://127.0.0.1:8000/api/v1/user/friend/message", {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("postMessage: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error postMessage: ", error);
        });
    console.log("----");
};


const renderMessages = async (friendId) => {

    let f_token = getCookie("token");
    const messagesSent = await fetch(`http://127.0.0.1:8000/api/v1/user/friend/${friendId}/message/sent`, {
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
    const messagesReceived = await fetch(`http://127.0.0.1:8000/api/v1/user/friend/${friendId}/message/received`, {
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
        const messageHTML = `<div class="chat-bubble ${type}">${message.content}</div>`;
        chatMessagesDiv.innerHTML += messageHTML;
    });

};

const sendMessage = (friendId, friendUsername) => {
    const chatInputContent = document.querySelector("#c-chat-input input");
    if (chatInputContent.value === '')
        return;
    const newMessage = {
        type: "outgoing",
        content: chatInputContent.value
    }
    /*const messages = client.inforUser.listChat.filter(el => el.user.name === friendUsername)[0].listMessages;
    messages.push(newMessage);
    renderMessages(friendUsername);
    chatInputContent.value = '';
    const sendData = new dataToServer('message', newMessage.content, client.listUser.find(user => user.name == friendUsername));
    client.socket.send(JSON.stringify(sendData));*/
    postMessage({username: friendUsername, content: newMessage.content});
    chatInputContent.value = "";
    renderMessages(friendId);
};

const receiveMessage = (receivedData) => {
    console.log(client);
    closeChatBox();
    const senderId = receivedData.from.id;
    const messages = client.inforUser.listChat.filter(el => el.user.id === senderId)[0].listMessages;
    const newMessage = {
        type: "incoming",
        content: receivedData.content,
    }
    messages.push(newMessage);
};

const openChatBox = (friendId, friendUsername) => {
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
        <input name="message" type="text" placeholder="Type your message...">
        <button>Send</button>
        </div>
        </div>
        `;
    const sendMessageButton = document.querySelector("#c-chat-input button");
    const chatInputContent = document.querySelector("#c-chat-input input");
    const chatBoxHeaderFriendName = document.querySelector("#c-chat-box-header h3");
    const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
    chatBoxHeaderFriendName.textContent = friendUsername;
    renderMessages(friendId);
    chatBoxCloseButton.addEventListener("click", closeChatBox);
    sendMessageButton.addEventListener("click", () => { sendMessage(friendId, friendUsername) });
    chatInputContent.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage(friendUsername);
        }
    });
    chatBox.classList.remove("hidden");
};

const closeChatBox = () => {
    const chatBox = document.getElementById("c-chat-box");
    chatBox.classList.add("hidden");
    chatBox.innerHTML = "";
};

export {
    openChatBox,
    receiveMessage,
};
