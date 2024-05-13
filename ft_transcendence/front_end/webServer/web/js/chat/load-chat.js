import { renderFriendList } from "./friend-list.js";
import { searchFriendList } from "./friend-list.js";
import { displayFindNewFriendWindow } from "./add-friend.js";
import { showNotifications } from "./notifications.js";
import { getListFriends } from "./friend-list.js";

async function refreshChat() {
    if (document.getElementById("chat-list")) {
        const listFriends = await getListFriends();
        renderFriendList(listFriends);
        setTimeout(refreshChat, 5000);
    }
}

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
<div id="c-notifications-window" class="hidden">
    <button class="c-close-button">&times;</button>
    <div id="c-notifications-list"></div>
</div>
<br>
	<div id="chat_upperpanel">
    <div id="c-show-notifications">
	    <button id="c-show-notifications-button"></button>
        <div id="c-notification-count" class="hidden"></div>
    </div>
	<button id="c-add-new-friend-button"></button>
	<button id="c-hide-friend-list"></button>
	</div>
<div id="chat-list">
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
    const listFriends = getListFriends();
    listFriends.then(list => {
        renderFriendList(list);
    });
    friendsListSearchButton.addEventListener("click", searchFriendList);
    friendsListSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchFriendList();
        }
    });
    addNewFriendButton.addEventListener("click", displayFindNewFriendWindow);
    document.getElementById("c-hide-friend-list").addEventListener("click", () => { document.getElementById("chat-list").classList.toggle("hide"); });
    document.querySelector("#c-show-notifications-button").addEventListener("click", showNotifications);
    document.getElementById("chat").style.display = "block";
    console.log("chat loaded");
    refreshChat();
};

export { loadChat };
