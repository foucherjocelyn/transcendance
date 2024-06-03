import { getCookie } from "../authentication/auth_cookie.js";

export const postNewMessage = async (message) => {
    let f_token = getCookie("token");
    await fetch("https://localhost:8000/api/v1/user/friend/message", {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("postMessage: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error postMessage: ", error);
        });
};

export const postMuteUser = async (username) => {
    let f_token = getCookie("token");
    await fetch("https://localhost:8000/api/v1/user/friendship/mute", {
        method: "POST",
        body: JSON.stringify({username: username}),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("muteUser: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error muteUser: ", error);
        });
};

export const postUnmuteUser = async (username) => {
    let f_token = getCookie("token");
    await fetch("https://localhost:8000/api/v1/user/friendship/unmute", {
        method: "POST",
        body: JSON.stringify({username: username}),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("postUnmuteUser: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error postUnmuteUser: ", error);
        });
};