import { getCookie } from "../authentication/auth_cookie.js";
import { getMyInfo, getUserById, getUserIdByUsername } from "../backend_operation/get_user_info.js";
import { to_connectForm } from "../authentication/auth_connect.js";
import { updateMyInfo } from "../backend_operation/data_update.js";
import { loadChat } from "../chat/load-chat.js";
import { noticeInvitePlayer } from "./home_game.js";
import { loadSpinner } from "../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "./upper_panel.js";
import { renderMatchHistory } from "./home_homeboard.js";

export async function	inspectProfile(username)
{
	let	user_id_obj = await getUserIdByUsername(username);
	let user_info = await getUserById(user_id_obj.user_id);
	let	inspect_content = `<div id="inspectprofile">
	<button id="inspectprofile_close""></button>
	<img id="ip_avatar" src="../../img/${user_info.avatarPath}">
	<p>Name : ${user_info.username}</p>
	<p>Nb of games : ${user_info.nb_games}</p>
	<p>Average score : ${user_info.avg_score}</p>
	<p>Level : ${user_info.level}</p>
	<button id="inspectprofile_more">More details</button>
	</div>
`;
	let inspect_selector = document.querySelector("#inspectprofile");
	let frontpage_selector = document.getElementById("frontpage");
	console.log("inspectProfile content:");
	console.log(inspect_selector);
	console.log(frontpage_selector);
	if (inspect_selector === undefined || inspect_selector === null || inspect_selector === ``)
	{
		frontpage_selector.insertAdjacentHTML("beforeend", inspect_content);
	}
	else if (frontpage_selector && inspect_selector)
	{
		inspect_selector.outerHTML = inspect_content;
	}
	document.getElementById("inspectprofile_close").addEventListener("click", () => {
		document.querySelector("#inspectprofile").remove();
	});
	document.getElementById("inspectprofile_more").addEventListener("click", () => {
		to_playerprofile("true", user_info);
	});
}

function	drawProfilePage(user_info)
{
	console.log("drawProfilePage called");
	console.log(user_info);
	document.getElementById("frontpage").outerHTML =
		`
<div id="frontpage">
	${loadSpinner()}
	${upperPanel()}
	<div id="inspectprofile_page" class="hide">
		<div id="ip_player_bar">
				<img id="ip_player_img" src="../../img/avatar/avatar_default.png">
				<p id="ip_username"></p>
				<p id="ip_level">Level: ${user_info.level}</p>
      </div>
			<div id="ip_scoreboard">
			<table id="ip_score">
    	    <thead>
              <tr id="ip_filter">
			  <th scope="col">Mode</th>
			  <th scope="col">Players</th>
			  <th scope="col">Winner</th>
			  <th scope="col">My Score</th>
			  <th scope="col">Date</th>
<!-- Display player stats  -->
              </tr>
            </thead>
			<br>
            <tbody id="ip_info">
            </tbody>
          </table>
			</div>
	</div>
	<div id="chat"></div>
	<div class="r_successinfo hide"></div>
	${noticeInvitePlayer()}
</div>
`;

	renderMatchHistory(user_info.username);
	document.getElementById("ip_username").textContent = user_info.username;
	upperPanelEventListener("profilepage");
	if (document.getElementById("loadspinner") !== undefined
		&& document.getElementById("inspectprofile_page") !== undefined
		&& document.getElementById("loadspinner") !== null
		&& document.getElementById("inspectprofile_page") !== null)
	{
		if (document.getElementById("ip_player_img") != null)
			user_info.avatarPath;//need to check if existing
		document.getElementById("loadspinner").classList.add("hide");
		document.getElementById("inspectprofile_page").classList.remove("hide");
		loadChat();
		return ;
	}
}

export async function to_playerprofile(nohistory = "false", user_info)
{
	console.log("player profile");
	console.log(user_info);
	await getMyInfo();
	if (!getCookie("username"))
	{
		to_connectForm();
		return ;
	}
	if (nohistory === "false")
		history.pushState( { url: `${user_info.username}` }, "", `#${user_info.username}`);
	updateMyInfo();
	drawProfilePage(user_info);
}