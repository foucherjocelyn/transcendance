import { getUserById, getUserIdByUsername } from "../backend_operation/get_user_info.js";
import { noticeInvitePlayer } from "./home_game.js";
import { upperPanel, upperPanelEventListener } from "./upper_panel.js";

export async function	inspectProfile(username)
{
	let	user_id_obj = await getUserIdByUsername(username);
	let user_info = await getUserById(user_id_obj.user_id);
	document.getElementById("frontpage").outerHTML = `
<div id="frontpage">
	${upperPanel()}
	<div id="inspectprofile">
	<img id="ip_avatar" src="../../img/${user_info.avatarPath}">
	<p>Name = ${user_info.username}</p>
	<p>Nb of game played = ${user_info.nb_games}</p>
	<p>Average score = ${user_info.avg_score}</p>
	<p>Level = ${user_info.level}</p>
	</div>
	<div id="chat"></div>
	<div class="r_successinfo hide"></div>
	${noticeInvitePlayer()}
</div>
`;
	upperPanelEventListener();
}
