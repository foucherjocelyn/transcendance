import { loadSpinner } from "../../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { noticeInvitePlayer } from "../game/home_game.js";
import { loadChat } from "../../chat/load-chat.js";
import { to_connectForm } from "../../authentication/auth_connect.js";
import { deleteTournament, getTournamentInfoById, getTournamentsList, joinTournament, leaveTournament } from "../../backend_operation/tournament.js";
import { getMyInfo } from "../../backend_operation/get_user_info.js";
import { getCookie } from "../../authentication/auth_cookie.js";
import { notice } from "../../authentication/auth_main.js";
import { to_tournament } from "./home_tournament.js";
import { renderTournamentTree } from "./tournamentTree/tournamentTree.js";
import { client, dataToServer } from "../../client/client.js";
import { addAlias, getAliasFromUsername, removeAlias } from "../../backend_operation/alias.js";

const isRegisteredToUnfinishedTournament = async (username) => {
	let tournaments = await getTournamentsList();
	const unfinishedTournaments = tournaments.filter(tournament => tournament.status !== "finished");
	return (unfinishedTournaments.some(tournament => tournament.player_usernames.find(currentUsername => currentUsername === username)));
}

const isRegisteredToFinishedTournament = async (username) => {
	let tournaments = await getTournamentsList();
	const finishedTournaments = tournaments.filter(tournament => tournament.status === "finished");
	return (finishedTournaments.some(tournament => tournament.player_usernames.find(currentUsername => currentUsername === username)));
}

export async function checkClearMyAlias(my_username) {
	console.log("checkClearMyAlias started");
	const alias = await getAliasFromUsername(my_username)
	if (alias) {
		if (isRegisteredToFinishedTournament(my_username) && !isRegisteredToUnfinishedTournament(my_username)) {
			console.log("user has been found in finished tournament and not in unfinished => removing alias")
			removeAlias();
		}
	}
	return (alias);
}

async function checkTournamentAvailability(tour_obj) {
	await getMyInfo();
	let my_username = getCookie("username");
	if (!my_username) {
		to_connectForm();
		return (false);
	}
	let my_alias = await checkClearMyAlias(my_username);
	if (my_alias && tour_obj.player_usernames.includes(my_username)) {
		return ("can join");
	}
	if (!my_alias && tour_obj.status === "registering") {
		return (true);
	}
	return (false);
}

export async function aliasJoinTournament(tour_obj) {
	let join_status = await checkTournamentAvailability(tour_obj);
	tour_obj = await getTournamentInfoById(tour_obj.id);
	if (join_status === true) {
		document.getElementById("h_tournament_page").innerHTML = `
<div id="h_tournament_aliasjoin">
	<form id="tour_aliasjoiningform">
	<input type="text" id="tour_inputalias" pattern="[a-zA-Z0-9]{3,30}" placeholder="Enter an alias" required>
	<input type="submit" id="tour_inputsend" class="button-img" type="button" value="Confirm">
	<input type="button" id="tour_inputcancel" class="button-img" value="Back">
	</form>
</div>
`;
		document.getElementById("tour_aliasjoiningform").addEventListener("submit", async () => {
			event.preventDefault();
			let alias = {
				"alias": document.getElementById("tour_inputalias").value
			};
			const joined_tour_obj = await joinTournament(tour_obj.id);
			if (joined_tour_obj) {
				await addAlias(alias);
				const send_data = new dataToServer('joining tournament', tour_obj.id, 'socket server');
				client.socket.send(JSON.stringify(send_data));
				to_tournamentWaitingRoom("true", tour_obj);
			}
			else
				notice("Joined tournament not found", 3, "#d1060d");
		});
		document.getElementById("tour_inputcancel").addEventListener("click", () => { to_tournament("false"); });
		return (false);
	}
	else if (join_status === "can join") {
		to_tournamentWaitingRoom("true", tour_obj);
	}
	else if (tour_obj.status === "progressing")
		notice("You cannot join an ongoing tournament", 2, "#cc7314");
	else if (tour_obj.status === "completed")
		notice("This tournament is over", 2, "#cc7314");
	else
		notice("You can only register to one tournament", 3, "#d1060d");
}

function loadTournamentOwnerPanel(tour_obj) {
	let owner_panel = document.querySelector("#twr_owner_panel");
	if (owner_panel) {
		owner_panel.innerHTML = `
		<hr>
		<p id="twr_ownerpanel_info">Owner Panel</p>
		<input type="button" id="twr_owner_start_button" class="button-img" value="Start Tournament">
		<input type="button" id="twr_owner_delete_button" class="button-img" value="Delete Tournament">
		<hr>
	`;
		document.getElementById("twr_owner_start_button").addEventListener("click", async () => {
			console.log(tour_obj.player_usernames.length);
			if (tour_obj.player_usernames.length <= 1) {
				notice("A tournament must have more than 1 player to start", 2, "#9e7400");
			}
			else if (tour_obj.status === "registering") {
				const sendData = new dataToServer('start tournament', tour_obj.id, 'socket server');
				client.socket.send(JSON.stringify(sendData));
			}
			else if (tour_obj.status === "progressing") {
				notice("This tournament has already started", 2, "#9e7400");
			}
			else if (tour_obj.status === "finished") {
				notice("This tournament is over", 2, "#bd0606");
			}
		});
		document.getElementById("twr_owner_delete_button").addEventListener("click", async () => {
			if (tour_obj.status === "registering") {
				console.log("deleting tournament....");
				
				//console.log(tour_obj);
				// const send_data = new dataToServer('delete alias', tour_obj.id, 'socket server');
				// client.socket.send(JSON.stringify(send_data));

				await deleteTournament(tour_obj.id);
				console.log("deleting complete.");
			}
			else {
				notice("You cannot delete an ongoing tournament", 2, "#d11706");
			}
		});
	}
}

async function detailsTournamentPlayers(tour_obj, html_id_element) {
	tour_obj = await getTournamentInfoById(tour_obj.id);
	let player_nb = tour_obj.player_usernames.length;
	document.getElementById(html_id_element).innerHTML = `
<div id="tournament_player_details">
	<div id="tpd_details_header">
		<button id="tpd_close"></button>
		<h3>Player List</h3>
		<hr>
	</div>
</div>
	`;
	for (let i = 0; i < player_nb; i++) {
		let alias = await getAliasFromUsername(tour_obj.player_usernames[i]);
		document.getElementById("tournament_player_details").insertAdjacentHTML("beforeend", `
			<p>${alias}</p>
			`);
	}
	document.getElementById(`tpd_close`).addEventListener("click", () => { document.getElementById("tournament_player_details").outerHTML = ``; });
}

export async function refresh_tour_waiting_room(tour_obj, mode) {
	if (document.querySelector("#tournament_waiting_room")) {
		tour_obj = await getTournamentInfoById(tour_obj.id);
		renderTournamentTree(tour_obj.id);
		document.getElementById("twr_tour_name").textContent = `Tournament Name : ${tour_obj.name} #${tour_obj.id}`;
		document.getElementById("twr_tour_description").textContent = `Description : ${tour_obj.description}`;
		document.getElementById("twr_tour_playernb").textContent = `Registered players : ${tour_obj.player_usernames.length}/${tour_obj.max_players}`;
		document.getElementById("twr_tour_status").textContent = `Status : ${tour_obj.status}`;
	}
	if (!mode && getCookie("alias") && tour_obj.owner_username === getCookie("username"))
		loadTournamentOwnerPanel(tour_obj);
}

async function drawWaitingRoom(callback, tour_obj, mode) {
	document.getElementById("frontpage").outerHTML =
		`
		<div id="frontpage">
			${loadSpinner()}
			${upperPanel()}
			<div id="tournament_waiting_room" class="hide">
				<div id="twr_board">
					<div id="twr_basic_info">
					<p id="twr_tour_name"></p>
					<p id="twr_tour_description"></p>
					<p id="twr_tour_start"></p>
					<p id="twr_tour_playernb"></p>
					<button id="tour_details_more"></button>
					<div id="twr_player_details"></div>
					<p id="twr_tour_status"></p>
					</div>
					<div id="tournament_tree"></div>
				</div>
			</div>
			<br>
			<div id="chat"></div>
			<div class="r_successinfo hide"></div>
			${noticeInvitePlayer()}
		</div>
`;
	await refresh_tour_waiting_room(tour_obj, mode);

	document.getElementById(`tour_details_more`).addEventListener("click", async () => { await detailsTournamentPlayers(tour_obj, "twr_player_details"); });
	if (mode && mode === "spectator") {
		document.getElementById("twr_board").insertAdjacentHTML("beforeend", `
			<input type="button" id="twr_back" class="button-img" value="Back">
			`);
	}
	else {
		document.getElementById("twr_board").insertAdjacentHTML("beforeend", `
			<div id="twr_owner_panel"></div>
					<!-- <input type="button" id="twr_refresh_tour" class="button-img" value="Refresh"> -->
					<br>
					<input type="button" id="twr_leave" class="button-img" value="Unregister">
					<input type="button" id="twr_back" class="button-img" value="Back">
					`);
		if (tour_obj.owner_username === getCookie("username"))
			loadTournamentOwnerPanel(tour_obj);
		document.querySelector("#twr_leave").addEventListener("click", async () => {
			if (tour_obj.status === "registering") {
				await removeAlias();
				await leaveTournament(tour_obj.id);
				const send_data = new dataToServer('joining tournament', tour_obj.id, 'socket server');
				client.socket.send(JSON.stringify(send_data));
				to_tournament("false");
			}
			else {
				notice("You cannot leave a tournament once it has started", 2, "#d11706")
			}
		});
	}

	document.querySelector("#twr_back").addEventListener("click", () => {
		to_tournament("false");
	});
	upperPanelEventListener();
	callback(true);
}

export async function to_tournamentWaitingRoom(nohistory = "false", tour_obj, mode) {
	await getMyInfo();
	if (!getCookie("username")) {
		to_connectForm();
	}
	if (nohistory === "false")
		history.pushState({ url: `room#${tour_obj.id}` }, "", `#room#${tour_obj.id}`);//temp, route not available
	if (!tour_obj) {
		console.log("to_tournamentWaitingRoom need an a tour_obj");
		return;
	}
	console.log("waitingroom = " + getCookie("alias"));
	await drawWaitingRoom((result) => {
		if (result) {
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("tournament_waiting_room").classList.remove("hide");
			loadChat();
			document.querySelector("#c-hide-friend-list").click();
		}
	}, tour_obj, mode);
}
