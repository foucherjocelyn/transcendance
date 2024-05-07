import { getListFriends } from "../backend_operation/get_user_info.js";
import { openChatBox } from "./chatbox.js";

const renderFriendList = (list) => {
    console.log(list);
    const friendsList = document.getElementById("c-friends-list");
    friendsList.innerHTML = "";
    list.forEach((user) => {
        friendsList.innerHTML += `<div id="c-list-user-${user.username}" class="c-user c-friend">
                    <div class="user-avatar">
                        <img src="../img/avatar/avatar_default.png" alt="profile-picture">
                        <div id="c-list-friend-status-${user.username}" class="c-list-friend-status ${user.status}"></div>
                    </div>
                    <div class="user-name">${user.username}</div>
                    <button id="c-invite-match${user.username}" class="c-invite-match-button"></button>
                </div>`;
    });
    document.querySelectorAll(".c-friend").forEach(friendDiv => {
        const friendUsername = friendDiv.id.slice(12);
        console.log("friends");
        console.log(friendUsername);
        console.log(friendDiv);
        friendDiv.addEventListener("click", (e) => openChatBox(friendUsername));
        friendDiv.querySelector(".c-invite-match-button").addEventListener("click", (e) => {
            e.stopPropagation();
            console.log(`invited ${friendUsername} to a match`);
        })
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

export { renderFriendList, searchFriendList, getListFriends };
