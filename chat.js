const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
const chatBox = document.getElementById("c-chat-box");
const chatBoxHeaderPlayerName = document.querySelector("#c-chat-box-header h3");

const players = [
    {
        id: "PlayerA#1234",
        name: "PlayerA"
    },
    {
        id: "PlayerB#1564",
        name: "PlayerB"
    }
];

const openChatBox = (receivingPlayerId) => {
    chatBox.classList.add("hidden");
    const receivingPlayer = players.find((player) => player.id === receivingPlayerId);
    console.log(receivingPlayer);
    chatBoxHeaderPlayerName.textContent = receivingPlayer.name;
    chatBox.classList.remove("hidden");
};

const closeChatBox = () => {
    chatBox.classList.add("hidden");
};

chatBoxCloseButton.addEventListener("click", closeChatBox);
