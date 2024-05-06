import { getCookie } from "../authentication/auth_cookie.js";
import { client, dataToServer, userMessages } from "../client/client.js";
import { renderFriendList } from "./friend-list.js";
import { getListFriends } from "./friend-list.js";

const getListFriendInvitationsReceived = async () => {
    let f_token = getCookie("token");
    return await fetch("http://127.0.0.1:8000/api/v1/user/friendship/received", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getListOfFriendInvitationsReceived: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("getListOfFriendInvitationsReceived: ", error);
        });
}

const removeFriendInvite = (id) => {
    const notificationsDiv = document.getElementById("c-notifications-window");
    document.getElementById(`c-friend-invitation${id}`).remove();
    document.querySelector("#c-notifications-window > .c-close-button").addEventListener("click", () => {
        notificationsDiv.classList.add("hidden");
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

const updateFriendInviteStatus = async (id, newStatus) => {
    let f_token = getCookie("token");
    await fetch(`http://127.0.0.1:8000/api/v1/user/friendship/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ "status": newStatus }),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("updateFriendInviteStatus: Client/Server error");
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error updateFriendInviteStatus: ", error);
        });
}

const postNotification = async (notification) => {
    let f_token = getCookie("token");
    console.log(notification);
    await fetch("http://127.0.0.1:8000/api/v1/notification/create", {
        method: "POST",
        body: JSON.stringify(notification),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("postNotification: Client/Server error");
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error postNotification: ", error);
        });
    console.log("----");
}

const acceptFriendInvite = (id, sender) => {
    console.log("accept");
    updateFriendInviteStatus(id, "accepted");
    const listFriends = getListFriends();
    listFriends.then(list => {
        renderFriendList(list);
        client.inforUser.listFriends = list;
    });
    removeFriendInvite(id);
    postNotification({ username: sender, content: `${client.inforUser.name} accepted friend invite` });
};

const declineFriendInvite = (id, sender) => {
    updateFriendInviteStatus(id, "rejected");
    removeFriendInvite(id);
    postNotification({ username: sender, content: `${client.inforUser.name} declined friend invite` });
};

const receiveFriendInvite = (id, sender) => {
    const notificationsList = document.getElementById("c-notifications-list");
    notificationsList.insertAdjacentHTML("beforeend", `<div id="c-friend-invitation${id}" class="notification c-friend-invitation">
    <p>${sender}</p>
    <button name="accept" class="accept">accept</button>
    <button name="decline" class="decline">decline</button>
    </div>`);
    document.getElementById(`c-friend-invitation${id}`).querySelector(".accept").addEventListener("click", () => { acceptFriendInvite(id, sender) });
    document.getElementById(`c-friend-invitation${id}`).querySelector(".decline").addEventListener("click", () => { declineFriendInvite(id, sender) });
};

const closeNotifications = () => {
    const notificationsDiv = document.getElementById("c-notifications-window");
    notificationsDiv.classList.add("hidden");
    document.querySelector("#c-notifications-window > .c-close-button").removeEventListener("click", closeNotifications);
};

const markNotificationAsRead = async (notificationId) => {
    let f_token = getCookie("token");
    await fetch(`http://127.0.0.1:8000/api/v1/notification/${notificationId}/read`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("postNotification: Client/Server error");
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            renderNotifications();
        })
        .catch(error => {
            console.error("Error postNotification: ", error);
        });
};

const getListNotifications = async () => {
    let f_token = getCookie("token");
    return await fetch(`http://127.0.0.1:8000/api/v1/notification/list`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getNotifications: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error("getNotifications : ", error);
        });

}

const renderNotifications = async () => {
    const notificationsList = document.getElementById("c-notifications-list");
    notificationsList.innerHTML = "";
    const listNotifications = await getListNotifications();
    const notificationsListElem = document.getElementById("c-notifications-list");
    const listUnreadNotifications = listNotifications.filter(notification => !notification.isRead);
    listUnreadNotifications.forEach(notification => {
        notificationsListElem.insertAdjacentHTML("beforeend", `<div id="notification-${notification.id}" class="notification">
                    <p class="notification-content">${notification.content}</p>
                <div>
                    <button name="close" class="close">&times</button>
                <div>
            </div>`);
        const notificationElem = document.getElementById(`notification-${notification.id}`);
        notificationElem.querySelector(".close").addEventListener("click", () => {
            markNotificationAsRead(notification.id);
        });
    })
    const listOfFriendInvitations = await getListFriendInvitationsReceived();
    console.log(listOfFriendInvitations);
    listOfFriendInvitations.forEach(invitation => {
        if (invitation.status === "pending") {
            receiveFriendInvite(invitation.id, invitation.sender_username);
        }
    });
};

const showNotifications = async () => {
    const notificationsDiv = document.getElementById("c-notifications-window");
    notificationsDiv.classList.remove("hidden");
    document.querySelector("#c-notifications-window > .c-close-button").addEventListener("click", closeNotifications);
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

export { showNotifications, receiveNotification, getListFriendInvitationsReceived };
