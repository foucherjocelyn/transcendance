import { getCookie } from "./auth_cookie.js";
import { notice } from "./auth_main.js";
import { to_profilePage } from "../home/home_changeprofile.js";
import { getOtpStatusToken, toggleOtpStatus } from "../backend_operation/one_time_password.js";
import { uploadAvatar } from "../backend_operation/profile_picture.js";
import { dataUpdate } from "../backend_operation/data_update.js";

export function checkPasswordChange()
{
	if (document.getElementById("p_oldpassword").value.length > 0 && document.getElementById("p_newpassword").value.length > 0 && document.getElementById("p_newpasswordconfirm").value.length > 0)
	{
		if (!(document.getElementById("p_newpassword").value === document.getElementById("p_newpasswordconfirm").value))
			console.log("new password and confirmation are different");
		console.log("new password is valid");
		return (true);
	}
	return (false);
}

export async function	updateMyAvatar()
{
	console.log("----Updating user profile picture");
	if (document.getElementById("p_avatar").files.length > 0)
	{
		let avatarForm = new FormData();
		avatarForm.append("avatar", document.getElementById("p_avatar").files[0]);
		await uploadAvatar(avatarForm);
		to_profilePage();
		notice("Changes applied", 2, "#2c456e");
	}
	console.log("----");
}

export async function	updateMyAccount()
{
	console.log("----Updating user information");
	let changes = 0;
	let	newInfo = {
	};
	if (document.getElementById("p_username").value.length > 0)
	{
		newInfo.username = document.getElementById("p_username").value;
		changes = 1;
	}
	if (checkPasswordChange() === true)
	{
		newInfo.password = document.getElementById("p_newpassword").value;
		changes = 2;
	}
	if (document.getElementById("p_firstname").value.length > 0)
	{
		newInfo.username = document.getElementById("p_username").value;
		changes = 3;
	}
	if (document.getElementById("p_lastname").value.length > 0)
	{
		newInfo.username = document.getElementById("p_username").value;
		changes = 4;
	}
	if (document.getElementById("p_email").value.length > 0)
	{
		newInfo.username = document.getElementById("p_username").value;
		changes = 5;
	}
	if (changes > 0)
		await dataUpdate(newInfo);

	if (changes > 0)
	{
		to_profilePage();
		notice("Changes applied", 2, "#2c456e");
	}
	console.log("----");
}

export async function	updateMyOtp()
{
	console.log("----Updating user 2fa");
	const status = document.getElementById("p_2fa_enable").checked ? true : false;
	let	f_username = {
		username: getCookie("username")
	};
	const OtpStatus = await getOtpStatusToken();
	if (OtpStatus != status)
	{
		toggleOtpStatus();
		to_profilePage();
		notice("Changes applied", 2, "#2c456e");
	}
	console.log("----");
}
