import { renderFriendList } from "./friend-list.js";
import { searchFriendList } from "./friend-list.js";
import { displayFindNewFriendWindow } from "./add-friend.js";
import { showAnnouncements } from "./announcements.js";

const loadChat = () => {
    const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
    const friendsListSearchButton = document.querySelector("#c-search-friend-list button");
    const addNewFriendButton = document.getElementById("c-add-new-friend-button");

    renderFriendList();

    friendsListSearchButton.addEventListener("click", searchFriendList);
    friendsListSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchFriendList();
        }
    });
    addNewFriendButton.addEventListener("click", displayFindNewFriendWindow);
    document.querySelector("#c-show-announcements-button").addEventListener("click", () => {
        showAnnouncements();
    });
    document.getElementById("chat").style.display = "block";
    console.log("chat loaded");
};

export { loadChat };