import { client } from "./client";
import { dataToServer } from "./client";

const addNewFriendButton = document.getElementById("c-add-new-friend-button");
const findNewFriendWindow = document.getElementById("c-find-new-friend-window");

const users = [
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
    },
    {
        id: "#1664",
        name: "Zoe"
    },
    {
        id: "#1598",
        name: "Clara"
    },
    {
        id: "#1978",
        name: "Enzo"
    },
    {
        id: "#4664",
        name: "Theo"
    },
    {
        id: "#3984",
        name: "Paul"
    },
    {
        id: "#1976",
        name: "Adrien"
    },
];

const displayFindNewFriendWindow = () => {
    console.log(client);
    const sendData = new dataToServer('message', client.inforUser, client.listUser[3]);
    client.socket.send(JSON.stringify(sendData));
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list").innerHTML = "";
    document.querySelector("#c-find-new-friend-window input").value = "";
    findNewFriendWindow.classList.remove("hidden");
};

const searchFindNewFriendWindow = () => {
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list");
    const regex = /([A-Za-z]+)/g;
    const parsedSearchInput = document.querySelector("#c-find-new-friend-window input").value.match(regex).join("");
    console.log(parsedSearchInput);
    const matchlist = users.filter((user) => user.name.includes(parsedSearchInput));
    const usersHTML = matchlist.map((user) => {
        return `<div id="c-list-user-${user.id}" class="c-user")">
                    <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                    <div class="user-name">${user.name}<span class="user-id">${user.id}</span></div>
                </div>`;
    }).join("");
    userListDiv.innerHTML = usersHTML;
};

document.querySelector("#c-find-new-friend-window .search").addEventListener("click", searchFindNewFriendWindow);
document.querySelector("#c-find-new-friend-window .c-close-button").addEventListener("click", () => {
    findNewFriendWindow.classList.add("hidden");
});
addNewFriendButton.addEventListener("click", displayFindNewFriendWindow);