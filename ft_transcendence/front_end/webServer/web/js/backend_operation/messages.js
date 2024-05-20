import { getCookie } from "../authentication/auth_cookie.js";

export const postNewMessage = async (message) => {
    let f_token = getCookie("token");
    await fetch("https://localhost/api/v1/user/friend/message", {
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