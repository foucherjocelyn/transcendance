import { client, dataToServer } from "../client/client.js";
import { drawHomePage } from "../home/home_homeboard.js";
import { to_connectForm } from "./auth_connect.js";
import { getCookie } from "./auth_cookie.js";
import { getAvatar } from "../authentication/auth_profile_picture.js";
import { loadChat } from "../chat/load-chat.js";

export function notice(str, time, color)
{
	const messageInform = document.querySelector(".r_successinfo");
	messageInform.style.color = color;
	messageInform.innerText = str;
	messageInform.classList.remove("hide");
	let cdId = setInterval(function() {
		if (time === -1)
		{
			messageInform.classList.add("hide");
			clearInterval(cdId);
		}
		messageInform.innerText = str + " (" + time + ")";
		time--;
		}, 1000);
}

export function	authCheck()
{
	console.log("---authCheck(): Checking if user is connected");
	console.log("The user is " + getCookie("status"));
//	drawHomePage();
//	/*
	if (getCookie("status") === "offline")
		document.cookie = "token=; SameSite=Strict";
	//	getMyInfo();
//	console.log("The token is [" + getCookie("token") + "]");
	if (getCookie("token") != null && getCookie("token") != "" && getCookie("status") === "online")
	{//add securite

		const  sendData = new dataToServer('connection', client.inforUser, client.inforUser);
		client.socket.send(JSON.stringify(sendData));

		drawHomePage();
	}
	else
	{
		to_connectForm();
	}
//*/
//	console.log("---");
}

/*
function clearInputs(elemName) {
	var divElem = document.querySelector(elemName);
	var inputElem = divElem.getElementsByTagName("input");

	for (var i = 0; i < inputElem.length; i++) {
		if (inputElem[i].type != "submit" && inputElem[i].type != "button")
        inputElem[i].value = "";
    }
}
*/

//addEventListener("DOMContentLoaded", authCheck);
