import { getListFriendInvitationsReceived, updateFriendInviteStatus } from "../backend_operation/friend_invite.js";
import { getListNotifications, markNotificationAsRead, postNotification } from "../backend_operation/notification.js";
import { client, userMessages } from "../client/client.js";
import { searchFriendList } from "./friend-list.js";
import { getListFriends } from "./friend-list.js";

const renderNotificationCount = async (count = 0) => {
    const notificationCountElem = document.getElementById("c-notification-count");
    if (notificationCountElem) {
        if (count === 0) {
            notificationCountElem.classList.add("hidden");
        } else {
            notificationCountElem.innerText = count;
            notificationCountElem.classList.remove("hidden");
        }
    }
}

const removeFriendInvite = (id) => {
    const notificationsDiv = document.getElementById("c-notifications-window");
    document.getElementById(`c-friend-invitation${id}`).remove();
    document.querySelector("#c-notifications-window > .c-close-button").addEventListener("click", () => {
        notificationsDiv.classList.add("hidden");
    });
    renderNotifications();
};

const friendInviteHasBeenAccepted = (sender) => {
    client.inforUser.listFriends.push(sender);
    const newUserMessages = new userMessages();
    newUserMessages.user = sender;
    client.inforUser.listChat.push(newUserMessages);
    //renderFriendList(client.inforUser.listFriends);
    searchFriendList();
    console.log(`${sender.username}${sender.id} accepted your friend invite.`);
};

const friendInviteHasBeenDeclined = (sender) => {
    console.log(`${sender.username}${sender.id} declined your friend invite.`);
};

const acceptFriendInvite = async (id, sender) => {
    await updateFriendInviteStatus(id, "accepted");
    // const listFriends = getListFriends();
    // listFriends.then(list => {
    //     renderFriendList(list);
    //     client.inforUser.listFriends = list;
    // });
    searchFriendList();
    removeFriendInvite(id);
    postNotification({ username: sender, content: `${client.inforUser.username} accepted friend invite` });
};

const declineFriendInvite = (id, sender) => {
    updateFriendInviteStatus(id, "rejected");
    removeFriendInvite(id);
    postNotification({ username: sender, content: `${client.inforUser.username} declined friend invite` });
};

const receiveFriendInvite = (id, sender) => {
    const notificationsList = document.getElementById("c-notifications-list");
    notificationsList.insertAdjacentHTML("beforeend", `<div id="c-friend-invitation${id}" class="notification c-friend-invitation">
    <p>${sender}</p>
        <div>
            <button name="accept" class="button-img button-accept">accept</button>
            <button name="decline" class="button-img button-decline">decline</button>
        </div>
    </div>`);
    document.getElementById(`c-friend-invitation${id}`).querySelector(".button-accept").addEventListener("click", () => { acceptFriendInvite(id, sender) });
    document.getElementById(`c-friend-invitation${id}`).querySelector(".button-decline").addEventListener("click", () => { declineFriendInvite(id, sender) });
};

const closeNotificationWindow = () => {
    const notificationsDiv = document.getElementById("c-notifications-window");
    notificationsDiv.classList.add("hidden");
    document.querySelector("#c-notifications-window > .c-close-button").removeEventListener("click", closeNotificationWindow);
};

const renderNotifications = async () => {
    const listNotifications = await getListNotifications();
    const notificationsList = document.getElementById("c-notifications-list");
    const listUnreadNotifications = listNotifications.filter(notification => !notification.isRead);
    const listOfFriendInvitations = await getListFriendInvitationsReceived();
    const listOfPendingFriendInvitations = listOfFriendInvitations.filter(invitation => invitation.status === "pending");

    const notificationCount = listUnreadNotifications.length + listOfPendingFriendInvitations.length;
    renderNotificationCount(notificationCount);
    if (!notificationsList)
        return ;
    notificationsList.innerHTML = "";
    listUnreadNotifications.forEach(notification => {
        notificationsList.insertAdjacentHTML("beforeend", `<div id="notification-${notification.id}" class="notification">
                    <p class="notification-content">${notification.content}</p>
                <div>
                    <button name="close" class="close">&times</button>
                <div>
            </div>`);
        const notificationElem = document.getElementById(`notification-${notification.id}`);
        notificationElem.querySelector(".close").addEventListener("click", () => {
            const r = markNotificationAsRead(notification.id);
            r.then(() => {
                renderNotifications();
            });
        });
    })
    listOfPendingFriendInvitations.forEach(invitation => {
        receiveFriendInvite(invitation.id, invitation.sender_username);
    });
};

const showNotifications = async () => {
    const notificationsDiv = document.getElementById("c-notifications-window");
    notificationsDiv.classList.remove("hidden");
    document.querySelector("#c-notifications-window > .c-close-button").addEventListener("click", closeNotificationWindow);
    renderNotifications();
};

const receiveNotification = (receivedData) => {
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
            console.log("Error: Invalid notification : ", receivedData.content);
    }
};

export { showNotifications, receiveNotification, renderNotifications };
