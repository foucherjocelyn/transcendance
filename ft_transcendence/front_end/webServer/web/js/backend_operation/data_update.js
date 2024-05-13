import { getCookie } from "../authentication/auth_cookie.js";
import { client } from '../client/client.js';
import { openSocketClient } from "./authentication.js";
import { getMyInfo, getUserById } from "./get_user_info.js";

export async function dataUpdate(newInfo) {
	//	console.log("-dataUpdate starting");
	let f_token = getCookie("token");
	try {
		const response = await fetch("http://127.0.0.1:8000/api/v1/profile/me", {
			method: "PUT",
			body: JSON.stringify(newInfo),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("dataUpdate: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
	} catch (error) {
		console.error("updateMyInfo: ", error);
	}
	//	console.log("-");
}


export async function updateMyInfo(connectFlag = false) {
	let info = await getMyInfo();

	client.inforUser = await getUserById(getCookie('id'));
	client.inforUser.avatarPath = "../img/avatar/avatar_default.png";//temp

	if (connectFlag) {
		openSocketClient();
	}
	return ("true");
}
