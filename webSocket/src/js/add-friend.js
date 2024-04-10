import { client } from "./client";
import { dataToServer } from "./client";

const searchFindNewFriendWindow = () => {
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list");
    const regex = /([A-Za-z]+)/g;
    const parsedSearchInput = document.querySelector("#c-find-new-friend-window input").value.match(regex).join("");
    console.log(parsedSearchInput);
    const matchlist = client.listUser.filter((user) => user.name.includes(parsedSearchInput));
    const usersHTML = matchlist.map((user) => {
        return `<div id="c-list-user-#${user.id}" class="c-user">
            <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
            <div class="user-name">${user.name}<span class="user-id">${user.id}</span></div>
            <button id="c-send-friend-invite-#${user.id}" class="c-send-friend-invite">+</button>
            </div>`;
    }).join("");
    userListDiv.innerHTML = usersHTML;
    document.querySelectorAll(".c-send-friend-invite").forEach((user) => {
        const userId = user.id.substring(user.id.indexOf('#') + 1);
        user.addEventListener("click", (e) => sendFriendInvite(userId));
    });
};

const closeFindNewFriendWindow = () => {
    const findNewFriendWindow = document.getElementById("c-find-new-friend-window");
    findNewFriendWindow.classList.add("hidden");
    document.querySelector("#c-find-new-friend-window .search").removeEventListener("click", searchFindNewFriendWindow);
    document.querySelector("#c-find-new-friend-window .c-close-button").removeEventListener("click", closeFindNewFriendWindow);
};

const displayFindNewFriendWindow = () => {
    const findNewFriendWindow = document.getElementById("c-find-new-friend-window");
    console.log(client);
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list").innerHTML = "";
    document.querySelector("#c-find-new-friend-window input").value = "";
    findNewFriendWindow.classList.remove("hidden");
    document.querySelector("#c-find-new-friend-window .search").addEventListener("click", searchFindNewFriendWindow);
    document.querySelector("#c-find-new-friend-window .c-close-button").addEventListener("click", closeFindNewFriendWindow);
};

const sendFriendInvite = (id) => {
    const findNewFriendWindow = document.getElementById("c-find-new-friend-window");
    const sendData = new dataToServer("announcement", 'friend invite received', client.listUser.find(user => user.id == id));
    client.socket.send(JSON.stringify(sendData));
    console.log(sendData);
    findNewFriendWindow.classList.add("hidden");
};

export { 
    displayFindNewFriendWindow,
};
