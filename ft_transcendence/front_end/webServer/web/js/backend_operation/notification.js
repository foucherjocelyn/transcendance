import { getCookie } from "../authentication/auth_cookie.js";

export const postNotification = async (notification) => {
    let f_token = getCookie("token");
    console.log(notification);
    await fetch("https://localhost/api/v1/notification/create", {
        method: "POST",
        body: JSON.stringify(notification),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("postNotification: Client/Server error");
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error postNotification: ", error);
        });
    console.log("----");
}

export const getListNotifications = async () => {
    let f_token = getCookie("token");
    return await fetch(`https://localhost/api/v1/notification/list`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getNotifications: Client/Server error");
                return;
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);
            return data;
        })
        .catch(error => {
            console.error("getNotifications : ", error);
        });
}

export const markNotificationAsRead = async (notificationId) => {
    let f_token = getCookie("token");
    await fetch(`https://localhost/api/v1/notification/${notificationId}/read`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("postNotification: Client/Server error");
                return response.json();
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error postNotification: ", error);
        });
};