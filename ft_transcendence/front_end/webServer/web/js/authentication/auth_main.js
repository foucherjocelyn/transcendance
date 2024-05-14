import { to_homePage } from "../home/home_homeboard.js";
import { to_game } from "../home/home_game.js";
import { to_profilePage } from "../home/home_changeprofile.js";
import { to_tournament } from "../home/home_tournament.js";
import { to_connectForm } from "./auth_connect.js";
import { to_regisForm } from "./auth_register.js";
import { to_forgotForm } from "./auth_reset.js";
import { getCookie } from "./auth_cookie.js";
import { updateMyInfo } from "../backend_operation/data_update.js";


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

function checkAddress()
{
	let	url = window.location.href;

	console.log("here---------------");
	console.log(url);
	let	pagename = url.split("#")[1];
//	console.log(pagename);
	let found = Object.keys(urlRoutes).includes(pagename);
//	console.log("found = " + found);
	if (found)
		urlRoutes[pagename]();
	else
		to_homePage();
}

export function	authCheck()
{
	console.log("---authCheck(): Checking if user is connected");
	console.log("The user is " + getCookie("status"));
	updateMyInfo();
	if (getCookie("token") != null && getCookie("token") != "" && getCookie("status") === "online")
	{//add securite
		updateMyInfo(true);
//		to_homePage();
		checkAddress();
		return ("true");
	}
	else
	{
		to_connectForm();
		return ("false");
	}
	console.log("---");
	return ("false");
}

const urlRoutes = {
	connect: () => to_connectForm("true"),
	register: () => to_regisForm("true"),
	reset: () => to_forgotForm("true"),
	homepage: () => to_homePage("true"),
	configprofile: () => to_profilePage("true"),
	game: () => to_game("true"),
	tournament: () => to_tournament("true")
};

window.onpopstate = function(event) {
	console.log("popstate detected");
	console.log(event.state);
	if (event.state)
	{
		let url = event.state.url;
		if (url)
		{
			urlRoutes[url]();
		}
	}
	else
		authCheck();
};

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
