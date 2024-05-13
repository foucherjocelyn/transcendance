import { getCookie } from "../authentication/auth_cookie.js";
import { user, client } from '../client/client.js';
import { openSocketClient } from "./authentication.js";
import { getAvatar } from "./profile_picture.js";
import { getMyInfo, getUserById } from "./get_user_info.js";

export async function dataUpdate(newInfo) {
	//	console.log("-dataUpdate starting");
	let f_token = getCookie("token");
	await fetch("http://127.0.0.1:8000/api/v1/profile/me", {
		method: "PUT",
		body: JSON.stringify(newInfo),
		headers: {
			"Accept": "application/json",
			"Content-type": "application/json",
			"Authorization": `Bearer ${f_token}`
		}
	})
		.then(response => {
			if (!response.ok) {
				console.log("dataUpdate: Client/Server error");
				return;
				//throw new Error("fetch POST op failed");
			}
			return response.json();
		})
		.then(data => {
			//				  console.log("update info data:");
			//				  console.log(data);
		})
		.catch(error => {
			console.error("updateMyInfo: ", error);
		});
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
