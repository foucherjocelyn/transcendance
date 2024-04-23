import { client } from "../client/client.js";
import { openChatBox } from "./chatbox.js";

const renderFriendList = (list = client.inforUser.listFriends) => {
    const friendsList = document.getElementById("c-friends-list");
    const friendsHTML = list.map((user) => {
        return `<div id="c-list-user-${user.id}" class="c-user c-friend">
                    <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                    <div class="user-name">${user.name}</div>
                </div>`;
    }).join("");
    friendsList.innerHTML = friendsHTML;
    document.querySelectorAll(".c-friend").forEach((friend) => {
        const friendId = friend.id.substring(friend.id.indexOf('#'));
        friend.addEventListener("click", (e) => openChatBox(friendId));
    });
};

const searchFriendList = () => {
    const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
    if (friendsListSearchInput.value === "") {
        renderFriendList();
        return;
    }
    const regex = /([A-Za-z]+)/g;
    const parsedSearchInput = friendsListSearchInput.value.match(regex).join("");
    const matchlist = client.inforUser.listFriends.filter((friend) => friend.name.includes(parsedSearchInput));
    renderFriendList(matchlist);
};

export { renderFriendList, searchFriendList };