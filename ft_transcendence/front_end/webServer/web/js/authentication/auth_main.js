import { to_homePage } from "../home/home_homeboard.js";
import { to_game } from "../home/game/home_game.js";
import { to_profilePage } from "../home/profile/home_changeprofile.js";
import { to_tournament } from "../home/tournament/home_tournament.js";
import { to_connectForm } from "./auth_connect.js";
import { to_regisForm } from "./auth_register.js";
import { getCookie } from "./auth_cookie.js";
import { updateMyInfo } from "../backend_operation/data_update.js";
import { getMyInfo } from "../backend_operation/get_user_info.js";
import { client, dataToServer } from "../client/client.js";

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

export async function	authCheck()
{
	await updateMyInfo();
	const url = window.location.search;
	///*
	if (url.startsWith("?login42=true"))
		{
			// const params = new URLSearchParams(url);
			// const token = params.get("token");
			// console.log(token);
			// document.cookie = `token=${token}; SameSite=Strict`;
			await getMyInfo();
			const sendData = new dataToServer('connection_42', "", 'socket server');
			client.socket.send(JSON.stringify(sendData));
			console.log(window.location.search);
			window.location.search = "";
		}
	//*/
	//console.log("the bar(path) contains: [" + window.location.pathname + "]");
	//console.log("the bar(search) contains: [" + window.location.search + "]");
	if (getCookie("token") != null && getCookie("token") != "" /*&& getCookie("status") === "online"*/)
	{//add securite
		await updateMyInfo(true);
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