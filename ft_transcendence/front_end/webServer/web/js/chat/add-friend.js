import { client } from "../client/client.js";
import { dataToServer } from "../client/client.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { getListFriends } from "./friend-list.js";
import { getListFriendInvitationsReceived } from "./notifications.js";

async function getListUsers() {
    console.log("--getListUsers starting");
    let f_token = getCookie("token");
    //    console.log(f_token);

    const response = await fetch("http://127.0.0.1:8000/api/v1/users", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getListUsers: Client/Server error");
                return;
            }
            const data = response.json();
            return data;
        })
        .catch(error => {
            console.error("getListUsers: ", error);
        });
    console.log("--");
    return response;
}

async function getListFriendInvitationSent() {
    console.log("--getListFriendInvitationSent starting");
    let f_token = getCookie("token");
    //    console.log(f_token);

    const response = await fetch("http://127.0.0.1:8000/api/v1/user/friendship/sent", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getListFriendInvitationSent Client/Server error");
                return;
            }
            const data = response.json();
            return data;
        })
        .catch(error => {
            console.error("getListFriendInvitationSent ", error);
        });
    console.log("--");
    return response;
}

const searchFindNewFriendWindow = async () => {
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list");
    const regex = /([A-Za-z]+)/g;
    const searchInput = document.querySelector("#c-find-new-friend-window input");
    const listUsers = await getListUsers();
    const listFriends = await getListFriends();
    const listFriendInvitationSent = await getListFriendInvitationSent();
    const listFriendInvitationReceived = await getListFriendInvitationsReceived();

    userListDiv.innerHTML = "";
    if (searchInput.value) {
        const parsedSearchInput = searchInput.value.match(regex).join("");

        console.log(listUsers);
        let listFriendInvitationPending = [{}];
        if (listFriendInvitationSent) {
            listFriendInvitationPending = listFriendInvitationSent.filter(invitation => invitation.status === "pending");
        }
        if (listFriendInvitationReceived) {
            const listFriendInvitationReceivedAndPending = listFriendInvitationReceived.filter(invitation => invitation.status === "pending");
            listFriendInvitationPending = listFriendInvitationPending.concat(listFriendInvitationReceivedAndPending);
        }
        const listUsersWithoutSelf = listUsers.filter((user) => user.username != getCookie("username"))
        const listUsersWithoutSelfAndFriends = listUsersWithoutSelf.filter((user) => !listFriends.some((friend => friend.username === user.username)));
        const matchlist = listUsersWithoutSelfAndFriends.filter((user) => user.username.includes(parsedSearchInput));
        matchlist.forEach((user) => {
            if (listFriendInvitationPending.some(invitation => invitation.receiver_username === user.username || invitation.sender_username === user.username)) {
                const userHTML = `<div id="c-list-user-${user.username}" class="c-user">
                    <div class="user-avatar"><img src="../img/avatar/avatar_default.png" alt="profile-picture"></div>
                    <div class="user-name">${user.username}</div>
                    <div>pending</div>
                    </div>`;
                userListDiv.innerHTML += userHTML;
            } else {
                const userHTML = `<div id="c-list-user-${user.username}" class="c-user">
                    <div class="user-avatar"><img src="../img/avatar/avatar_default.png" alt="profile-picture"></div>
                    <div class="user-name">${user.username}</div>
                    <button id="c-send-friend-invite-${user.username}" class="c-send-friend-invite">+</button>
                    </div>`;
                userListDiv.innerHTML += userHTML;
            }
        });
        document.querySelectorAll(".c-send-friend-invite").forEach(user => {
            const userUsername = user.id.substring().slice(21);
            console.log(userUsername);
            user.addEventListener("click", (e) => sendFriendInvite(userUsername));
        });
    }
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

const sendFriendInvite = async (username) => {
    console.log(username);
    let f_token = getCookie("token");
    await fetch("http://127.0.0.1:8000/api/v1/user/friendship/invite", {
        method: "POST",
        body: JSON.stringify({username}),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("sendFriendInvite: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error send Friend Invite: ", error);
        });
    console.log("----");
    //const sendData = new dataToServer("notification", 'friend invite received', client.listUser.find(user => user.id == id));
    //client.socket.send(JSON.stringify(sendData));
    //console.log(sendData);
    //findNewFriendWindow.classList.add("hidden");
    searchFindNewFriendWindow();
};

export {
    displayFindNewFriendWindow,
};
