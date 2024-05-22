import { client, dataToServer } from "../client/client.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { postNewMessage } from "../backend_operation/messages.js";

const renderMessages = async (friendUsername) => {
    let f_token = getCookie("token");

    const friendIdObject = await fetch(`https://localhost/api/v1/users/id/${friendUsername}`, {
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
    const messagesSent = await fetch(`https://localhost/api/v1/user/friend/${friendId}/message/sent`, {
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
    const messagesReceived = await fetch(`https://localhost/api/v1/user/friend/${friendId}/message/received`, {
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
    await postNewMessage({username: friendUsername, content: newMessage.content});
    renderMessages(friendUsername);

    const connectedReceiver = client.listUser.find(user => user.username == friendUsername)
    if (connectedReceiver) {
        const sendData = new dataToServer('message', newMessage.content, client.inforUser, connectedReceiver);
        client.socket.send(JSON.stringify(sendData));
    }
};

const receiveMessage = (receivedData) => {
    console.log(client);
    const senderName = receivedData.from.username;
    const chattingWith = getCookie("chatboxOpenedWith");
    console.log("receiveing message");
    console.log(chattingWith);
    if (chattingWith === senderName) {
        renderMessages(senderName);
    }
    /*    const messages = client.inforUser.listChat.filter(el => el.user.id === senderId)[0].listMessages;
    const newMessage = {
        type: "incoming",
        content: receivedData.content,
    }
    messages.push(newMessage);*/
};

const openChatBox = (friendUsername) => {
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
    document.cookie = `chatboxOpenedWith=${friendUsername}; SameSite=Strict`;
    renderMessages(friendUsername);
    chatBoxCloseButton.addEventListener("click", closeChatBox);
    sendMessageButton.addEventListener("click", () => { sendMessage(friendUsername) });
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
    document.cookie = `chatboxOpenedWith=; SameSite=Strict`;
};

export {
    openChatBox,
    receiveMessage,
};
