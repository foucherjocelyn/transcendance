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

const acceptFriendInvite = (id) => {
    console.log("accept");
    updateFriendInviteStatus(id, "accepted");
    const listFriends = getListFriends();
    listFriends.then(list => {
        renderFriendList(list);
    });
    removeFriendInvite(id);
};

const declineFriendInvite = (id) => {
    updateFriendInviteStatus(id, "rejected");
    removeFriendInvite(id);
};

const receiveFriendInvite = (id, sender) => {
    const announcementsList = document.getElementById("c-announcements-list");
    announcementsList.innerHTML += `<div id="c-friend-invitation${id}" class="c-friend-invitation">
    <p>${sender}</p>
    <button name="accept" class="accept">accept</button>
    <button name="decline" class="decline">decline</button>
    </div>`
    document.getElementById(`c-friend-invitation${id}`).querySelector(".accept").addEventListener("click", () => {acceptFriendInvite(id)});
    document.getElementById(`c-friend-invitation${id}`).querySelector(".decline").addEventListener("click", () => {declineFriendInvite(id)});
};

const closeAnnouncements = () => {
    const announcementsDiv = document.getElementById("c-announcements-window");
    announcementsDiv.classList.add("hidden");
    document.querySelector("#c-announcements-window > .c-close-button").removeEventListener("click", closeAnnouncements);
};

const showAnnouncements = () => {
    const announcementsList = document.getElementById("c-announcements-list");
    const announcementsDiv = document.getElementById("c-announcements-window");
    announcementsList.innerHTML = "";
    announcementsDiv.classList.remove("hidden");
    document.querySelector("#c-announcements-window > .c-close-button").addEventListener("click", closeAnnouncements);
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
