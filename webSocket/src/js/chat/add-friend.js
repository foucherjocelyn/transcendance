import { client } from "../client/client.js";
import { dataToServer } from "../client/client.js";
import { getCookie } from "../authentication/auth_cookie.js";

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

const searchFindNewFriendWindow = () => {
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list");
    const regex = /([A-Za-z]+)/g;
    const searchInput = document.querySelector("#c-find-new-friend-window input");
    const listUsersRequest = getListUsers();

    if (searchInput.value) {
        listUsersRequest.then(listUsers => {
            const parsedSearchInput = searchInput.value.match(regex).join("");

            console.log(listUsers);
            const listUsersWithoutSelf = listUsers.filter((user) => user.username != getCookie("username"))
            const matchlist = listUsersWithoutSelf.filter((user) => user.username.includes(parsedSearchInput));
            const usersHTML = matchlist.map((user) => {
                return `<div id="c-list-user-#${user.id}" class="c-user">
                <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                <div class="user-name">${user.username}<span class="user-id">#${user.id}</span></div>
                <button id="c-send-friend-invite-#${user.id}" class="c-send-friend-invite">+</button>
                </div>`;
            }).join("");
            userListDiv.innerHTML = usersHTML;
            document.querySelectorAll(".c-send-friend-invite").forEach((user) => {
                const userId = user.id.substring(user.id.indexOf('#') + 1);
                user.addEventListener("click", (e) => sendFriendInvite(userId));
            });
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

const sendFriendInvite = (id) => {
    const findNewFriendWindow = document.getElementById("c-find-new-friend-window");
    console.log(id);
    const sendData = new dataToServer("announcement", 'friend invite received', client.listUser.find(user => user.id == id));
    client.socket.send(JSON.stringify(sendData));
    console.log(sendData);
    findNewFriendWindow.classList.add("hidden");
};

export {
    displayFindNewFriendWindow,
};
