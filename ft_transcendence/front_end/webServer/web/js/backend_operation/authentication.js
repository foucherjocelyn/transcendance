import { notice } from "../authentication/auth_main.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { deleteAllCookie } from "../authentication/auth_cookie.js";
import { to_connectForm } from "../authentication/auth_connect.js";
import { getMyInfo } from "./get_user_info.js";
import { authCheck } from "../authentication/auth_main.js";
import { to_homePage } from "../home/home_homeboard.js";
import { client, dataToServer, user } from "../client/client.js";

export async function requestToken(f_log)
{
	console.log("-Requesting new token");
	try {
		const response = await fetch("http://127.0.0.1:8000/api/v1/token", {
			method: "POST",
			body: JSON.stringify(f_log),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
			}
		});
		if (!response.ok)
		{
			document.cookie = `token=; SameSite=Strict`;
console.log("requestToken: Client or Server error");
			return ;
		}
		const data = await response.json();
		console.log("New token generated:\n" + data.access);
		document.cookie = `token=; SameSite=Strict`;
		document.cookie = `token=${data.access}; SameSite=Strict`;
	}
	catch(error)
	{
		console.error("requestToken: ", error);
	}
	console.log("-");
}

export async function postUser(new_user)
{
	console.log("-Registering new user into database");
	console.log(new_user);
    const r = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
		method: "POST",
		body: JSON.stringify(new_user),
		headers: {
			"Accept": "application/json",
			"Content-type": "application/json; charset=UTF-8"
		}
    })
		  .then(response =>  {
			  console.log("status = " + response.status);
			  notice("Your account was succesfully created", 2, "#0c9605");
			  if (document.getElementById("loadspinner") != null)
				  document.getElementById("loadspinner").classList.add("hide");
			  to_connectForm();
			  if (!response.ok)
			  {
				  notice("Given information invalid (mail or username is already taken)", 2, "#fc2403");
				  console.log("Client error");
				  return ;
		  }
			  return response.json();
		  })
		  .then(data => {
			  console.log(data);
		  })
	  .catch(error => {
	      console.error("postUser :", error);
	  });
	console.log("-");
}
/*
export function openSocketClient()
{
	const  sendData = new dataToServer('connection', client.inforUser, client.inforUser, client.inforUser);
	client.socket.send(JSON.stringify(sendData));
}

export function closeSocketClient()
{
}
*/
export async function signIn(connect_user)
{
	console.log("-Connecting user: ");
	console.log(connect_user);
    const r = await fetch(`http://127.0.0.1:8000/api/v1/auth/login`, {
		method: "POST",
		body: JSON.stringify(connect_user),
		headers: {
			"Accept": "application/json",
			"Content-type": "application/json; charset=UTF-8",
		}
    })
		  .then(response =>  {
//			  console.log("Connecting response =");
//			  console.log(response);
			  if (response.ok)
			  {
				  notice("Connection successful", 1, "#0c9605");
				  document.cookie = `username=${connect_user.username}; SameSite=Strict`;
			  }
			  else if (!response.ok)
			  {
				  notice("One of the given information is invalid", 1, "#D20000");
				  console.log("Your password or username is wrong");
//				  document.getElementById("loadspinner").classList.add("hide");
				  return ;
			  }
			  return response.json();
		  })
	  .then(data =>
		  {
			  document.cookie = `refresh=${data.refresh}; SameSite=Strict`;
			  document.cookie = `token=${data.access}; SameSite=Strict`;
			  getMyInfo();
			  //authCheck();

			  user.id = getCookie('id');
			  user.name = getCookie('username');
			  user.level = getCookie("level");
			  user.avatar = '../../img/avatar/avatar1.jpg';
			  user.status = 'connection';
			  client.inforUser = user;
			  
			  const  sendData = new dataToServer('connection', client.inforUser, client.inforUser, client.inforUser);
			  client.socket.send(JSON.stringify(sendData));
			  client.inforUser.status = getCookie("status");

			  if (document.getElementById("loadspinner") != null)
				  document.getElementById("loadspinner").classList.add("hide");
			  to_homePage();
		  })
		  .catch(error => {
	      console.error("Sign in: ", error);
		  });
	if (getCookie("token") === null || getCookie("token") === "")
    {//need custom message when wrong OTP
		console.log("Username/Password invalid");
		notice("The username and/or password is invalid", 2, "#b00009");
		document.getElementById("loadspinner").classList.add("hide");
	}
	console.log("-");
}

export async function signOut()
{
	console.log("-User is signing out: [" + getCookie("username") + "]");
	let f_username = {
		username: getCookie("username")
	};
	if (f_username.username === null || f_username.username === "")
	{
		console.log("signOut ERROR: no username defined");
		return ;
	}
    const r = await fetch(`http://127.0.0.1:8000/api/v1/auth/logout`, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${getCookie("token")}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("Error during disconnection");
				  document.getElementById("loadspinner").classList.add("hide");
//				  throw new Error("fetch POST op failed");
			  }
			  console.log("logout status: " + response.status);
			  notice("You are now disconnected", 1, "#0c9605");
			  deleteAllCookie();
			  document.cookie = `status="offline"; SameSite=Strict`;
			  console.log("Your status [" + getCookie("status") + "]");
			  to_connectForm();
			  //closeSocket();
		  })
		  .catch(error => {
			  console.error("Error: ", error);
		  });
	console.log("-");
}