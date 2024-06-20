import { to_homePage } from "../home/home_homeboard.js";
import { to_game } from "../home/game/home_game.js";
import { to_profilePage } from "../home/profile/home_changeprofile.js";
import { to_tournament } from "../home/tournament/home_tournament.js";
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

	let	pagename = url.split("#")[1];
	let found = Object.keys(urlRoutes).includes(pagename);
	if (found)
		urlRoutes[pagename]();
	else
		to_homePage();
}

export function	authCheck()
{
	updateMyInfo();
	//console.log("the bar(path) contains: [" + window.location.pathname + "]");
	//console.log("the bar(search) contains: [" + window.location.search + "]");
	if (getCookie("token") != null && getCookie("token") != "" && getCookie("status") === "online")
	{//add securite
		updateMyInfo(true);
		checkAddress();
		return ("true");
	}
	else
	{
		to_connectForm();
		return ("false");
	}
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
//	console.log("popstate detected");
//	console.log(event.state);
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