import { getUserById, getUserIdByUsername } from "../backend_operation/get_user_info.js";

export async function	inspectProfile(username)
{
	let	user_id = await getUserIdByUsername(username);
	let user_info = await getUserById(user_id);
//	console.log("---------------inspectProfile info:");
//	console.log(user_id);
	//	console.log(user_info);
	let	wl_ratio = user_info.victory / user_info.lose;
	document.getElementById("profile_view").innerHTML = `
<p>Name = ${user_info.username}</p>
<p>Nb of game played = ${user_info.games_played}</p>
<p>W/L ratio = ${wl_ratio} </p>
`;
}
