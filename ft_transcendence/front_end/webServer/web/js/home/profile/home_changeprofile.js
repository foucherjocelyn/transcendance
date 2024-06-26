import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { loadSpinner } from "../../authentication/spinner.js";
import { getCookie } from "../../authentication/auth_cookie.js";
import { checkInput2FA } from "../../authentication/auth_otp.js";
import { updateMyOtp, updateMyAvatar, updateMyAccount } from "./home_change_info.js";
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

export function to_changeAvatar() {
	document.getElementById("h_current_parameters").innerHTML =
		`<br>
<input type="file" id="p_avatar" name="avatar" accept="image/*">
<img id="p_avatarpreview" src="../img/avatars/default.png" alt="Avatar preview">
<hr id="p_div">
<button class="button-img" type="button" id="p_change">Apply</button>
`;
	getAvatar("p_avatarpreview");
	document.getElementById("p_avatar").addEventListener("change", () => {
		document.getElementById("p_avatarpreview").src = URL.createObjectURL(event.target.files[0]);
	});
	document.getElementById("p_change").addEventListener("click", () => {
		updateMyAvatar('p_avatarpreview');
	});
}

export function to_changeInfo() {
	document.getElementById("h_current_parameters").innerHTML =
		`<br>
<input type="text" id="p_username" placeholder="${getCookie("username")}"title="Alpha numeric only" pattern="[a-zA-Z0-9]{3,20}">
<br>
<input type="password" id="p_oldpassword" placeholder="Old password" title="Enter your old password here")">
<br>
<input type="password" id="p_newpassword" placeholder="New password (a-z A-Z 0-9)" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,30}$" title="Need minimum of one lowercase + uppercase + digit and must be 6 to 30 characters long" maxlength="30" disabled>
<br>
<input type="password" id="p_newpasswordconfirm" placeholder="Confirm new password" title="Must be the same as the new password" maxlength="30" disabled>
<br>
<input type="text" id="p_firstname" placeholder="${getCookie("firstname")}" title="Letters only" pattern="[a-zA-Z]{3,20}">
<br>
<input type="text" id="p_lastname" placeholder="${getCookie("lastname")}" title="Letters only" pattern="[a-zA-Z]{3,console.log(getCookie("status"));20}">
<br>
<input type="text" id="p_email" title="This cannot be changed" placeholder="${getCookie("email")}" readonly>
<hr id="p_div">
<button class="button-img" type="button" id="p_change">Apply</button>
`;

	if (getCookie("email").endsWith("@student.42.fr")) {
		console.log("the user logged with 42");
		document.getElementById("p_oldpassword").setAttribute("disabled", "");
		document.getElementById("p_oldpassword").setAttribute("title", "42 Account cannot set password");
		document.getElementById("p_newpassword").setAttribute("title", "42 Account cannot set password");
		document.getElementById("p_newpasswordconfirm").setAttribute("title", "42 Account cannot set password");
	}
	else {
		document.getElementById("p_oldpassword").addEventListener("input", () => { enableInputReq(event, 'p_newpassword'); });
		document.getElementById("p_newpassword").addEventListener("input", () => { enableInputReq(event, 'p_newpasswordconfirm'); });
		document.getElementById("p_newpasswordconfirm").addEventListener("input", () => { enableInputReq(event, 'p_newpasswordconfirm'); });
	}
	document.getElementById("p_change").addEventListener("click", () => { updateMyAccount(); });
}

async function drawProfilePage(callback) {
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
	document.getElementById("h_changeinfo").addEventListener("click", () => { to_changeInfo(); });
	document.getElementById("h_changeavatar").addEventListener("click", () => {
		to_changeAvatar();
	});
	document.getElementById("h_change2fa").addEventListener("click", () => { to_change2fa(); });
	callback(true);
}

export async function to_profilePage(nohistory = "false") {
	await getMyInfo();
	if (!getCookie("username")) {
		to_connectForm();
		return;
	}
	if (nohistory === "false")
		history.pushState({ url: "configprofile" }, "", "#config_profile");
	drawProfilePage((result) => {
		if (result) {
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("h_myprofile").classList.remove("hide");
			loadChat();
			document.querySelector("#c-hide-friend-list").click();
		}
	});
}
