import { client } from "./client";
import { dataToServer } from "./client";
import { openChatBox } from "./chat";
import { displayFindNewFriendWindow } from "./add-friend";

const friendsList = document.getElementById("c-friends-list");
const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
const friendsListSearchButton = document.querySelector("#c-search-friend-list button");
const addNewFriendButton = document.getElementById("c-add-new-friend-button");

const renderFriendList = (list = client.inforUser.listFriends) => {
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
    if (friendsListSearchInput.value === "") {
        renderFriendList();
        return;
    }
    const regex = /([A-Za-z]+)/g;
    const parsedSearchInput = friendsListSearchInput.value.match(regex).join("");
    const matchlist = client.inforUser.listFriends.filter((friend) => friend.name.includes(parsedSearchInput));
    renderFriendList(matchlist);
};

friendsListSearchButton.addEventListener("click", searchFriendList);
friendsListSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchFriendList();
    }
});

addNewFriendButton.addEventListener("click", displayFindNewFriendWindow);

export { renderFriendList };