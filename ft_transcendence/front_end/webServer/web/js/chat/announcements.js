import { getCookie } from "../authentication/auth_cookie.js";
import { client, dataToServer, userMessages } from "../client/client.js";
import { renderFriendList } from "./friend-list.js";
import { getListFriends } from "./friend-list.js";

const getListOfFriendInvitationsReceived = async () => {
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
        .catch(error => {
            console.error("getListOfFriendInvitationsReceived: ", error);
        });
}

const removeFriendInvite = (id) => {
    const announcementsDiv = document.getElementById("c-announcements-window");
    document.getElementById(`c-friend-invitation${id}`).remove();
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

const updateFriendInviteStatus = async (id, newStatus) => {
    let f_token = getCookie("token");
    await fetch(`http://127.0.0.1:8000/api/v1/user/friendship/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({"status": newStatus}),
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
    });
    removeFriendInvite(id);
    postNotification({username: sender, content: "friend invite accepted"});
};

const declineFriendInvite = (id, sender) => {
    updateFriendInviteStatus(id, "rejected");
    removeFriendInvite(id);
    postNotification({username: sender, content: "friend invite declined"});
};

const receiveFriendInvite = (id, sender) => {
    const announcementsList = document.getElementById("c-announcements-list");
    announcementsList.insertAdjacentHTML("beforeend", `<div id="c-friend-invitation${id}" class="c-friend-invitation">
    <p>${sender}</p>
    <button name="accept" class="accept">accept</button>
    <button name="decline" class="decline">decline</button>
    </div>`);
    document.getElementById(`c-friend-invitation${id}`).querySelector(".accept").addEventListener("click", () => {acceptFriendInvite(id, sender)});
    document.getElementById(`c-friend-invitation${id}`).querySelector(".decline").addEventListener("click", () => {declineFriendInvite(id, sender)});
};

const closeAnnouncements = () => {
    const announcementsDiv = document.getElementById("c-announcements-window");
    announcementsDiv.classList.add("hidden");
    document.querySelector("#c-announcements-window > .c-close-button").removeEventListener("click", closeAnnouncements);
};

const renderNotifications = async () => {
    let f_token = getCookie("token");
    const listNotifications = await fetch(`http://127.0.0.1:8000/api/v1/notification/list`, {
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
    console.log(listNotifications);
};

const showAnnouncements = () => {
    const announcementsList = document.getElementById("c-announcements-list");
    const announcementsDiv = document.getElementById("c-announcements-window");
    announcementsList.innerHTML = "";
    announcementsDiv.classList.remove("hidden");
    document.querySelector("#c-announcements-window > .c-close-button").addEventListener("click", closeAnnouncements);
    renderNotifications();
    const listOfFriendInvitationsResponse = getListOfFriendInvitationsReceived();
    listOfFriendInvitationsResponse.then(list => {
        console.log(list);
        list.forEach(invitation => {
            if (invitation.status === "pending") {
                receiveFriendInvite(invitation.id, invitation.sender_username);
            }
        })
    });
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
