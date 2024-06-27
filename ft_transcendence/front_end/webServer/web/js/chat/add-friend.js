import { client } from "../client/client.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { getListFriends } from "./friend-list.js";
import { getListUsers } from "../backend_operation/get_user_info.js";
import { getListFriendInvitationSent, getListFriendInvitationsReceived, sendFriendInvite } from "../backend_operation/friend_invite.js";

export const searchFindNewFriendWindow = async () => {
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list");
    const regex = /([A-Za-z]+)/g;
    const searchInput = document.querySelector("#c-find-new-friend-window input");
    const listUsers = await getListUsers();
    const listFriends = await getListFriends();
    const listFriendInvitationSent = await getListFriendInvitationSent();
    const listFriendInvitationReceived = await getListFriendInvitationsReceived();

    userListDiv.innerHTML = "";
    if (searchInput.value) {
        const parsedSearchInput = searchInput.value.match(regex).join("");

        let listFriendInvitationPending = [{}];
        if (listFriendInvitationSent) {
            listFriendInvitationPending = listFriendInvitationSent.filter(invitation => invitation.status === "pending");
        }
        if (listFriendInvitationReceived) {
            const listFriendInvitationReceivedAndPending = listFriendInvitationReceived.filter(invitation => invitation.status === "pending");
            listFriendInvitationPending = listFriendInvitationPending.concat(listFriendInvitationReceivedAndPending);
        }
        const listUsersWithoutSelf = listUsers.filter((user) => user.username != getCookie("username"))
        const listUsersWithoutSelfAndFriends = listUsersWithoutSelf.filter((user) => !listFriends.some((friend => friend.username === user.username)));
        const matchlist = listUsersWithoutSelfAndFriends.filter((user) => user.username.includes(parsedSearchInput));
        matchlist.forEach((user) => {
            if (listFriendInvitationPending.some(invitation => invitation.receiver_username === user.username || invitation.sender_username === user.username)) {
                const userHTML = `<div id="c-list-user-${user.username}" class="c-user">
                    <img src="../../img/avatars/default.png" alt="profile-picture" class="user-avatar">
                    <div class="user-name">${user.username}</div>
                    <div>pending</div>
                    </div>`;
                userListDiv.innerHTML += userHTML;
            } else {
                const userHTML = `<div id="c-list-user-${user.username}" class="c-user">
                    <img src="../img/avatars/default.png" alt="profile-picture" class="user-avatar">
                    <div class="user-name">${user.username}</div>
                    <button id="c-send-friend-invite-${user.username}" class="c-send-friend-invite">+</button>
                    </div>`;
                userListDiv.innerHTML += userHTML;
            }
        });
        document.querySelectorAll(".c-send-friend-invite").forEach(user => {
            const userUsername = user.id.substring().slice(21);
            user.addEventListener("click", (e) => {
                sendFriendInvite(userUsername);
                searchFindNewFriendWindow();
            });
        });
    }
};

const closeFindNewFriendWindow = () => {
    const findNewFriendWindow = document.getElementById("c-find-new-friend-window");
    findNewFriendWindow.classList.add("hidden");
    document.querySelector("#c-find-new-friend-window .c-close-button").removeEventListener("click", closeFindNewFriendWindow);
};

const displayFindNewFriendWindow = () => {
    const findNewFriendWindow = document.getElementById("c-find-new-friend-window");
    const userListDiv = document.querySelector("#c-find-new-friend-window .user-list").innerHTML = "";
    document.querySelector("#c-find-new-friend-window input").value = "";
    findNewFriendWindow.classList.remove("hidden");
    document.querySelector("#c-find-new-friend-window .c-close-button").addEventListener("click", closeFindNewFriendWindow);
};

export {
    displayFindNewFriendWindow
};
