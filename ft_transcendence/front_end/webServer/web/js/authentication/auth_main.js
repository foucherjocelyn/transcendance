import { to_homePage } from "../home/home_homeboard.js";
import { to_game } from "../home/game/home_game.js";
import { to_profilePage } from "../home/profile/home_changeprofile.js";
import { to_tournament } from "../home/tournament/home_tournament.js";
import { to_connectForm } from "./auth_connect.js";
import { to_regisForm } from "./auth_register.js";
import { openSocketClient } from "../backend_operation/authentication.js";
import { getMyInfo } from "../backend_operation/get_user_info.js";
import { client, dataToServer } from "../client/client.js";

export function notice(str, time, color) {
	const messageInform = document.querySelector(".r_successinfo");
	messageInform.style.color = color;
	messageInform.innerText = str;
	messageInform.classList.remove("hide");
	let cdId = setInterval(function () {
		if (time === -1) {
			messageInform.classList.add("hide");
			clearInterval(cdId);
		}
		messageInform.innerText = str + " (" + time + ")";
		time--;
	}, 1000);
}

function checkAddress() {
	let url = window.location.href;

	let pagename = url.split("#")[1];
	let found = Object.keys(urlRoutes).includes(pagename);
	if (found)
		urlRoutes[pagename]();
	else
		to_homePage();
}

export async function authCheck() {
	let connected = await getMyInfo();
	if (connected) {
		openSocketClient();
		checkAddress();
	}
	else {
		to_connectForm("true");
	}
}

const urlRoutes = {
	connection: () => to_connectForm("true"),
	register: () => to_regisForm("true"),
	homepage: () => to_homePage("true"),
	config_profile: () => to_profilePage("true"),
	game: () => to_game("true"),
	tournament: () => to_tournament("true")
};

window.onpopstate = function (event) {
	const createMatchLayer = document.getElementById('createMatchLayer');
	const gameLayer = document.getElementById('gameLayer');
	if (createMatchLayer || gameLayer) {
		const sendData = new dataToServer('leave match', '', 'socket server');
		client.socket.send(JSON.stringify(sendData));
	}

	if (event.state) {
		let url = event.state.url;
		if (url) {
			urlRoutes[url]();
		}
	}
	else
		authCheck();
};
