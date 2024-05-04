import { loadSpinner } from "../authentication/spinner.js";
import { to_game } from "./home_game.js";
import { to_tournament } from "./home_tournament.js";
import { to_profilePage } from "./home_changeprofile.js";
import { updateMyInfo } from "../backend_operation/get_user_info.js";
import { getAvatar } from "../backend_operation/profile_picture.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { classy_signOut } from "../authentication/auth_connect.js";
import { loadChat } from "../chat/load-chat.js";
import { openSocketClient } from "../backend_operation/authentication.js";

export function upperPanel()
{
	let panel_def = `<nav class="h_upperpanel">
				<button id="h_to_home" name="to_homepage"></button>
				<button id="h_to_game" name="to_game"></button>
				<button id="h_to_tournament" name="to_tournament"></button>
				<button id="h_to_myprofile" name="to_myprofile"></button>
				<button id="h_logout" name="logout"></button>
			</nav>`;
	return (panel_def);
}

function	 newLabel()//
{
	let label;
	label = `<tr class="h_scorelabel">
<th scope="row">username</th>
<td>level</td>
<td>nb_games</td>
<td>avg_score</td>
</tr>`;
	document.getElementById("hs_info").insertAdjacentHTML("beforeend", newLabel);
	return (label);
}

function	drawHomePage(callback)
{
	console.log("drawHomepage called");
	document.getElementById("frontpage").outerHTML =
		`
<div id="frontpage">
	${loadSpinner()}
	${upperPanel()}
	<div id="h_homepage" class="hide">
		<div id="h_player_bar">
				<img id="hpb_player_img" src="../../img/avatar/avatar_default.png">
				<p id="hpb_username">${getCookie("username")}</p>
				<p id="hpb_level">Level: ${getCookie("level")}</p>
      </div>
			<div id="h_scoreboard">
			<table id="h_score">
    	    <thead>
              <tr id="hs_filter">\<!-- display in red or blue if defeat/victory  -->
				<th scope="col">Player name</th>
                <th scope="col">Level</th>
                <th scope="col">Number of games played</th>
				<th scope="col">Average score</th>
<!-- Display player stats  -->
              </tr>
            </thead>
            <tbody id="hs_info">
            </tbody>
          </table>
			</div>
	</div>
	<div id="chat"></div>
	<div class="r_successinfo hide"></div>
</div>
`;

	//load players scoreboard
//	console.log("loading player list");
//	getUserList();
	//
	document.getElementById("h_to_game").addEventListener("click", to_game);
	document.getElementById("h_to_tournament").addEventListener("click", to_tournament);
	document.getElementById("h_to_myprofile").addEventListener("click", to_profilePage);
	document.getElementById("h_logout").addEventListener("click", () =>
		{
			classy_signOut("h_homepage");
		});
	if (document.getElementById("loadspinner") !== undefined
		&& document.getElementById("h_homepage") !== undefined
		&& document.getElementById("loadspinner") !== null
		&& document.getElementById("h_homepage") !== null)
	{
		callback(true);
		return ;
	}
	callback(false);
}

export function to_homePage(nohistory = "false")
{
	if (nohistory === "false")
		history.pushState( { url: "homepage" }, "", "#homepage");
	updateMyInfo();
	//openSocketClient();
	drawHomePage( (result) =>
		{
			if (result)
			{
				if (document.getElementById("p_player_img") != null)
					getAvatar('p_player_img');
				document.getElementById("loadspinner").classList.add("hide");
				document.getElementById("h_homepage").classList.remove("hide");
				loadChat();
			}
		});
}
