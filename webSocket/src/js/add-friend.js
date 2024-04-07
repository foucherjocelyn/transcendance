import { client } from "./client";
import { dataToServer } from "./client";
import { renderFriendList } from "./friend-list";

const findNewFriendWindow = document.getElementById("c-find-new-friend-window");
const announcementsDiv = document.getElementById("c-announcements-window");
const addNewFriendButton = document.getElementById("c-add-new-friend-button");

const displayFindNewFriendWindow = () => {
    console.log(client);
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list").innerHTML = "";
    document.querySelector("#c-find-new-friend-window input").value = "";
    findNewFriendWindow.classList.remove("hidden");
};

const sendFriendInvite = (id) => {
    const sendData = new dataToServer('friend invite received', undefined, client.listUser.find(user => user.id == id));
    client.socket.send(JSON.stringify(sendData));
    console.log(sendData);
    findNewFriendWindow.classList.add("hidden");
};

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

const removeFriendInvite = (sender) => {
    document.getElementById(`c-friend-invitation${sender.id}`).remove();
};

const friendInviteHasBeenAccepted = (sender) => {
    client.inforUser.listFriends.push(sender);
    renderFriendList(client.inforUser.listFriends);
    console.log(`${sender.name}${sender.id} accepted your friend invite.`);
};

const friendInviteHasBeenDeclined = (sender) => {
    console.log(`${sender.name}${sender.id} declined your friend invite.`);
};

const acceptFriendInvite = (sender) => {
    console.log("accept");
    client.inforUser.listFriends.push(sender);
    renderFriendList(client.inforUser.listFriends);
    const sendData = new dataToServer('friend invite accepted', undefined, client.listUser.find(user => user.id == sender.id));
    client.socket.send(JSON.stringify(sendData));
    removeFriendInvite(sender);
};

const declineFriendInvite = (sender) => {
    console.log("decline");
    const sendData = new dataToServer('friend invite declined', undefined, client.listUser.find(user => user.id == sender.id));
    client.socket.send(JSON.stringify(sendData));
    removeFriendInvite(sender);
};

const receiveFriendInvite = (sender) => {
    announcementsDiv.innerHTML += `<div id="c-friend-invitation${sender.id}" class="c-friend-invitation">
    <p>${sender.name}${sender.id}</p>
    <button name="accept" class="accept">accept</button>
    <button name="decline" class="decline">decline</button>
    </div>`
    document.getElementById(`c-friend-invitation${sender.id}`).querySelector(".accept").addEventListener("click", () => {acceptFriendInvite(sender)});
    document.getElementById(`c-friend-invitation${sender.id}`).querySelector(".decline").addEventListener("click", () => {declineFriendInvite(sender)});
    console.log(sender);
};

addNewFriendButton.addEventListener("click", displayFindNewFriendWindow);
document.querySelector("#c-find-new-friend-window .search").addEventListener("click", searchFindNewFriendWindow);
document.querySelector("#c-find-new-friend-window .c-close-button").addEventListener("click", () => {
    findNewFriendWindow.classList.add("hidden");
});
document.querySelector("#c-show-announcements-button").addEventListener("click", () => {
    announcementsDiv.classList.remove("hidden");
});
document.querySelector("#c-announcements-window > .c-close-button").addEventListener("click", () => {
    announcementsDiv.classList.add("hidden");
});

export { 
    displayFindNewFriendWindow,
    receiveFriendInvite,
    friendInviteHasBeenAccepted,
    friendInviteHasBeenDeclined,
};
