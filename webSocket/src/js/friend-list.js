import { client } from "./client";
import { dataToServer } from "./client";

const friendsList = document.getElementById("c-friends-list");
const friendsListSearchInput = document.querySelector("#c-search-friend-list input");
const friendsListSearchButton = document.querySelector("#c-search-friend-list button");

const users = [
    {
        id: "#1234",
        name: "Jack"
    },
    {
        id: "#1254",
        name: "Samantha"
    },
    {
        id: "#1267",
        name: "Arthur"
    },
    {
        id: "#1289",
        name: "Pierre"
    },
    {
        id: "#1564",
        name: "Joe"
    },
    {
        id: "#1664",
        name: "Zoe"
    },
    {
        id: "#1598",
        name: "Clara"
    },
    {
        id: "#1978",
        name: "Enzo"
    },
    {
        id: "#4664",
        name: "Theo"
    },
    {
        id: "#3984",
        name: "Paul"
    },
    {
        id: "#1976",
        name: "Adrien"
    },
];

const friends = [
    {
        id: "#1234",
        name: "Jack"
    },
    {
        id: "#1254",
        name: "Samantha"
    },
    {
        id: "#1267",
        name: "Arthur"
    },
    {
        id: "#1289",
        name: "Pierre"
    },
    {
        id: "#1564",
        name: "Joe"
    }
];

const renderFriendList = (list = friends) => {
    const friendsHTML = list.map((user) => {
        return `<div id="c-list-user-${user.id}" class="c-user c-friend">
                    <div class="user-avatar"><img src="icon/default.jpg" alt="profile-picture"></div>
                    <div class="user-name">${user.name}</div>
                </div>`;
    }).join("");
    friendsList.innerHTML = friendsHTML;
};

const searchFriendList = () => {
    if (friendsListSearchInput.value === "") {
        renderFriendList();
        return;
    }
    const regex = /([A-Za-z]+)/g;
    const parsedSearchInput = friendsListSearchInput.value.match(regex).join("");
    const matchlist = friends.filter((friend) => friend.name.includes(parsedSearchInput));
    renderFriendList(matchlist);
};

renderFriendList();

friendsListSearchButton.addEventListener("click", searchFriendList);
friendsListSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchFriendList();
    }
});
