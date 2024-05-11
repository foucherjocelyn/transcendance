import { upperPanel, upperPanelEventListener } from "./upper_panel.js";
import { loadSpinner } from "../authentication/spinner.js";
import { noticeInvitePlayer, to_game } from "./home_game.js";
import { to_tournament } from "./home_tournament.js";
import { to_profilePage } from "./home_changeprofile.js";
import { updateMyInfo } from "../backend_operation/data_update.js";
import { getAvatar } from "../backend_operation/profile_picture.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { classy_signOut } from "../authentication/auth_connect.js";
import { loadChat } from "../chat/load-chat.js";

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
				<th scope="col">Tournament name</th>
                <th scope="col">Number of players</th>
                <th scope="col">Date</th>
				<th scope="col">Outcome</th>
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
${noticeInvitePlayer()}
</div>
`;

	//load players scoreboard
//	console.log("loading player list");
//	getUserList();
	//
	upperPanelEventListener("home");
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
				if (document.getElementById("hpb_player_img") != null)
					getAvatar('hpb_player_img');
				document.getElementById("loadspinner").classList.add("hide");
				document.getElementById("h_homepage").classList.remove("hide");
				loadChat();
			}
		});
}
