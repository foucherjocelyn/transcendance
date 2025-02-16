import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { loadSpinner } from "../../authentication/spinner.js";
import { getCookie } from "../../authentication/auth_cookie.js";
import { checkInput2FA } from "../../authentication/auth_otp.js";
import { updateMyOtp, updateMyAvatar, updateMyAccount } from "./home_update_info.js";
import { noticeInvitePlayer } from "../game/home_game.js";
import { getMyInfo } from "../../backend_operation/get_user_info.js";
import { to_connectForm } from "../../authentication/auth_connect.js";
import { loadChat } from "../../chat/load-chat.js";
import { getAvatar } from "../../backend_operation/profile_picture.js";

function enableInputReq(event, element_name) {
	if (event.target.value.length > 0) {
		event.target.setAttribute("required", "");
		event.target.setAttribute("title", "This is required");
		document.getElementById(element_name).removeAttribute("disabled");
	}
}

export function to_change2fa() {
	document.getElementById("h_current_parameters").innerHTML =
		`<br>
<div id="p_2fa">
<p id="p_2fa_info">Two-factor authentication:</p>
<br>
<label for="p_2fa_enable" id="p_2fa_enable_text"><input id="p_2fa_enable" name="2fa_check" type="radio" value="enable">Enable</label>
<br>
<label for="p_2fa_disable" id="p_2fa_disable_text"><input id="p_2fa_disable" name="2fa_check" type="radio" value="disable">Disable</label>
</div>
<hr id="p_div">
<button class="button-img" type="button" id="p_change">Apply</button>
`;
	checkInput2FA();
	document.getElementById("p_change").addEventListener("click", () => { updateMyOtp(); });
}

export async function to_changeAvatar() {
	await getMyInfo();
	document.getElementById("h_current_parameters").innerHTML =
		`<br>
<input type="file" id="p_avatar" name="avatar" accept="image/*" class="text_area">
<img id="p_avatarpreview" src="../img/avatars/default.png" alt="Avatar preview">
<hr id="p_div">
<button class="button-img" type="button" id="p_change">Apply</button>
`;
	await getAvatar("p_avatarpreview");
	document.getElementById("p_avatar").addEventListener("change", () => {
		document.getElementById("p_avatarpreview").src = URL.createObjectURL(event.target.files[0]);
	});
	document.getElementById("p_change").addEventListener("click", async () => {
		await updateMyAvatar('p_avatarpreview');
	});
}

export async function to_changeInfo() {
	await getMyInfo();
	document.getElementById("h_current_parameters").innerHTML =
		`<br>
		<form id="p_update_info">
<input type="text" id="p_username" placeholder="${getCookie('username')}" title="Alphanumeric only" pattern="[a-zA-Z0-9]{3,20}" class="text_area">
<br>
<input type="password" id="p_oldpassword" placeholder="Old password" title="Enter your old password here" class="text_area">
<br>
<input type="password" id="p_newpassword" placeholder="New password (a-z A-Z 0-9)" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,30}$" title="Need minimum of one lowercase + uppercase + digit and must be 6 to 30 characters long" maxlength="30" class="text_area" disabled>
<br>
<input type="password" id="p_newpasswordconfirm" placeholder="Confirm new password" title="Must be the same as the new password" maxlength="30" class="text_area" disabled>
<br>
<input type="text" id="p_firstname" placeholder="${getCookie("firstname")}" title="Letter only" pattern="[a-zA-Z]{3,20}" class="text_area">
<br>
<input type="text" id="p_lastname" placeholder="${getCookie("lastname")}" title="Letter only" pattern="[a-zA-Z]{3,20}" class="text_area">
<br>
<input type="text" id="p_email" title="This cannot be changed" placeholder="${getCookie("email")}"  class="text_area_disabled" readonly>
<hr id="p_div">
<button class="button-img" type="submit" id="p_change">Apply</button>
</form>
`;

	let username = document.getElementById("p_username");
	let firstname = document.getElementById("p_firstname");
	let lastname = document.getElementById("p_lastname");
	let old_password = document.getElementById("p_oldpassword");
	let new_password = document.getElementById("p_newpassword");
	let new_password_confirm = document.getElementById("p_newpasswordconfirm");

	if (getCookie("email").endsWith("@student.42.fr")) {
		old_password.setAttribute("disabled", "");
		old_password.setAttribute("title", "42 Account cannot set password");
		old_password.setAttribute("class", "text_area_disabled");

		new_password.setAttribute("title", "42 Account cannot set password");
		new_password.setAttribute("class", "text_area_disabled");

		new_password_confirm.setAttribute("title", "42 Account cannot set password");
		new_password_confirm.setAttribute("class", "text_area_disabled");

		username.setAttribute("disabled", "");
		username.setAttribute("title", "42 Account cannot change username");
		username.setAttribute("class", "text_area_disabled");

		firstname.setAttribute("disabled", "");
		firstname.setAttribute("title", "42 Account cannot change firstname");
		firstname.setAttribute("class", "text_area_disabled");
		lastname.setAttribute("disabled", "");
		lastname.setAttribute("title", "42 Account cannot change lastname");
		lastname.setAttribute("class", "text_area_disabled");
	}
	else {
		old_password.addEventListener("input", () => { enableInputReq(event, 'p_newpassword'); });
		new_password.addEventListener("input", () => { enableInputReq(event, 'p_newpasswordconfirm'); });
		new_password_confirm.addEventListener("input", () => { enableInputReq(event, 'p_newpasswordconfirm'); });
	}
	document.getElementById("p_update_info").addEventListener("submit", () => {
		event.preventDefault();
		updateMyAccount();
	});
}

async function drawEditProfilePage(callback) {
	await getMyInfo();
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">
	${loadSpinner()}
	${upperPanel()}
	<div id="h_myprofile" name="myprofile" class="hide">
		<div id="h_myprofileoptions">
			<p id="h_changeinfo" class="button-img">My user info</p>
			<p id="h_changeavatar" class="button-img">Profile Picture</p>
			<p id="h_change2fa" class="button-img">Two-factor authentication</p>
		</div>
		<hr id="h_myprofileoptionsline">
		<div id="h_current_parameters">
			<img id="h_myprofilemenu" src="../../../img/png/gear.png" alt="gear icon"></img>
		</div>
	</div>
	<div id="chat"></div>
	<div class="r_successinfo hide"></div>
${noticeInvitePlayer()}
</div>
`;
	upperPanelEventListener("h_myprofile");
	document.getElementById("h_changeavatar").addEventListener("click", async () => {
		await to_changeAvatar();
	});
	if (getCookie("email").endsWith("@student.42.fr")) {
		document.getElementById("h_changeinfo").setAttribute("class", "button-img_disabled");
		document.getElementById("h_change2fa").setAttribute("class", "button-img_disabled");
	}
	else
	{
		document.getElementById("h_changeinfo").addEventListener("click", async () => { await to_changeInfo(); });
		document.getElementById("h_change2fa").addEventListener("click", () => { to_change2fa(); });
	}
	callback(true);
}

export async function to_profilePage(nohistory = "false") {
	await getMyInfo();
	if (!getCookie("username")) {
		to_connectForm();
		return;
	}
	if (nohistory === "false")
		history.pushState({ url: "config_profile" }, "", "#config_profile");
	drawEditProfilePage((result) => {
		if (result) {
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("h_myprofile").classList.remove("hide");
			loadChat();
			document.querySelector("#c-hide-friend-list").click();
		}
	});
}
