import { getCookie } from "../authentication/auth_cookie.js";

export async function getListFriendInvitationSent() {
    console.log("--getListFriendInvitationSent starting");
    let f_token = getCookie("token");
    //    console.log(f_token);

    const response = await fetch("https://localhost/api/v1/user/friendship/sent", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getListFriendInvitationSent Client/Server error");
                return;
            }
            const data = response.json();
            return data;
        })
        .catch(error => {
            console.error("getListFriendInvitationSent ", error);
        });
    console.log("--");
    return response;
}

export const getListFriendInvitationsReceived = async () => {
    let f_token = getCookie("token");
    return await fetch("https://localhost/api/v1/user/friendship/received", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getListOfFriendInvitationsReceived: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("getListOfFriendInvitationsReceived: ", error);
        });
}

export const updateFriendInviteStatus = async (id, newStatus) => {
    let f_token = getCookie("token");
    await fetch(`https://localhost/api/v1/user/friendship/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ "status": newStatus }),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("updateFriendInviteStatus: Client/Server error");
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error updateFriendInviteStatus: ", error);
        });
}

export const sendFriendInvite = async (username) => {
    console.log(username);
    let f_token = getCookie("token");
    await fetch("https://localhost/api/v1/user/friendship/invite", {
        method: "POST",
        body: JSON.stringify({username}),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("sendFriendInvite: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error send Friend Invite: ", error);
        });
};