import { loadSpinner } from "../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "./upper_panel.js";
import { noticeInvitePlayer } from "./home_game.js";
import { loadChat } from "../chat/load-chat.js";
import { getTournamentsList, joinTournament } from "../backend_operation/tournament.js";
import { getMyInfo } from "../backend_operation/get_user_info.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { to_connectForm } from "../authentication/auth_connect.js";
import { join_the_tournament } from "../createMatch/createMatch.js";

async function drawTournament(callback)
{
	document.getElementById("frontpage").outerHTML =
		`<div id="frontpage">
			${loadSpinner()}
			${upperPanel()}
			<div id="h_tournament_page" class="hide">
				<div id="h_tournament_board">
					<div class="t_sort_head">
				<input id="htb_search" name="search" type="text" placeholder="Search for a Tournament">
	            <button type="button" id="htb_mglass" name="mglass"></button>
       		    <select id="htb_dropdown" name="options">
	              <option value="upcoming" selected>Upcoming</option>
       		      <option value="ongoing">Ongoing</option>
           		  <option value="finished">Finished</option>
	            </select>
       				</div>
	        <hr id="htb_sep" name="t_sep" class="t_separator">
    	    <table id="t_tournament">
            <thead>
              <tr id="htb_filter">
                <th scope="col">Match Name</th>
				<th scope="col">Player</th>
                <th scope="col">Time</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody id="htb_info">
            </tbody>
          </table>
				</div>
			</div>
			<br>
			<div id="chat"></div>
			<div class="r_successinfo hide"></div>
			${noticeInvitePlayer()}
		</div>
`;
	let tour_list = await getTournamentsList();

	//temp tournament object
	tour_list = {
		0: {
			name: "test_tournament",
			max_players: "10",
			start_date: "07/07",
			end_date: "08/07",
			status: "preparing",
			player_usernames: ["imaplayer", "user2"]
		},
		length: 1
	};
	//temp
	console.log("tour_list is undefined");
	if (tour_list != undefined)
	{
		console.log("tour_list is defined");
		console.log(tour_list.length);
		for (let i = 0; i < tour_list.length; i++)
			addLabel(tour_list, i);
	}
	upperPanelEventListener("tournament");
	document.getElementById("htb_mglass").addEventListener("click", searchLabel);
	callback(true);
}

function	aliasJoinTournament(tour_obj)
{
	//create an alias
	document.getElementById("h_tournament_page").innerHTML = `
<div id="h_tournament_aliasjoin">
	<input type="text" id="tour_inputalias" placeholder="Enter an alias" required>
	<input type="submit" class="button-img" type="button" id="tour_inputsend" value="Confirm">
	<input type="button" id="tour_inputcancel" class="button-img" value="Back">
</div>
`;
//	/*Send the following to alias handler
	  document.getElementById("tour_inputsend").addEventListener("click", () => {
		  event.preventDefault();
		  console.log("submit alias detected");
		  join_the_tournament(document.getElementById("tour_inputalias").value, tour_obj.id);
		  joinTournament(tour_obj.id);
	  });
	document.getElementById("tour_inputcancel").addEventListener("click", () => { to_tournament(); });
	//*/
}

function	detailsTournament(tour_obj, index)
{
	console.log("Here is the tour_obj");
	console.log(tour_obj);
	let	player_nb = tour_obj.player_usernames.length;
	document.getElementById("tour_expanddetails").innerHTML = `
<div id="tour_detailsbox">
<button id="tour_details_close"></button>
<p id="tour_details_name"></p>
<p id="tour_details_players"></p>
<p id="tour_details_startdate"></p>
<p id="tour_details_enddate"></p>
<p id="tour_details_status"></p>
</div>
`;
	document.getElementById(`tour_details_name`).textContent = `Name: ${tour_obj.name}`;
	document.getElementById(`tour_details_players`).textContent = `Nb of players: ${player_nb}/${tour_obj.max_players}`;
	document.getElementById(`tour_details_startdate`).textContent = `Starting: ${tour_obj.start_date}`;
	document.getElementById(`tour_details_enddate`).textContent = `Ending: ${tour_obj.end_date}`;
	document.getElementById(`tour_details_status`).textContent = `Status: ${tour_obj.status}`;
	document.getElementById(`tour_details_close`).addEventListener("click", () => { document.getElementById(`tour_detailsbox`).outerHTML = ``; });
}

function	 addLabel(tour_list, index)
{
//	label_index++;
	//	console.log(`adding new label: ${label_index}`);

	//console.table(tour_list[0]);
	let	player_nb = tour_list[index].player_usernames.length;
	let newLabel;
	newLabel = `<tr id="t_tourlabel${index}">
<th scope="row">${tour_list[index].name}</th>
<td>${player_nb}/${tour_list[index].max_players}</td>
<td>${tour_list[index].start_date}/${tour_list[index].end_date}</td>
<td>${tour_list[index].status}</td>
<td><button id="t_joinbutton${index}">Join</button></td>
<td><button id="t_infobutton${index}">Details</button></td>
<div id="tour_expanddetails"></div>
</tr>`;
	document.getElementById("htb_info").insertAdjacentHTML("beforeend", newLabel);
	document.getElementById(`t_joinbutton${index}`).addEventListener("click", () => { aliasJoinTournament(tour_list[index]); });
	document.getElementById(`t_infobutton${index}`).addEventListener("click", () => { detailsTournament(tour_list[index], index); });
}

function 	searchLabel()
{//WIP
	if (document.getElementById("t_search").value !== "")
	{
		let foundLabel = "";
		tournInfo.insertAdjacentHTML("beforeend", foundLabel);
	}
}

export async function to_tournament(nohistory = "false")
{
	await getMyInfo();
	if (!getCookie("username"))
	{
		to_connectForm();
		return ;
	}
	if (nohistory === "false")
		history.pushState( { url: "tournament" }, "", "#tournament");
	drawTournament( (result) => {
		if (result)
		{
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("h_tournament_page").classList.remove("hide");
			loadChat();
		}
	});
}
