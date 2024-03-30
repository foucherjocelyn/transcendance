const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
const chatBox = document.getElementById("c-chat-box");
const chatBoxHeaderUserName = document.querySelector("#c-chat-box-header h3");
const chatMessagesDiv = document.getElementById("c-chat-messages");
const chatInputContent = document.querySelector("#c-chat-input input");
const sendMessageButton = document.querySelector("#c-chat-input button");
const friendsList = document.getElementById("c-friends-list");

const friends = [
    {
        id: "#1234",
        name: "Jack"
    },
    {
        id: "#1564",
        name: "Joe"
    }
];

const messages = [
    {
        type: "incoming",
        content: "Hello!"
    }
];

const renderUserList = () => {
    const friendsHTML = friends.map((user) => {
        return `<div id="c-list-user-${user.id}" class="c-user" onclick="openChatBox('${user.id}')">
                    <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                    <div class="user-name">${user.name}</div>
                </div>`;
    }).join("");
    friendsList.innerHTML = friendsHTML;
};

const renderMessages = () => {
    const messagesHTML = messages.map((message) => {
        return `<div class="chat-bubble ${message.type}">${message.content}</div>`;
    }).join("");
    chatMessagesDiv.innerHTML = messagesHTML;
};

const sendMessage = () => {
    const newMessage = {
        type: "outgoing",
        content: chatInputContent.value
    }
    console.log(newMessage);
    messages.push(newMessage);
    renderMessages();
    chatInputContent.value = '';
};

const openChatBox = (receivingUserId) => {
    const receivingUser = friends.find((user) => user.id === receivingUserId);
    chatBoxHeaderUserName.textContent = receivingUser.name;
    renderMessages();
    chatBox.classList.remove("hidden");
};

const closeChatBox = () => {
    chatBox.classList.add("hidden");
};

renderUserList();

chatBoxCloseButton.addEventListener("click", closeChatBox);
sendMessageButton.addEventListener("click", sendMessage);
chatInputContent.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
