import { getUserById, getUserIdByUsername } from "../backend_operation/get_user_info.js";

export async function	inspectProfile(username)
{
	let	user_id_obj = await getUserIdByUsername(username);
	let user_info = await getUserById(user_id_obj.user_id);
	document.getElementById("frontpage").insertAdjacentHTML("beforeend", `
	<div id="inspectprofile">
	<button id="inspectprofile_close" alt="a magnificient closing button"></button>
	<img id="ip_avatar" src="../../img/${user_info.avatarPath}">
	<p>Name : ${user_info.username}</p>
	<p>Nb of games : ${user_info.nb_games}</p>
	<p>Average score : ${user_info.avg_score}</p>
	<p>Level : ${user_info.level}</p>
	</div>
`);
	document.getElementById("inspectprofile_close").addEventListener("click", () => {
		document.querySelector("#inspectprofile").remove();
	});
}
