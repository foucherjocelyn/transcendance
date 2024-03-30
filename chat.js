const chatBoxCloseButton = document.getElementById("c-chat-box-close-button");
const chatBox = document.getElementById("c-chat-box");
const chatBoxHeaderUserName = document.querySelector("#c-chat-box-header h3");
const chatMessagesDiv = document.getElementById("c-chat-messages");
const chatInputContent = document.querySelector("#c-chat-input input");
const sendMessageButton = document.querySelector("#c-chat-input button");
const friendsList = document.getElementById("c-friends-list");
const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
const friendsListSearchButton = document.querySelector("#c-search-friend-list button");

const friends = [
    {
        id: "#1234",
        name: "Jack"
    },
    {
        id: "#1254",
        name: "Samantha"
    },
    {
        id: "#1267",
        name: "Arthur"
    },
    {
        id: "#1289",
        name: "Pierre"
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

const renderFriendList = (list = friends) => {
    const friendsHTML = list.map((user) => {
        return `<div id="c-list-user-${user.id}" class="c-user" onclick="openChatBox('${user.id}')">
                    <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                    <div class="user-name">${user.name}</div>
                </div>`;
    }).join("");
    friendsList.innerHTML = friendsHTML;
};

const searchFriendList = () => {
    if (friendsListSearchInput.value === "") {
        renderFriendList();
        return;
    }
    const regex = /([A-Za-z]+)/g;
    const parsedSearchInput = friendsListSearchInput.value.match(regex).join("");
    console.log(parsedSearchInput);
    const matchlist = friends.filter((friend) => friend.name.includes(parsedSearchInput));
    renderFriendList(matchlist);
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

renderFriendList();

friendsListSearchButton.addEventListener("click", searchFriendList);
chatBoxCloseButton.addEventListener("click", closeChatBox);
sendMessageButton.addEventListener("click", sendMessage);
chatInputContent.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
friendsListSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchFriendList();
    }
});
