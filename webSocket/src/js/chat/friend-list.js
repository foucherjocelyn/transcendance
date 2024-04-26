import { client } from "../client/client.js";
import { openChatBox } from "./chatbox.js";
import { getCookie } from "../authentication/auth_cookie.js";

export async function getListFriends() {
    console.log("--getListFriends starting");
    let f_token = getCookie("token");
    //    console.log(f_token);

    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/user/friendship", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
                "Authorization": `Bearer ${f_token}`
            }
        })
        if (!response.ok) {
            console.log("getListFriends: Client/Server error");
            return;
        }
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.error("getListFriends: ", error);
    };
    console.log("--");
    return response;
}

const renderFriendList = (list) => {
    console.log(list);
    const friendsList = document.getElementById("c-friends-list");
    friendsList.innerHTML = "";
    list.forEach((user) => {
        friendsList.innerHTML += `<div id="c-list-user-${user.username}" class="c-user c-friend">
                    <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                    <div class="user-name">${user.username}</div>
                </div>`;
        const friendElement = document.getElementById(`c-list-user-${user.username}`);
        friendElement.addEventListener("click", (e) => openChatBox(user.id, user.username));
    });
};

const searchFriendList = () => {
    const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
    const regex = /([A-Za-z0-9]+)/g;
    const listFriends = getListFriends();

    listFriends.then(list => {
        if (friendsListSearchInput.value === "") {
            renderFriendList(list);
            return;
        }
        const parsedSearchInput = friendsListSearchInput.value.match(regex)?.join("");
        const matchlist = list.filter((friend) => friend.username.includes(parsedSearchInput));
        renderFriendList(matchlist);
    });
};

export { renderFriendList, searchFriendList };
