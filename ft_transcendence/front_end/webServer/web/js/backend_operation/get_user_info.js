import { getCookie } from "../authentication/auth_cookie.js";
import { user, client } from '../client/client.js';
import { openSocketClient } from "./authentication.js";
import { getAvatar } from "./profile_picture.js";

export async function	getUserById(user_id)
{
	let f_token = getCookie("token");

	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch(`http://127.0.0.1:8000/api/v1/users/${user_id}`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getUserById: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getUserById:");
				  console.log(data);
			  })
		  .catch(error => {
			  console.error("getUserById: ", error);
		  });
}

export async function	getUserIdByUsername(username)
{
	let f_token = getCookie("token");

	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch(`http://127.0.0.1:8000/api/v1/users/id/${username}`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getUserIdByUsername: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getUserIdByUsername:");
				  console.log(data);
				  return (data);
			  })
		  .catch(error => {
			  console.error("getUserIdByUsername: ", error);
		  });
}

export async function	updateMyInfo(connectFlag = false)
{
	let avatar_path = await getAvatar();
	if (avatar_path === null || avatar_path === undefined)
		avatar_path = '../img/avatar/avatar_default.png';
	avatar_path = '../img/avatar/avatar_default.png';
	let info = getMyInfo();
	info.then(() =>
	{
		user.id = '#' + getCookie('id');
    	user.name = getCookie('username');
    	user.level = getCookie("level");
    	user.avatar = avatar_path;
    	user.status = 'connection';
		client.inforUser = user;
		if (connectFlag)
		{
			openSocketClient();
			// match_default();
		}
	});
}

export async function	getMyInfo()
{
//	console.log("-Obtaining user info");
	let f_token = getCookie("token");

	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch("http://127.0.0.1:8000/api/v1/profile/me", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getMyInfo: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
//				  console.log("getMyInfo data:");
//				  console.table(data);
				  if (data !== undefined)
				  {
				  	document.cookie = `username=${data.username}; SameSite=Strict`;
				  	document.cookie = `firstname=${data.first_name}; SameSite=Strict`;
				  	document.cookie = `lastname=${data.last_name}; SameSite=Strict`;
				  	document.cookie = `email=${data.email}; SameSite=Strict`;
				  	document.cookie = `level=${data.level}; SameSite=Strict`;
				  	document.cookie = `avatar=${data.avatarPath}; SameSite=Strict`;
				  	document.cookie = `id=${data.id}; SameSite=Strict`;
				  	document.cookie = `is_active=${data.active}; SameSite=Strict`;
					document.cookie = `status=${data.status}; SameSite=Strict`;
				  	document.cookie = `is_staff=${data.is_staff}; SameSite=Strict`;
				  	document.cookie = `is_admin=${data.is_superuser}; SameSite=Strict`;
				  }
//				  showCookie();
			  })
		  .catch(error => {
			  console.error("getMyInfo: ", error);
		  });
//	console.log("-");
}

export async function getListUsers() {
    console.log("--getListUsers starting");
    let f_token = getCookie("token");

    const response = await fetch("http://127.0.0.1:8000/api/v1/users", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log("getListUsers: Client/Server error");
                return;
            }
            const data = response.json();
            return data;
        })
        .catch(error => {
            console.error("getListUsers: ", error);
        });
    console.log("--");
    return response;
}

export const getListFriends = async () => {
    let f_token = getCookie("token");

    return await fetch("http://127.0.0.1:8000/api/v1/user/friendship", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${f_token}`
        }
    })
        .then (response => {
            if (!response.ok) {
                console.log("getListFriends: Client/Server error");
                return;
            }
            return response.json();
        })
        .then (data => {
            return data;
        })
        .catch(error => {
            console.error("getListFriends: ", error);
        });
}
