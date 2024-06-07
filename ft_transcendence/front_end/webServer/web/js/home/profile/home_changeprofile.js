import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { loadSpinner } from "../../authentication/spinner.js";
import { getCookie } from "../../authentication/auth_cookie.js";
import { checkInput2FA } from "../../authentication/auth_otp.js";
import { updateMyOtp, updateMyAvatar, updateMyAccount } from "../../authentication/auth_change_info.js";
import { to_homePage } from "../home_homeboard.js";
import { noticeInvitePlayer, to_game } from "../game/home_game.js";
import { to_tournament } from "../tournament/home_tournament.js";
import { getMyInfo } from "../../backend_operation/get_user_info.js";
import { getAvatar } from "../../backend_operation/profile_picture.js";
import { classy_signOut, to_connectForm } from "../../authentication/auth_connect.js";
import { loadChat } from "../../chat/load-chat.js";

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

function	to_change2fa()
{
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
	document.getElementById("h_to_home").addEventListener("click", () => { to_homePage(); });
	document.getElementById("h_to_game").addEventListener("click", () => { to_game(); });
	document.getElementById("h_to_tournament").addEventListener("click", to_tournament);
	document.getElementById("h_logout").addEventListener("click", () => { classy_signOut("h_myprofile"); });
		document.getElementById("p_change").addEventListener("click", () => { updateMyOtp(); });
}

function	to_changeAvatar(callback)
{
	document.getElementById("h_current_parameters").innerHTML = 
`<br>
<input type="file" id="p_avatar" name="avatar" accept="image/*" onchange="changePreview(event)">
<img id="p_avatarpreview" src="../img/avatar/avatar_default.png" alt="Avatar preview">
<hr id="p_div">
<button class="button-img" type="button" id="p_change">Apply</button>
`;

	document.getElementById("h_to_home").addEventListener("click", () => { to_homePage(); });
	document.getElementById("h_to_game").addEventListener("click", () => { to_game(); });
	document.getElementById("h_to_tournament").addEventListener("click", to_tournament);
	document.getElementById("h_logout").addEventListener("click", () => { classy_signOut("h_myprofile"); });
	document.getElementById("p_change").addEventListener("click", () => { updateMyAvatar(); });
	callback(true);
}

function	to_changeInfo()
{
	//highlight current selected options
	document.getElementById("h_current_parameters").innerHTML = 
`<br>
<input type="text" id="p_username" placeholder="${getCookie("username")}">
<br>
<input type="password" id="p_oldpassword" placeholder="Old password")" oninput="enableInputReq(event, 'p_newpassword')">
<br>
<input type="password" id="p_newpassword" placeholder="New password (a-z A-Z 0-9)" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,12}$" title="Need minimum of one lowercase + uppercase + digit and must be 6 to 12 characters long" oninput="enableInputReq(event, 'p_newpasswordconfirm')" disabled>
<br>
<input type="password" id="p_newpasswordconfirm" placeholder="Confirm new password" title="Must be the same as the new password" oninput="enableInputReq(event, 'p_newpasswordconfirm')" disabled>
<br>
<input type="text" id="p_firstname" placeholder="${getCookie("firstname")}">
<br>
<input type="text" id="p_lastname" placeholder="${getCookie("lastname")}">
<br>
<input type="text" id="p_email" title="This cannot be changed" value="${getCookie("email")}" readonly>
<hr id="p_div">
<button class="button-img" type="button" id="p_change">Apply</button>
`;

	upperPanelEventListener("myprofile");
	document.getElementById("p_change").addEventListener("click", () => { updateMyAccount(); });
}

async function	drawProfilePage(callback)
{
	await getMyInfo();
	document.querySelector("#frontpage").outerHTML = 
`<div id="frontpage">
	${loadSpinner()}
	${upperPanel()}
	<div id="h_myprofile" name="myprofile" class="hide">
		<div id="h_myprofileoptions">
			<p id="h_changeinfo">My user info</p>
			<p id="h_changeavatar">Profile Picture</p>
			<p id="h_change2fa">Two-factor authentication</p>
		</div>
		<hr id="h_myprofileoptionsline">
		<div id="h_current_parameters">
			<img id="h_myprofilemenu" src="../../img/png/gear.png" alt="gear icon"></img>
		</div>
	</div>
	<div id="chat"></div>
	<div class="r_successinfo hide"></div>
${noticeInvitePlayer()}
</div>
`;
	upperPanelEventListener("tournament");
	document.getElementById("h_changeinfo").addEventListener("click", () => { to_changeInfo(); });
	document.getElementById("h_changeavatar").addEventListener("click", () =>
		{
			to_changeAvatar( (result) =>
				{
					if (result)
						getAvatar('p_avatarpreview');
				});
		});
	document.getElementById("h_change2fa").addEventListener("click", () => { to_change2fa(); });
	callback(true);
}

export async function to_profilePage(nohistory = "false")
{
	await getMyInfo();
	if (!getCookie("username"))
	{
		to_connectForm();
		return ;
	}
	if (nohistory === "false")
		history.pushState( { url: "configprofile" }, "", "#config_profile");
	drawProfilePage( (result) =>
		{
			if (result)
			{
				document.getElementById("loadspinner").classList.add("hide");
				document.getElementById("h_myprofile").classList.remove("hide");
				loadChat();
			}
		});
}