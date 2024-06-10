import { upperPanel, upperPanelEventListener } from "./upper_panel.js";
import { loadSpinner } from "../authentication/spinner.js";
import { noticeInvitePlayer } from "./game/home_game.js";
import { updateMyInfo } from "../backend_operation/data_update.js";
import { getAvatar } from "../backend_operation/profile_picture.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { loadChat } from "../chat/load-chat.js";
import { to_connectForm } from "../authentication/auth_connect.js"
import { getAllMyGames, getAllMyScores, getMyInfo } from "../backend_operation/get_user_info.js";

/*
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
*/

export async function	renderMatchHistory(username) {
	const username_obj = { username };
	const myGames = await getAllMyGames(username_obj);
	console.log(myGames);
	const myGamesSorted = myGames.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
	const myScores = await getAllMyScores(username_obj);
	console.log(myScores);
	const matchTableBody = myGamesSorted.map(game => `
		<tr class="${game.winner_username === username_obj ? 'win' : 'loss'}">
			<td>${game.mode}</td>
			<td>${game.player_usernames.join('<br />')}</td>
			<td>${game.winner_username}</td>
			<td>${myScores.find(score => score.game_id === game.id)?.score}</td>
			<td>${game.created_at.slice(0, game.created_at.indexOf('.')).split('T').join('<br />')}
		</tr>
	`).join('');
	document.getElementById("hs_info").innerHTML = matchTableBody;
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
			<p id="hpb_username"></p>
			<p id="hpb_level">Level: ${getCookie("level")}</p>
      </div>
			<div id="h_scoreboard">
			<table id="h_score">
    	    <thead>
              <tr id="hs_filter">\<!-- display in red or blue if defeat/victory  -->
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

	renderMatchHistory(getCookie("username"));
	document.getElementById("hpb_username").textContent = getCookie("username");
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

export async function to_homePage(nohistory = "false")
{
	await getMyInfo();
	if (!getCookie("username"))
	{
		to_connectForm();
		return ;
	}
	if (nohistory === "false")
		history.pushState( { url: "homepage" }, "", "#homepage");
	updateMyInfo();
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
