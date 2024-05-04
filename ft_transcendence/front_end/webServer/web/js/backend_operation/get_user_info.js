import { getCookie } from "../authentication/auth_cookie.js";
import { user, client } from '../client/client.js';
import { match_default } from "../createMatch/createMatch.js";
import { openSocketClient } from "./authentication.js";

export function	updateMyInfo(connectFlag = false)
{
	let info = getMyInfo();
	info.then(() =>
	{
		user.id = '#' + getCookie('id');
    	user.name = getCookie('username');
    	user.level = getCookie("level");
    	user.avatar = '../img/avatar/avatar_default.png';//need to update with actual path
    	user.status = 'connection';
		client.inforUser = user;
		if (connectFlag)
		{
			openSocketClient();
			match_default();
		}
	});
}

export async function	getMyInfo()
{
	console.log("-Obtaining user info");
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
				  console.log("getMyInfo data:");
				  console.log(data);
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
	console.log("-");
}

export async function	getUserList()
{
	console.log("-Obtaining user list");
	let f_token = getCookie("token");

	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch("http://127.0.0.1:8000/api/v1/users", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getUserList: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getUserList:");
				  console.log(data);
			  })
		  .catch(error => {
			  console.error("getUserList: ", error);
		  });
	console.log("-");
}
