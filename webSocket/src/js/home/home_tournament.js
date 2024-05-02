import { loadSpinner } from "../authentication/spinner.js";
import { upperPanel } from "./home_homeboard.js";
import { to_homePage } from "./home_homeboard.js";
import { to_game } from "./home_game.js";
import { to_profilePage } from "./home_changeprofile.js";

function drawTournament(callback)
{
	document.getElementById("frontpage").outerHTML =
		`<div id="frontpage">
			${loadSpinner()}
			${upperPanel()}
				<div id="h_tournament_page" class="hide">
					<div id="h_tournament_board">\
						<div class="t_sort_head">\
					<input id="htb_search" name="search" type="text" placeholder="Search for a Tournament">\
		            <button type="button" id="htb_mglass" name="mglass"></button>\
        		    <select id="htb_dropdown" name="options">\
		              <option value="upcoming" selected>Upcoming</option>\
        		      <option value="ongoing">Ongoing</option>\
             		  <option value="finished">Finished</option>\
		            </select>\
        				</div>\
          <hr id="htb_sep" name="t_sep" class="t_separator">\
          <table id="t_tournament">\
            <thead>\
              <tr id="htb_filter">\
                <th scope="col">Match Name</th>\
				<th scope="col">Player</th>\
                <th scope="col">Time</th>\
                <th scope="col">Rating</th>\
              </tr>\
            </thead>\
            <tbody id="htb_info">\
            </tbody>\
          </table>\
          <button class="button-img" type="button" id="htb_temp" name="temp">Add label (debug)</button>\
				</div>
			</div>
		</div>
<div class="r_successinfo hide"></div>`;
	document.getElementById("h_to_home").addEventListener("click", () => { to_homePage(); });
	document.getElementById("h_to_game").addEventListener("click", to_game);
	document.getElementById("h_to_myprofile").addEventListener("click", to_profilePage);
	document.getElementById("h_logout").addEventListener("click", () => { classy_signOut("h_tournament_page"); });
	document.getElementById("htb_temp").addEventListener("click", addLabel);
	document.getElementById("htb_mglass").addEventListener("click", searchLabel);
	callback(true);
}

function	 addLabel()
{
//	label_index++;
//	console.log(`adding new label: ${label_index}`);
	let newLabel;
	newLabel = `<tr class="t_tourlabel">
<th scope="row">tour_name</th>
<td>tour_playernb</td>
<td>tour_time</td>
<td>tour_rating</td>
<button id="t_joinbutton">Join</button>
</tr>`;
	document.getElementById("htb_info").insertAdjacentHTML("beforeend", newLabel);
}

function 	searchLabel()
{
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
		}
	});
}
