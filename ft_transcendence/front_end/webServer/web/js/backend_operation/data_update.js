import { getCookie } from "../authentication/auth_cookie.js";
import { notice } from "../authentication/auth_main.js";
import { domain_name } from "./authentication.js";

export async function dataUpdate(newInfo) {
	//console.log("-dataUpdate starting");
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
		}
		return true;
	} catch (error) {
		console.error("dataUpdate: ", error);
		throw new Error("fetch POST op failed");
	}
}