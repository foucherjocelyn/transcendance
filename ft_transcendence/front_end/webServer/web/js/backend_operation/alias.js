import { getCookie } from "../authentication/auth_cookie.js";
import { domain_name } from "./authentication.js";
import { getUserById, getUserIdByUsername } from "./get_user_info.js";

export async function addAlias(alias)
{
	if (getCookie("token") === null || getCookie("token") === "") {
		console.log("addAlias ERROR: no token found");
		return;
	}
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/profile/me/alias/add`, {
			method: "POST",
            body: JSON.stringify(alias),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
				"Authorization": `Bearer ${getCookie("token")}`
			}
		})
		if (!response.ok) {
			console.log("Error when adding alias");
			return ;
		}
		else
			return true;
	}
	catch (error) {
		console.error("Error: ", error);
	}
}

export async function updateAlias(alias)
{
	if (getCookie("token") === null || getCookie("token") === "") {
		console.log("updateAlias ERROR: no token found");
		return;
	}
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/profile/me/alias/update`, {
			method: "POST",
            body: JSON.stringify(alias),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
				"Authorization": `Bearer ${getCookie("token")}`
			}
		})
		if (!response.ok) {
			console.log("Error when adding alias");
			return ;
		}
		return true;
	}
	catch (error) {
		console.error("Error: ", error);
	}
}

export async function removeAlias()
{
	if (getCookie("token") === null || getCookie("token") === "") {
		console.log("removeAlias ERROR: no token found");
		return;
	}
	try {
		const response = await fetch(`https://${domain_name}:8000/api/v1/profile/me/alias/remove`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${getCookie("token")}`
			}
		})
		if (!response.ok) {
			console.log("Error when adding alias");
			return ;
		}
		return true;
	}
	catch (error) {
		console.error("Error: ", error);
	}
}

export async function   getAliasFromUsername(username)
{
    let user_id = await getUserIdByUsername(username);
	let user_info = await getUserById(user_id.user_id);
    return (user_info.alias);
}