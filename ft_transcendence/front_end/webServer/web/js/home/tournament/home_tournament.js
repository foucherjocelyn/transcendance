import { loadSpinner } from "../../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { noticeInvitePlayer } from "../game/home_game.js";
import { loadChat } from "../../chat/load-chat.js";
import { createTournament, getTournamentsList } from "../../backend_operation/tournament.js";
import { getMyInfo } from "../../backend_operation/get_user_info.js";
import { getCookie } from "../../authentication/auth_cookie.js";
import { to_connectForm } from "../../authentication/auth_connect.js";
import { to_aliasTournament } from "./home_tournament_room.js";
import { notice } from "../../authentication/auth_main.js";
//import { renderTournamentTree } from "./tournamentTree/tournamentTree.js";

export function aliasJoinTournament() {
	console.log("User is going in tournament page, requesting alias");
		document.getElementById("h_tournament_page").innerHTML = `
<div id="h_tournament_aliasjoin">
	<p id="tour_inputalias_info">To participate in a tournament, you must enter an alias</p>
	<input type="text" id="tour_inputalias" placeholder="Enter an alias" required>
	<input type="submit" id="tour_inputsend" class="button-img" type="button" value="Confirm">
</div>
`;
		document.getElementById("tour_inputsend").addEventListener("click", () => {
			event.preventDefault();
			console.log("sending alias, to_tournament waiting room from aliasJointournament");
			let alias = {
				"alias": document.getElementById("tour_inputalias").value
			};
			addAlias(alias);
			to_tournament("false");
		});
}

function addLabel(tour_list, index) {
	//	label_index++;
	//	console.log(`adding new label: ${label_index}`);

	//console.table(tour_list[0]);
	let player_nb = tour_list[index].player_usernames.length;
	let newLabel;
	newLabel = `<tr id="t_tourlabel${index}">
<th scope="row">${tour_list[index].name}</th>
<td>${player_nb}/${tour_list[index].max_players}</td>
<td>${formatDate(tour_list[index].start_time, 1)}</td>
<td>${tour_list[index].status}</td>
<td><input type="button" id="t_joinbutton${index}" class="button-img" value="Join"></td>
<!-- <td><input type="button" id="t_infobutton${index}" value="Details"></td> -->
<div id="tour_expanddetails"></div>
</tr>`;
	document.getElementById("htb_info").insertAdjacentHTML("beforeend", newLabel);
	document.getElementById(`t_joinbutton${index}`).addEventListener("click", () => { to_aliasTournament(tour_list[index]); });
	//document.getElementById(`t_infobutton${index}`).addEventListener("click", () => { detailsTournament(tour_list[index], index); });
}

/* Sorting tournament  */

async function sortThisTable(tour_list, sort_type) {
	document.getElementById("htb_info").innerHTML = "";

	if (tour_list != undefined) {
		console.log(tour_list.length);
		let i = 0;
		for (; i < tour_list.length; i++) {
			if (sort_type === tour_list[i].status)
				addLabel(tour_list, i);
		}
	}
}

function searchLabel(tour_list, search_value) {
	document.getElementById("htb_info").innerHTML = "";
	if (document.getElementById("htb_search").value !== "") {

		if (tour_list != undefined) {
			console.log(tour_list.length);
			let i = 0;
			for (; i < tour_list.length; i++) {
				if (tour_list[i].name.startsWith(search_value))
					addLabel(tour_list, i);
			}
		}
	}
	else {
		for (let i = 0; i < tour_list.length; i++)
			addLabel(tour_list, i);
	}
}

/* Get Date  */

export function formatDate(given_date, bool_format) {
	let formatted_date = given_date.replace("T", " ");
	if (!bool_format)
		formatted_date = formatted_date + ":00";
	else if (bool_format) {
		formatted_date = formatted_date.replace("Z", "");
	}
	return (formatted_date);
}

function getToday(add_minute) {
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth() + 1;
	month = month < 10 ? "0" + month : month;
	let day = today.getDate();
	day = day < 10 ? "0" + day : day;
	let hours = today.getHours();
	hours = hours < 10 ? "0" + hours : hours;
	let minute = today.getMinutes();
	minute = minute < 10 ? "0" + minute : minute;
	if (!isNaN(add_minute))
		minute += add_minute;
	let min_date = year + "-" + month + "-" + day + "T" + hours + ":" + minute;
	return (min_date);
}

/* Tournament Creation */

function tournamentCreateCheck(tour_list_name, newtour_obj) {
	console.log("checking date: " + newtour_obj.start_time);
	if (newtour_obj.start_time === '' || newtour_obj.start_time === null) {
		notice("No planned starting date set", 2, "#d6460d");
		return (false);
	}
	if (newtour_obj.start_time <= getToday()) {
		notice("The tournament you will create will start too soon", 2, "#d6460d");
		return (false);
	}
	for (let i = 0; i < tour_list_name.length; i++) {
		console.log("tour_list_name[" + i + "] = " + tour_list_name[i]);
		if (tour_list_name[i] === document.getElementById("hcm_name").value) {
			notice("A tournament with this name already exists", 2, "#d6460d");
			return (false);
		}
	}
	return (true);
}

function createTournamentInput(tour_list_name) {
	console.log("createTournamentInput started :" + tour_list_name);
	let min_date = getToday(5);
	document.getElementById("htb_create").innerHTML = `
	<form method="post" id="htb_create_menu">
		<input type="button" id="hcm_create_menu_close">
		<br>
		<input id="hcm_name" type="text" placeholder="Name" maxlength="30" required>
		<input id="hcm_description" type="text" placeholder="Description (optional)" maxlength="320">
		<input id="hcm_start" type="datetime-local" min="${min_date}" max="2150-12-31T23:59" required>
		<br>
		<input id="hcm_create_menu_create" type="submit" value="Create" class="button-img">
	</form>
`;
	document.getElementById(`hcm_create_menu_create`).addEventListener("click", function (event) {
		event.preventDefault();
		let newtour_obj = {
			name: document.getElementById("hcm_name").value,
			description: document.getElementById("hcm_description").value,
			start_time: document.getElementById("hcm_start").value
		};
		if (tournamentCreateCheck(tour_list_name, newtour_obj) === true) {
			newtour_obj.start_time = formatDate(document.getElementById("hcm_start").value);
			createTournament(newtour_obj);
			document.getElementById(`htb_create_menu`).outerHTML = ``;
			to_tournament("true");
		}
	});
	document.getElementById(`hcm_create_menu_close`).addEventListener("click", () => { document.getElementById(`htb_create_menu`).outerHTML = ``; });
}

/* Tournament HTML / Browsing */

async function drawTournament(callback) {
	document.getElementById("frontpage").outerHTML =
		`<div id="frontpage">
			${loadSpinner()}
			${upperPanel()}
			<div id="h_tournament_page" class="hide">
				<div id="h_tournament_board">
					<div class="t_sort_head">
				<input id="htb_search" name="search" type="text" placeholder="Search for a Tournament">
       		    <select id="htb_dropdown" name="options">
	              <option value="registering" selected>Upcoming</option>
       		      <option value="progressing">Ongoing</option>
           		  <option value="finished">Completed</option>
	            </select>
       				</div>
	        <hr id="htb_sep" name="t_sep" class="t_separator">
    	    <table id="t_tournament">
            <thead>
              <tr id="htb_filter">
                <th scope="col">Match Name</th>
				<th scope="col">Player</th>
                <th scope="col">Planned Starting Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody id="htb_info">
            </tbody>
          </table>
		  <hr>
		  <input id ="htb_create_button" class="button-img" type="button" value="Create tournament">
		  <div id="htb_create"></div>
		  <div id="tournament_tree"></div>
				</div>
			</div>
			<br>
			<div id="chat"></div>
			<div class="r_successinfo hide"></div>
			${noticeInvitePlayer()}
		</div>
`;
	let tour_list = await getTournamentsList();
	let tour_list_name = [];

	if (tour_list != undefined) {
		for (let i = 0; i < tour_list.length; i++) {
			tour_list_name.push(tour_list[i].name);
			addLabel(tour_list, i);
		}
	}
	upperPanelEventListener("tournament");
	document.getElementById("htb_create_button").addEventListener("click", () => {
		createTournamentInput(tour_list_name);
	});
	document.getElementById("htb_dropdown").addEventListener("change", () => {
		sortThisTable(tour_list, document.querySelector('#htb_dropdown').value);
	});
	document.getElementById("htb_search").addEventListener("input", () => {
		searchLabel(tour_list, document.querySelector('#htb_search').value);
	});
	callback(true);
}

/*
function detailsTournament(tour_obj) {
	//console.log("Here is the tour_obj");
	//console.log(tour_obj);
	let player_nb = tour_obj.player_usernames.length;
	document.getElementById("tour_expanddetails").innerHTML = `
<div id="tour_detailsbox">
<button id="tour_details_close"></button>
<p id="tour_details_name"></p>
<p id="tour_details_players"></p>
<p id="tour_details_startdate"></p>
<p id="tour_details_enddate"></p>
<p id="tour_details_status"></p>
<!-- <td><button id="t_treebutton">Tree</button></td> -->
</div>
`;
	//document.getElementById(`t_treebutton`).addEventListener("click", () => { renderTournamentTree(tour_obj); });
	document.getElementById(`tour_details_name`).textContent = `Name: ${tour_obj.name}`;
	document.getElementById(`tour_details_players`).textContent = `Nb of players: ${player_nb}/${tour_obj.max_players}`;
	document.getElementById(`tour_details_startdate`).textContent = `Starting: ${tour_obj.start_time}`;
	document.getElementById(`tour_details_enddate`).textContent = `Ending: ${tour_obj.end_date}`;//Remove?
	document.getElementById(`tour_details_status`).textContent = `Status: ${tour_obj.status}`;
	document.getElementById(`tour_details_close`).addEventListener("click", () => { document.getElementById(`tour_detailsbox`).outerHTML = ``; });
}
*/

export async function to_tournament(nohistory = "false") {
	await getMyInfo();
	if (!getCookie("username")) {
		to_connectForm();
		return;
	}
	if (nohistory === "false")
		history.pushState({ url: "tournament" }, "", "#tournament");
	drawTournament((result) => {
		if (result) {
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("h_tournament_page").classList.remove("hide");
			loadChat();
		}
	});
}
