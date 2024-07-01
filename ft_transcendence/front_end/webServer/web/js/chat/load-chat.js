import { searchFriendList } from "./friend-list.js";
import { displayFindNewFriendWindow, searchFindNewFriendWindow } from "./add-friend.js";
import { showNotifications } from "./notifications.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { getUserById } from "../backend_operation/get_user_info.js";

async function refreshChat() {
    if (document.getElementById("chat-list")) {
        const myId = getCookie("id");
        const myinfo = await getUserById(myId);
        if (myinfo && myinfo.status !== "offline") {
            searchFriendList();
            setTimeout(refreshChat, 2000);
        }
    }
}

const loadChat = () => {
    const chatDiv = document.getElementById("chat");
    if (!chatDiv)
        return;
    chatDiv.innerHTML = `<div id="c-find-new-friend-window" class="hidden">
    <button class="c-close-button">&times;</button>
    <h3>Add New Friend</h3>
    <input id="c-find-new-friend-input" name="user-name" type="text" placeholder="User name">
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
            <input id="c-search-friend-list-input" name="friend name" type="text" placeholder="Friend name">
        </div>
    </div>
</div>
<div id="c-chat-box" class="chat-box">
</div>`;
    const friendsListSearchInput = document.getElementById("c-search-friend-list-input");
    const addNewFriendButton = document.getElementById("c-add-new-friend-button");
    searchFriendList();
    // const listFriends = getListFriends();
    // listFriends.then(list => {
    //     renderFriendList(list);
    // });
    friendsListSearchInput.addEventListener("input", searchFriendList);
    addNewFriendButton.addEventListener("click", displayFindNewFriendWindow);
    document.getElementById("c-find-new-friend-input").addEventListener("input", searchFindNewFriendWindow);
    document.getElementById("c-hide-friend-list").addEventListener("click", () => { document.getElementById("chat-list").classList.toggle("hide"); });
    document.querySelector("#c-show-notifications-button").addEventListener("click", showNotifications);
    document.getElementById("chat").style.display = "block";
    //refreshChat();
    searchFriendList();
};

export { loadChat };
