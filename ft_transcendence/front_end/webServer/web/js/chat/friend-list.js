import { getListFriends } from "../backend_operation/get_user_info.js";
import { client } from "../client/client.js";
import { create_match } from "../createMatch/createMatch.js";
import { inspectProfile } from "../home/profile/home_profile.js";
import { send_invitation_to_play } from "../invitationPlay/displayResultsSearchInvitationPlay.js";
import { searchFindNewFriendWindow } from "./add-friend.js";
import { openChatBox } from "./chatbox.js";
import { renderNotifications } from "./notifications.js";
import { removeFriend } from "./remove-friend.js";

const renderFriendList = (list) => {
    //console.log(list);
    const friendsList = document.getElementById("c-friends-list");
    if (!friendsList)
        return ;
    friendsList.innerHTML = "";
    list.forEach((friend) => {
        friendsList.insertAdjacentHTML("beforeend", `<div id="c-list-user-${friend.username}" class="c-user c-friend">
        <div class="user-avatar">
            <img src="../img/avatar/avatar_default.png" alt="profile-picture">
            <div id="c-list-friend-status-${friend.username}" class="c-list-friend-status ${friend.status}"></div>
        </div>
        <div class="user-name">${friend.username}</div>
        <button id="c-invite-match${friend.username}" class="c-invite-match-button"></button>
        <button id="c-inspectprofile${friend.username}" class="c-inspectprofile-button"></button>
        <button id="c-remove-friend${friend.username}" class="c-remove-friend-button"></button>
    </div>`);

        const friendDiv = document.getElementById(`c-list-user-${friend.username}`);
        friendDiv?.addEventListener("click", (e) => openChatBox(friend.username));
        friendDiv?.querySelector(".c-invite-match-button").addEventListener("click", (e) => {
            e.stopPropagation();
            
            const receiverUser = client.listUser.filter(user => user.username === friend.username)[0];
            if (receiverUser === undefined || receiverUser.status === 'playing game')
                return ;
            
            create_match("with friends");
            send_invitation_to_play(receiverUser);
        })
        friendDiv.querySelector(".c-inspectprofile-button").addEventListener("click", (e) => {
            e.stopPropagation();
            inspectProfile(friend.username);
        })
        friendDiv.querySelector(".c-remove-friend-button").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure want to remove ${friend.username} from your friends ?`)) {
                removeFriend(friend.username);
            }
        })
    });
    renderNotifications();
    searchFindNewFriendWindow();
};

const searchFriendList = () => {
    const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
    const regex = /([A-Za-z0-9]+)/g;
    const listFriends = getListFriends();

    if (!friendsListSearchInput)
        return;
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
