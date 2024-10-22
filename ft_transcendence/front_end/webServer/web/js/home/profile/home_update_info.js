import { to_change2fa, to_changeAvatar, to_changeInfo, } from "./home_changeprofile.js";
import { getOtpStatusToken, toggleOtpStatus } from "../../backend_operation/one_time_password.js";
import { uploadAvatar } from "../../backend_operation/profile_picture.js";
import { dataUpdate } from "../../backend_operation/data_update.js";
import { client, dataToServer } from "../../client/client.js";
import { notice } from "../../authentication/auth_main.js";

export function checkPasswordChange() {
	if (document.getElementById("p_oldpassword").value.length > 0 && document.getElementById("p_newpassword").value.length > 0 && document.getElementById("p_newpasswordconfirm").value.length > 0) {
		if (!(document.getElementById("p_newpassword").value === document.getElementById("p_newpasswordconfirm").value)) {
			notice("The new password and the confirmation must match", 1, "#D20000");
			return;
		}
		return (true);
	}
	return (false);
}

function avatarCheckType(elem_name) {
	let typechecker = document.getElementById(elem_name).value;
	switch (true) {
		case typechecker.endsWith(".png"):
		case typechecker.endsWith(".jpg"):
		case typechecker.endsWith(".jpeg"):
			return true;
		default:
			return (false);
	}
}

export async function updateMyAvatar() {
	let avatar = document.getElementById("p_avatar");
	let max_size = 5 * 1024 * 1024;
	if (avatar.files.length > 0 && avatarCheckType("p_avatar") && avatar.files[0].size < max_size) {
		let avatarForm = new FormData();
		avatarForm.append("avatar", document.getElementById("p_avatar").files[0]);
		await uploadAvatar(avatarForm);
		const send_data = new dataToServer('update informations user', "", 'socket server');
		client.socket.send(JSON.stringify(send_data));
		to_changeAvatar();
	}
	else
		notice(`Uploaded file is too big, must be less than ${max_size} megabytes`, 0, "#D20000");
}

export async function updateMyAccount() {
	let changes = 0;
	let newInfo = {
	};
	if (document.getElementById("p_username").value.length > 0) {
		newInfo.username = document.getElementById("p_username").value;
		changes = 1;
	}
	if (checkPasswordChange() === true) {
		newInfo.old_password = document.getElementById("p_oldpassword").value;
		newInfo.new_password = document.getElementById("p_newpassword").value;
		changes = 2;
	}
	if (document.getElementById("p_firstname").value.length > 0) {
		newInfo.first_name = document.getElementById("p_firstname").value;
		changes = 3;
	}
	if (document.getElementById("p_lastname").value.length > 0) {
		newInfo.last_name = document.getElementById("p_lastname").value;
		changes = 4;
	}
	if (document.getElementById("p_email").value.length > 0) {
		newInfo.email = document.getElementById("p_email").value;
		changes = 5;
	}
	console.log(changes);
	if (changes > 0) {
		const send_data = new dataToServer('update informations user', "", 'socket server');
		client.socket.send(JSON.stringify(send_data));
		await dataUpdate(newInfo);
		to_changeInfo();
	}
}

export async function updateMyOtp() {
	const status = document.getElementById("p_2fa_enable").checked ? true : false;
	const OtpStatus = await getOtpStatusToken();
	if (OtpStatus != status) {
		await toggleOtpStatus();
		to_change2fa();
	}
}
