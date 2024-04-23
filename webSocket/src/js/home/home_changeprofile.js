import { signOut } from "../authentication/auth_connect.js";
import { getCookie } from "../authentication/auth_cookie.js";
import { getMyInfo, updateMyInfo } from "../authentication/auth_get_my_info.js";
import { drawGame } from "./home_game.js";
import { drawHomePage } from "./home_homeboard.js";
import { drawTournament } from "./home_tournament.js";
import { getAvatar } from "../authentication/auth_profile_picture.js";
import { upperPanel } from "./home_homeboard.js";

function	enableInputReq(event, element_name)
{
//	console.log("enableInput");
//	console.log("event :" + event.target);
//	console.log("element_name :" + element_name);
	if (event.target.value.length > 0)
	{
		event.target.setAttribute("required", "");
		event.target.setAttribute("title", "This is required");
		document.getElementById(element_name).removeAttribute("disabled");
//		document.getElementById(element_name).setAttribute("required", "");	
	}
	/*
	else if (event.target.value.length === 0)
	{
		console.log("disabling");
		event.target.removeAttribute("required");
		event.target.removeAttribute("title");
		document.getElementById(element_name).setAttribute("disabled", "");
		document.getElementById(element_name).removeAttribute("required");
		}
	*/
}

function	changePreview(event)
{
	console.log("changePreview");
	console.log(URL.createObjectURL(event.target.files[0]));
	document.getElementById("p_avatarpreview").src = URL.createObjectURL(event.target.files[0]);
}

export async function	drawProfilePage()
{
	await getMyInfo();
	document.querySelector("#frontpage").outerHTML = 
		`
<div id="frontpage">
${upperPanel()}
<div id="h_myprofile" name="myprofile">
<!-- <hr id="p_divoldpw"> -->
<br>
<input type="text" id="p_username" placeholder="${getCookie("username")}">
<br>
<input type="password" id="p_oldpassword" placeholder="Old password")" oninput="enableInputReq(event, 'p_newpassword')">
<br>
<input type="password" id="p_newpassword" placeholder="New password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,12}$" title="Need minimum of one lowercase + uppercase + digit and must be 6 to 12 characters long" oninput="enableInputReq(event, 'p_newpasswordconfirm')" disabled>
<br>
<input type="password" id="p_newpasswordconfirm" placeholder="Confirm new password" title="Must be the same as the new password" oninput="enableInputReq(event, 'p_newpasswordconfirm')" disabled>
<br>
<input type="text" id="p_firstname" value="${getCookie("firstname")}" readonly>
<br>
<input type="text" id="p_lastname" value="${getCookie("lastname")}" readonly>
<br>
<input type="text" id="p_email" title="This is your mail" value="${getCookie("email")}" readonly>
<br>
<input type="file" id="p_avatar" name="avatar" accept="image/*" onchange="changePreview(event)">
<img id="p_avatarpreview" src="../ressource/avatar_default.png" alt="Avatar preview">
<br>
<div id="p_2fa">
<p id="p_2fa_info">Two-factor authentication:</p>
<br>
<label for="p_2fa_enable" id="p_2fa_enable_text"><input id="p_2fa_enable" name="2fa_check" type="radio" value="enable">Enable</label>
<br>
<label for="p_2fa_disable" id="p_2fa_disable_text"><input id="p_2fa_disable" name="2fa_check" type="radio" value="disable">Disable</label>
</div>
<hr id="p_div">
<button class="button-img" type="button" id="p_change">Apply</button>
</div>
</div>`;

	document.getElementById("h_tohome").addEventListener("click", () => { drawHomePage(); });
	document.getElementById("h_togame").addEventListener("click", () => { drawGame(); });
	document.getElementById("p_change").addEventListener("click", () => { updateMyInfo(); });
	document.getElementById("h_totournament").addEventListener("click", drawTournament);
	document.getElementById("h_logout").addEventListener("click", () => { signOut(); });
}
