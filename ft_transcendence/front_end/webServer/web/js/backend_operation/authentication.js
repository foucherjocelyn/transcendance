import { notice } from "../authentication/auth_main.js";
import { deleteAllCookie, getCookie } from "../authentication/auth_cookie.js";
import { to_connectForm } from "../authentication/auth_connect.js";
import { to_homePage } from "../home/home_homeboard.js";
import { client, dataToServer } from "../client/client.js";
import { getMyInfo } from "./get_user_info.js";

export const domain_name = window.location.hostname;

export async function requestToken(f_log) {
	//console.log("-Requesting new token");
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/token`, {
			method: "POST",
			body: JSON.stringify(f_log),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
			}
		});
		if (!response.ok) {
			document.cookie = `token=; SameSite=Strict`;
			console.log("requestToken: Client or Server error");
			throw new Error("fetch POST requestToken");
		}
		const data = await response.json();
		//console.log("New token generated:\n" + data.access);
		document.cookie = `token=; SameSite=Strict`;
		document.cookie = `token=${data.access}; SameSite=Strict`;
	} catch (error) {
		console.error("requestToken: ", error);
	}
}

export async function postUser(new_user) {
	//console.log("-Registering new user into database");
	//console.log(new_user);
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/auth/register`, {
			method: "POST",
			body: JSON.stringify(new_user),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		//console.log("status :");
		//console.log(response.status);
		if (!response.ok) {
			notice("Given information invalid (mail or username is already taken)", 2, "#fc2403");
			console.log("Client error");
			return (response.status);
		}
		notice("Your account was succesfully created", 2, "#0c9605");
		return (response.status);
	}
	catch (error) {
		console.error("postUser :", error);
	};
}

export function openSocketClient() {
	//console.log("opening socket client");
	const sendData = new dataToServer('connection', getCookie('id'), 'socket server');
	client.socket.send(JSON.stringify(sendData));
}

export function closeSocketClient() {
	const sendData = new dataToServer('disconnect', client.inforUser, 'socket server');
	client.socket.send(JSON.stringify(sendData));
}

export async function signIn(connect_user) {
	//console.log("-Connecting user: ");
	console.log(connect_user);
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/auth/login`, {
			method: "POST",
			body: JSON.stringify(connect_user),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
			}
		})
		//console.log("response =");
		//console.log(response);
		if (response.ok) {
			notice("Connection successful", 1, "#0c9605");
			document.cookie = `username=${connect_user.username}; SameSite=Strict`;
		}
		else if (!response.ok) {
			notice("One of the given information is invalid", 1, "#D20000");
			console.log("Your password or username is wrong");
			to_connectForm("false");
			return (response.status);
		}
		const data = await response.json();
		document.cookie = `token=${data.access}; SameSite=Strict`;
		await getMyInfo();
		openSocketClient();
		 if (document.getElementById("loadspinner") != null)
			document.getElementById("loadspinner").classList.add("hide");
		to_homePage();
		return (data.status);
	} catch (error) {
		console.error("Sign in: ", error);
	}
	return (response.status);
}

export async function signOut() {
	//console.log("-User is signing out: [" + getCookie("username") + "]");
	if (getCookie("token") === null || getCookie("token") === "") {
		console.log("signOut ERROR: no token found");
		return;
	}
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/auth/logout`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${getCookie("token")}`
			}
		})
		if (!response.ok) {
			console.log("Error during disconnection");
			document.getElementById("loadspinner").classList.add("hide");
			return ;
			//				  throw new Error("fetch POST op failed");
		}
		//console.log("logout status: " + response.status);
		notice("You are now disconnected", 1, "#0c9605");
		deleteAllCookie();
		//			  console.log("Your status [" + getCookie("status") + "]");
		closeSocketClient();
		to_connectForm();
	}
	catch (error) {
		console.error("Error: ", error);
	}
}
