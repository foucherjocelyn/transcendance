import { notice } from "./auth_main.js";
import { to_change2fa, to_changeAvatar, to_changeInfo, } from "../home/profile/home_changeprofile.js";
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
	if (document.getElementById("p_avatar").files.length > 0)
	{
		let avatarForm = new FormData();
		avatarForm.append("avatar", document.getElementById("p_avatar").files[0]);
		await uploadAvatar(avatarForm);
		to_changeAvatar();
	}
}

export async function	updateMyAccount()
{
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
	console.log(changes);
	if (changes > 0)
	{
		await dataUpdate(newInfo);
		to_changeInfo();
	}
}

export async function	updateMyOtp()
{
	const status = document.getElementById("p_2fa_enable").checked ? true : false;
	const OtpStatus = await getOtpStatusToken();
	if (OtpStatus != status)
	{
		await toggleOtpStatus();
		to_change2fa();
	}
}
