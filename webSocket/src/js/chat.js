import { client, dataToServer } from "./client";

const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
const chatBox = document.getElementById("c-chat-box");
const chatBoxHeaderFriendName = document.querySelector("#c-chat-box-header h3");
const chatMessagesDiv = document.getElementById("c-chat-messages");
const chatInputContent = document.querySelector("#c-chat-input input");
const sendMessageButton = document.querySelector("#c-chat-input button");

const renderMessages = (receivingFriendId) => {
    console.log(client.inforUser.listMessages);
    console.log(client.inforUser.listMessages.filter(el => el.user.id === receivingFriendId));
    console.log(client.inforUser.listMessages.filter(el => el.user.id === receivingFriendId)[0].listMessages);
    const messages = client.inforUser.listMessages.filter(el => el.user.id === receivingFriendId)[0].listMessages;
    const messagesHTML = messages.map((message) => {
        return `<div class="chat-bubble ${message.type}">${message.content}</div>`;
    }).join("");
    chatMessagesDiv.innerHTML = messagesHTML;
};

const sendMessage = (receivingFriendId) => {
    const messages = client.inforUser.listMessages.filter(el => el.user.id === receivingFriendId)[0].listMessages;
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
    closeChatBox();
    const senderId = receivedData.from.id;
    const messages = client.inforUser.listMessages.filter(el => el.user.id === senderId)[0].listMessages;
    const newMessage = {
        type: "incoming",
        content: receivedData.content,
    }
    messages.push(newMessage);
    renderMessages(senderId);
    openChatBox(senderId);
};

const openChatBox = (receivingFriendId) => {
    const receivingFriend = client.inforUser.listFriends.find((friend) => friend.id === receivingFriendId);
    chatBoxHeaderFriendName.textContent = receivingFriend.name;
    renderMessages(receivingFriendId);
    chatBoxCloseButton.addEventListener("click", closeChatBox);
    sendMessageButton.addEventListener("click", () => {sendMessage(receivingFriendId)});
    chatInputContent.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
    chatBox.classList.remove("hidden");
};

const closeChatBox = () => {
    chatBox.classList.add("hidden");
};


export {
    openChatBox,
    receiveMessage,
};