import { loadSpinner } from "../../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { noticeInvitePlayer } from "../game/home_game.js";
import { loadChat } from "../../chat/load-chat.js";
import { to_connectForm } from "../../authentication/auth_connect.js";
import { deleteTournament, joinTournament, leaveTournament, setChampionTournament, startTournament } from "../../backend_operation/tournament.js";
import { getMyInfo } from "../../backend_operation/get_user_info.js";
import { getCookie } from "../../authentication/auth_cookie.js";
import { notice } from "../../authentication/auth_main.js";
import { formatDate, to_tournament } from "./home_tournament.js";
import { renderTournamentTree } from "./tournamentTree/tournamentTree.js";
import { client, dataToServer } from "../../client/client.js";

async function checkTournamentAvailability(tour_obj) {
	console.log("checkTournamentAvailability started");
	console.log("tour_obj start here");
	console.log(tour_obj);
	let my_username = getCookie("username");
	//let my_username = getAlias("username");
	if (!my_username) {
		to_connectForm();
		return (false);
	}
	if (!tour_obj.player_usernames.includes(my_username) && tour_obj.status === "registering") {
		joinTournament(tour_obj.id);
		return (true);
	}
	else if (tour_obj.player_usernames.includes(my_username)) {
		return ("can join");
	}
	return (false);
}

export async function aliasJoinTournament(tour_obj) {
	console.log("User is joining, requesting alias");
	let join_status = await checkTournamentAvailability(tour_obj);
	if (join_status === true) {
		document.getElementById("h_tournament_page").innerHTML = `
<div id="h_tournament_aliasjoin">
	<input type="text" id="tour_inputalias" placeholder="Enter an alias" required>
	<input type="submit" class="button-img" type="button" id="tour_inputsend" value="Confirm">
	<input type="button" id="tour_inputcancel" class="button-img" value="Back">
</div>
`;
		document.getElementById("tour_inputsend").addEventListener("click", () => {
			event.preventDefault();
			//start_tournament(document.getElementById("tour_inputalias").value, tour_obj.id); //  Join the tournament with an alias in client side
			to_tournamentWaitingRoom("true", tour_obj);
		});
		document.getElementById("tour_inputcancel").addEventListener("click", () => { to_tournament("false"); });
		return (false);
	}
	else if (join_status === "can join")
		to_tournamentWaitingRoom("true", tour_obj);
	else if (tour_obj.status === "progressing")
		notice("You cannot join an ongoing tournament", 2, "#cc7314");
	else if (tour_obj.status === "completed")
		notice("This tournament is over", 2, "#cc7314");
	else
		notice("An error occured when trying to join this tournament", 3, "#d1060d");
}

function loadTournamentOwnerPanel(tour_obj) {
	document.querySelector("#twr_owner_panel").innerHTML = `
		<hr>
		<p id="twr_ownerpanel_info">Owner Panel</p>
		<input type="button" id="twr_owner_start_button" class="button-img" value="Start Tournament">
		<input type="button" id="twr_owner_delete_button" class="button-img" value="Delete Tournament">
		<hr>
	`;
	document.getElementById("twr_owner_start_button").addEventListener("click", () => {
		if (tour_obj.status === "registering") {
			// startTournament(tour_obj.id);
			// Start Tournament here
			const sendData = new dataToServer('start tournament', tour_obj.id, 'socket server');
			client.socket.send(JSON.stringify(sendData));
			notice("The tournament has now started", 2, "#00a33f");
		}
		else {
			notice("This tournament has already started", 2, "#9e7400");
		}
	});
	document.getElementById("twr_owner_delete_button").addEventListener("click", () => {
		if (tour_obj.status === "registering") {
			deleteTournament(tour_obj.id);
			to_tournament("false");
		}
		else {
			notice("You cannot delete an ongoing tournament", 2, "#d11706");
		}
	});
}

function detailsTournamentPlayers(tour_obj, html_id_element) {
	let player_nb = tour_obj.player_usernames.length;
	document.getElementById(html_id_element).innerHTML = `
	<div id="tournament_player_details">
	<button id="tpd_close"></button>
	</div>
	`;
	for (let i = 0; i < player_nb; i++)
		{
			document.getElementById("tournament_player_details").insertAdjacentHTML("beforeend", `
			<p>${tour_obj.player_usernames[i]}</p>
			<br>
			`);
		}
	document.getElementById(`tpd_close`).addEventListener("click", () => { document.getElementById("tournament_player_details").outerHTML = ``; });
}

async function drawWaitingRoom(callback, tour_obj) {
	document.getElementById("frontpage").outerHTML =
		`<div id="frontpage">
			${loadSpinner()}
			${upperPanel()}
			<div id="tournament_waiting_room" class="hide">
				<div id="twr_board">
					<p id="twr_tour_name"></p>
					<p id="twr_tour_description"></p>
					<p id="twr_tour_start"></p>
					<p id="twr_tour_playernb"></p><button id="tour_details_more">...</button>
					<div id="twr_player_details"></div>
					<p id="twr_tour_status"></p>
					<input type="button" id="twr_refresh_tree" class="button-img" value="Refresh tree">
					<div id="tournament_tree"></div>
					<div id="twr_owner_panel"></div>
					<input type="button" id="twr_ready" class="button-img" value="Ready">
					<br>
					<input type="button" id="twr_leave" class="button-img" value="Leave tournament">
					<input type="button" id="twr_back" class="button-img" value="Back">
				</div>
			</div>
			<br>
			<div id="chat"></div>
			<div class="r_successinfo hide"></div>
			${noticeInvitePlayer()}
		</div>
`;
	renderTournamentTree(tour_obj);
	//add refresh button for tournament tree, only shows it when the tournament is confirmed
	document.getElementById("twr_refresh_tree").addEventListener("click", () => { renderTournamentTree(tour_obj); });
	document.getElementById(`tour_details_more`).addEventListener("click", () => { detailsTournamentPlayers(tour_obj, "twr_player_details"); });
	document.getElementById("twr_tour_name").textContent = `Tournament Name : ${tour_obj.name} #${tour_obj.id}`;
	document.getElementById("twr_tour_description").textContent = `Description : ${tour_obj.description}`;
	document.getElementById("twr_tour_start").textContent = `Starting date : ${formatDate(tour_obj.start_time, 1)}`;
	document.getElementById("twr_tour_playernb").textContent = `Registered players : ${tour_obj.player_usernames.length}/${tour_obj.max_players}`;
	document.getElementById("twr_tour_status").textContent = `Status : ${tour_obj.status}`;
	if (tour_obj.owner_username === getCookie("username"))
		loadTournamentOwnerPanel(tour_obj);
	document.querySelector("#twr_ready").addEventListener("click", () => {
		console.log("Ready confirmed");
		//ready up user: if match is progressing then make the players available for matchmaking
	});
	document.querySelector("#twr_back").addEventListener("click", () => {
		to_tournament("false");
	});
	document.querySelector("#twr_leave").addEventListener("click", () => {
		if (tour_obj.status === "registering") {
			leaveTournament(tour_obj.id);
			to_tournament("false");
		}
		else {
			//send warning and disqualify if continue?
			notice("You cannot leave a tournament once it has started", 2, "#d11706")
		}
	});
	upperPanelEventListener();
	callback(true);
}

export async function to_tournamentWaitingRoom(nohistory = "false", tour_obj) {
	await getMyInfo();
	if (!getCookie("username")) {
		to_connectForm();
	}
	if (nohistory === "false")
		history.pushState({ url: `room#${tour_obj.id}` }, "", `#room#${tour_obj.id}`);//Must add route to handle this
	if (!tour_obj) {
		console.log("to_tournamentWaitingRoom need an a tour_obj");
		return;
	}
	drawWaitingRoom((result) => {
		if (result) {
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("tournament_waiting_room").classList.remove("hide");
			loadChat();
		}
	}, tour_obj);
}
