import { loadSpinner } from "../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "./upper_panel.js";
import { to_homePage } from "./home_homeboard.js";
import { noticeInvitePlayer, to_game } from "./home_game.js";
import { to_profilePage } from "./home_changeprofile.js";
import { classy_signOut } from "../authentication/auth_connect.js";
import { loadChat } from "../chat/load-chat.js";
import { getTournamentsList } from "../backend_operation/tournament.js";

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
                <th scope="col">Rating</th>
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
	if (tour_list != undefined)
	{
		for (let i = 0; i < tour_list.length; i++)
			addLabel(tour_list, i);
	}
	upperPanelEventListener("tournament");
	document.getElementById("htb_mglass").addEventListener("click", searchLabel);
	callback(true);
}

export function	tourPlayerCount(tour_obj)
{
	let	player_nb = 0;

	while (tour_obj.player_usernames[player_nb])
		player_nb++;
	return (player_nb);
}

function	 addLabel(tour_list, index)
{
//	label_index++;
	//	console.log(`adding new label: ${label_index}`);

	let	player_nb = tourPlayerCount(tour_list[index]);
	let newLabel;
	newLabel = `<tr id="t_tourlabel${index}" class="t_tourlabel">
<th scope="row">${tour_list[index].name}</th>
<td>${player_nb}</td>
<td>${tour_list[index].start_date}/${tour_list[index].start_end}</td>
<td>tour_rating</td>
<td>${tour_list[index].status}</td>
<button id="t_joinbutton">Join</button>
</tr>`;
	document.getElementById("htb_info").insertAdjacentHTML("beforeend", newLabel);
	document.getElementById("t_joinbutton").addEventListener("click", joinTournament(`tour_obj.id`));
}

function 	searchLabel()
{//WIP
	if (document.getElementById("t_search").value !== "")
	{
		let foundLabel = "";
		tournInfo.insertAdjacentHTML("beforeend", foundLabel);
	}
}

export function to_tournament(nohistory = "false")
{
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
