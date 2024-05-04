import { renderFriendList } from "./friend-list.js";
import { searchFriendList } from "./friend-list.js";
import { displayFindNewFriendWindow } from "./add-friend.js";
import { showAnnouncements } from "./announcements.js";
import { getListFriends } from "./friend-list.js";

const loadChat = () => {
    const chatDiv = document.getElementById("chat");
    if (!chatDiv)
        return;
    chatDiv.innerHTML = `<div id="c-find-new-friend-window" class="hidden">
    <button class="c-close-button">&times;</button>
    <h3>Add New Friend</h3>
    <input name="user-name" type="text" placeholder="User name">
    <button class="search">Search</button>
    <div class="user-list"></div>
</div>
<div id="c-announcements-window" class="hidden">
    <button class="c-close-button">&times;</button>
    <div id="c-announcements-list"></div>
</div>
<div id="chat-list">
<button id="c-show-announcements-button"></button>
<button id="c-add-new-friend-button"></button>
<button id="c-hide-friend-list"></button>
    <div id="c-friends-div">
        <h3>Friends</h3>
        <div id="c-friends-list">
        </div>
        <div id="c-search-friend-list">
            <input name="friend name" type="text" placeholder="Friend name">
            <button>Search</button>
        </div>
    </div>
</div>
<div id="c-chat-box" class="chat-box">
</div>`;
    const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
    const friendsListSearchButton = document.querySelector("#c-search-friend-list button");
    const addNewFriendButton = document.getElementById("c-add-new-friend-button");
	const hideFriendList = document.getElementById("c-hide-friend-list");
	hideFriendList.addEventListener("click", () => { document.getElementById("c-friends-div").toggle("hide"); });
    const listFriends = getListFriends();
    listFriends.then(list => {
        client.inforUser.listFriends = list;
        renderFriendList(list);
    });

    friendsListSearchButton.addEventListener("click", searchFriendList);
    friendsListSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchFriendList();
        }
    });
    addNewFriendButton.addEventListener("click", displayFindNewFriendWindow);
    document.querySelector("#c-show-announcements-button").addEventListener("click", showAnnouncements);
    document.getElementById("chat").style.display = "block";
    console.log("chat loaded");
};

export { loadChat };