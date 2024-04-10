import { renderFriendList } from "./friend-list";
import { searchFriendList } from "./friend-list";
import { displayFindNewFriendWindow } from "./add-friend";
import { showAnnouncements } from "./announcements";

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
};

export { loadChat };