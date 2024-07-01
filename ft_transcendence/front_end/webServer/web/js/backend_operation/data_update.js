import { getCookie } from "../authentication/auth_cookie.js";
import { notice } from "../authentication/auth_main.js";
import { client } from "../client/client.js";
import { domain_name, openSocketClient } from "./authentication.js";
import { getMyInfo, getUserById } from "./get_user_info.js";

export async function dataUpdate(newInfo) {
	console.log("-dataUpdate starting");
	let f_token = getCookie("token");
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/profile/me`, {
			method: "PUT",
			body: JSON.stringify(newInfo),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			//console.log("dataUpdate: Client/Server error");
			notice("The old password is incorrect", 1, "#D20000");
			return;
			//throw new Error("fetch POST op failed");
		}
	} catch (error) {
		console.error("updateMyInfo: ", error);
	}
	//	console.log("-");
}


export async function updateMyInfo(connectFlag = false) {
	let user_profile = await getMyInfo();
	console.log("user_profile here:");
	console.log(user_profile);

	if (!user_profile)
		return (false);
	
	if (connectFlag) {
		console.log("opening socket client");
		openSocketClient();
	}
	return (true);
}
