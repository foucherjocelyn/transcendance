import { getCookie } from "../../authentication/auth_cookie.js";
import { getMyInfo, getUserById, getUserIdByUsername } from "../../backend_operation/get_user_info.js";
import { to_connectForm } from "../../authentication/auth_connect.js";
import { loadChat } from "../../chat/load-chat.js";
import { noticeInvitePlayer } from "../game/home_game.js";
import { loadSpinner } from "../../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { renderMatchHistory } from "../home_homeboard.js";

export async function	inspectProfile(username)
{
	let	user_id_obj = await getUserIdByUsername(username);
	let user_info = await getUserById(user_id_obj.user_id);
	let	inspect_content = `<div id="inspectprofile">
	<button id="inspectprofile_close""></button>
	<img id="ip_avatar" src="../../../img/${user_info.avatarPath}">
	<p>Name : ${user_info.username}</p>
	<p>Nb of games : ${user_info.nb_games}</p>
	<p>Average score : ${user_info.avg_score}</p>
	<p>Level : ${user_info.level}</p>
	<button id="inspectprofile_more">Inspect profile</button>
	</div>
`;
	let inspect_selector = document.querySelector("#inspectprofile");
	let frontpage_selector = document.getElementById("frontpage");
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
		to_playerprofile("false", user_info);
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
	<div id="h_homepage" class="hide">
		<div id="h_player_bar">
				<img id="hpb_player_img" src="../../img/avatars/default.png">
				<p id="hpb_username"></p>
				<p id="hpb_level">Level: ${user_info.level}</p>
      </div>
			<div id="h_scoreboard">
			<table id="h_score">
    	    <thead>
              <tr id="hs_filter">
			  <th scope="col">Mode</th>
			  <th scope="col">Players</th>
			  <th scope="col">Winner</th>
			  <th scope="col">My Score</th>
			  <th scope="col">Date</th>
<!-- Display player stats  -->
              </tr>
            </thead>
			<br>
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

	renderMatchHistory(user_info.username);
	document.getElementById("hpb_username").textContent = user_info.username;
	upperPanelEventListener("profilepage");
	if (document.getElementById("loadspinner") !== undefined
		&& document.getElementById("h_homepage") !== undefined
		&& document.getElementById("loadspinner") !== null
		&& document.getElementById("h_homepage") !== null)
	{
		document.getElementById("hpb_player_img").setAttribute("src", "../../../img/" + user_info.avatarPath);
		document.getElementById("loadspinner").classList.add("hide");
		document.getElementById("h_homepage").classList.remove("hide");
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
		history.pushState( { url: `homepage` }, "", `#homepage`);//{ url: `${user_info.username}` }, "", `#${user_info.username}`);
	drawProfilePage(user_info);
}
