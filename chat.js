const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
const chatBox = document.getElementById("c-chat-box");
const chatBoxHeaderPlayerName = document.querySelector("#c-chat-box-header h3");
const chatMessagesDiv = document.getElementById("c-chat-messages");
const chatInputContent = document.querySelector("#c-chat-input input");
const sendMessageButton = document.querySelector("#c-chat-input button");
const playersList = document.getElementById("c-players-list");

const players = [
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

const renderPlayerList = () => {
    const playersHTML = players.map((player) => {
        return `<div id="c-list-player-${player.id}" class="c-player" onclick="openChatBox('${player.id}')">
                    <div class="player-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                    <div class="player-name">${player.name}</div>
                </div>`;
    }).join("");
    playersList.innerHTML = playersHTML;
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

const openChatBox = (receivingPlayerId) => {
    const receivingPlayer = players.find((player) => player.id === receivingPlayerId);
    chatBoxHeaderPlayerName.textContent = receivingPlayer.name;
    renderMessages();
    chatBox.classList.remove("hidden");
};

const closeChatBox = () => {
    chatBox.classList.add("hidden");
};

renderPlayerList();

chatBoxCloseButton.addEventListener("click", closeChatBox);
sendMessageButton.addEventListener("click", sendMessage);
chatInputContent.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
