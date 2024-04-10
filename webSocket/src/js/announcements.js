import { client, dataToServer, userMessages } from "./client";
import { renderFriendList } from "./friend-list";

const removeFriendInvite = (sender) => {
    const announcementsDiv = document.getElementById("c-announcements-window");
    document.getElementById(`c-friend-invitation${sender.id}`).remove();
    document.querySelector("#c-announcements-window > .c-close-button").addEventListener("click", () => {
        announcementsDiv.classList.add("hidden");
    });
};

const friendInviteHasBeenAccepted = (sender) => {
    client.inforUser.listFriends.push(sender);
    const newUserMessages = new userMessages();
    newUserMessages.user = sender;
    client.inforUser.listChat.push(newUserMessages);
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
    const newUserMessages = new userMessages();
    newUserMessages.user = sender;
    client.inforUser.listChat.push(newUserMessages);
    const sendData = new dataToServer("announcement", 'friend invite accepted', client.listUser.find(user => user.id == sender.id));
    client.socket.send(JSON.stringify(sendData));
    removeFriendInvite(sender);
};

const declineFriendInvite = (sender) => {
    console.log("decline");
    const sendData = new dataToServer("announcement", 'friend invite declined', client.listUser.find(user => user.id == sender.id));
    client.socket.send(JSON.stringify(sendData));
    removeFriendInvite(sender);
};

const receiveFriendInvite = (sender) => {
    const announcementsDiv = document.getElementById("c-announcements-window");
    announcementsDiv.innerHTML += `<div id="c-friend-invitation${sender.id}" class="c-friend-invitation">
    <p>${sender.name}${sender.id}</p>
    <button name="accept" class="accept">accept</button>
    <button name="decline" class="decline">decline</button>
    </div>`
    document.getElementById(`c-friend-invitation${sender.id}`).querySelector(".accept").addEventListener("click", () => {acceptFriendInvite(sender)});
    document.getElementById(`c-friend-invitation${sender.id}`).querySelector(".decline").addEventListener("click", () => {declineFriendInvite(sender)});
    console.log(sender);
};

const closeAnnouncements = () => {
    const announcementsDiv = document.getElementById("c-announcements-window");
    announcementsDiv.classList.add("hidden");
    document.querySelector("#c-announcements-window > .c-close-button").removeEventListener("click", closeAnnouncements);
};

const showAnnouncements = () => {
    const announcementsDiv = document.getElementById("c-announcements-window");
    announcementsDiv.classList.remove("hidden");
    document.querySelector("#c-announcements-window > .c-close-button").addEventListener("click", closeAnnouncements);
};

const receiveAnnouncement = (receivedData) => {
    switch (receivedData.content) {
        case "friend invite received":
            receiveFriendInvite(receivedData.from);
            break;
        case "friend invite accepted":
            friendInviteHasBeenAccepted(receivedData.from);
            break;
        case "friend invite declined":
            friendInviteHasBeenDeclined(receivedData.from);
        default:
            console.log("Error: Invalid announcement : ", receivedData.content);
    }
};

export { showAnnouncements, receiveAnnouncement };