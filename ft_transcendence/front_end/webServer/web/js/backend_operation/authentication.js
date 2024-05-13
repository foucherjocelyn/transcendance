import { notice } from "../authentication/auth_main.js";
import { getCookie, deleteAllCookie } from "../authentication/auth_cookie.js";
import { to_connectForm } from "../authentication/auth_connect.js";
import { to_homePage } from "../home/home_homeboard.js";
import { client, dataToServer, user } from "../client/client.js";
import { updateMyInfo } from "./data_update.js";

export async function requestToken(f_log) {
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
		if (!response.ok) {
			document.cookie = `token=; SameSite=Strict`;
			console.log("requestToken: Client or Server error");
			throw new Error("fetch POST requestToken");
		}
		const data = await response.json();
		console.log("New token generated:\n" + data.access);
		document.cookie = `token=; SameSite=Strict`;
		document.cookie = `token=${data.access}; SameSite=Strict`;
	} catch (error) {
		console.error("requestToken: ", error);
	}
	console.log("-");
}

export async function postUser(new_user) {
	console.log("-Registering new user into database");
	console.log(new_user);
	try {
		const r = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
			method: "POST",
			body: JSON.stringify(new_user),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8"
			}
		})
		console.log("status :");
		console.log(r.status);
		if (!r.ok) {
			notice("Given information invalid (mail or username is already taken)", 2, "#fc2403");
			console.log("Client error");
			throw new Error("fetch POST postUser");
		}
		notice("Your account was succesfully created", 2, "#0c9605");
		console.log("-");
		return (r);
	}
	catch (error) {
		console.error("postUser :", error);
	};
}

export function openSocketClient() {
	const sendData = new dataToServer('connection', client.inforUser, client.inforUser, client.inforUser);
	client.socket.send(JSON.stringify(sendData));
}

export function closeSocketClient() {
	const sendData = new dataToServer('disconnection', client.inforUser, client.inforUser, client.inforUser);
	client.socket.send(JSON.stringify(sendData));
}

export async function signIn(connect_user) {
	console.log("-Connecting user: ");
	console.log(connect_user);
	try {
		const r = await fetch(`http://127.0.0.1:8000/api/v1/auth/login`, {
			method: "POST",
			body: JSON.stringify(connect_user),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
			}
		})
		console.log("response =");
		console.log(r);
		if (r.ok) {
			notice("Connection successful", 1, "#0c9605");
			document.cookie = `username=${connect_user.username}; SameSite=Strict`;
		}
		else if (!r.ok) {
			notice("One of the given information is invalid", 1, "#D20000");
			console.log("Your password or username is wrong");
			return;
		}
		const data = await r.json();
		document.cookie = `refresh=${data.refresh}; SameSite=Strict`;
		document.cookie = `token=${data.access}; SameSite=Strict`;

		updateMyInfo(true);
		if (getCookie("token") === null || getCookie("token") === "") {//need custom message when wrong OTP
			console.log("Username/Password invalid");
			notice("The username and/or password is invalid", 2, "#b00009");
			if (document.getElementById("loadspinner") != null)
				document.getElementById("loadspinner").classList.add("hide");
			return;
		}
		if (document.getElementById("loadspinner") != null)
			document.getElementById("loadspinner").classList.add("hide");
		to_homePage();
		return (data.status);
	} catch (error) {
		console.error("Sign in: ", error);
	}
	//	return (r);
}

export async function signOut() {
	console.log("-User is signing out: [" + getCookie("username") + "]");
	if (getCookie("token") === null || getCookie("token") === "") {
		console.log("signOut ERROR: no token found");
		return;
	}
	try {
		const r = await fetch(`http://127.0.0.1:8000/api/v1/auth/logout`, {
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
		console.log("logout status: " + response.status);
		notice("You are now disconnected", 1, "#0c9605");
		updateMyInfo();
		//			  console.log("Your status [" + getCookie("status") + "]");
		//deleteAllCookie();
		closeSocketClient();
		to_connectForm();
	}
	catch (error) {
		console.error("Error: ", error);
	}
	console.log("-");
}
