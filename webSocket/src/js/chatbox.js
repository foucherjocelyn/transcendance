import { client, dataToServer } from "./client";

const renderMessages = (receivingFriendId) => {
    const chatMessagesDiv = document.getElementById("c-chat-messages");
    const messages = client.inforUser.listChat.filter(el => el.user.id === receivingFriendId)[0].listMessages;
    const messagesHTML = messages.map((message) => {
        return `<div class="chat-bubble ${message.type}">${message.content}</div>`;
    }).join("");
    chatMessagesDiv.innerHTML = messagesHTML;
};

const sendMessage = (receivingFriendId) => {
    const chatInputContent = document.querySelector("#c-chat-input input");
    console.log(client);
    const messages = client.inforUser.listChat.filter(el => el.user.id === receivingFriendId)[0].listMessages;
    const newMessage = {
        type: "outgoing",
        content: chatInputContent.value
    }
    messages.push(newMessage);
    renderMessages(receivingFriendId);
    chatInputContent.value = '';
    const sendData = new dataToServer('message', newMessage.content, client.listUser.find(user => user.id == receivingFriendId));
    client.socket.send(JSON.stringify(sendData));
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

const openChatBox = (receivingFriendId) => {
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
    const receivingFriend = client.inforUser.listFriends.find((friend) => friend.id === receivingFriendId);
    chatBoxHeaderFriendName.textContent = receivingFriend.name;
    renderMessages(receivingFriendId);
    chatBoxCloseButton.addEventListener("click", closeChatBox);
    sendMessageButton.addEventListener("click", () => { sendMessage(receivingFriendId) });
    chatInputContent.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage(receivingFriendId);
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