import { getCookie, deleteAllCookie } from "../authentication/auth_cookie.js";

export async function getUserById(user_id) {
	let f_token = getCookie("token");

	if (f_token === null || f_token === "") {
		//console.log("Token is null");
		return;
	}
	try {
		const response = await fetch(`https://localhost/api/v1/users/${user_id}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getUserById: Client/Server error");
			return;
		}
		const data = await response.json();
		//console.log("getUserById:");
		//console.log(data);
		return (data);
	} catch (error) {
		console.error("getUserById: ", error);
	}
}

export async function getUserIdByUsername(username) {
	let f_token = getCookie("token");

	if (f_token === null || f_token === "") {
		//console.log("Token is null");
		return;
	}
	try {
		const response = await fetch(`https://localhost/api/v1/users/id/${username}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getUserIdByUsername: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await response.json();
		//console.log("getUserIdByUsername:");
		//console.log(data);
		return data;
	} catch (error) {
		console.error("getUserIdByUsername: ", error);
	}
}

export async function getMyInfo() {
	//	console.log("-Obtaining user info");
	let f_token = getCookie("token");

	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const response = await fetch("https://localhost/api/v1/profile/me", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getMyInfo: Client/Server error");
			deleteAllCookie();
			return;
		}
		const data = await response.json();
		//				  console.log("getMyInfo data:");
		//				  console.table(data);
		if (data !== undefined) {
			document.cookie = `username=${data.username}; SameSite=Strict`;
			document.cookie = `firstname=${data.first_name}; SameSite=Strict`;
			document.cookie = `lastname=${data.last_name}; SameSite=Strict`;
			document.cookie = `email=${data.email}; SameSite=Strict`;
			document.cookie = `level=${data.level}; SameSite=Strict`;
			document.cookie = `avatar=${data.avatarPath}; SameSite=Strict`;
			document.cookie = `id=${data.id}; SameSite=Strict`;
			document.cookie = `is_active=${data.active}; SameSite=Strict`;
			document.cookie = `status=${data.status}; SameSite=Strict`;
			document.cookie = `is_staff=${data.is_staff}; SameSite=Strict`;
			document.cookie = `is_admin=${data.is_superuser}; SameSite=Strict`;
		}
	} catch (error) {
		console.error("getMyInfo: ", error);
	}
	//	console.log("-");
}

export async function getListUsers() {

	let f_token = getCookie("token");

	try {
		const response = await fetch("https://localhost/api/v1/users", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getListUsers: Client/Server error");
			return;
		}
		const data = await response.json();
		return (data);
	} catch (error) {
		console.error("getListUsers: ", error);
	}

	return response;
}

export const getListFriends = async () => {
	let f_token = getCookie("token");

	try {
		const response = await fetch("https://localhost/api/v1/user/friendship", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getListFriends: Client/Server error");
			return;
		}
		return response.json();
	} catch (error) {
		console.error("getListFriends: ", error);
	}

}

export const getListMutedUsers = async () => {
	let f_token = getCookie("token");

	try {
		const response = await fetch("https://localhost/api/v1/user/friendship/mute/list", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getListMutedUsers: Client/Server error");
			return;
		}
		return response.json();
	} catch (error) {
		console.error("getListMutedUsers: ", error);
	}
}

export async function getAllMyGames(username)
{
	let f_token = getCookie("token");

	try {
		const response = await fetch("https://localhost/api/v1/game/me", {
			method: "GET",
			body: JSON.stringify(username),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getAllMyGames: Client/Server error");
			return;
		}
		return response.json();
	} catch (error) {
		console.error("getAllMyGames: ", error);
	}

}

export async function getAllMyScores(username)
{
	let f_token = getCookie("token");

	try {
		const response = await fetch("https://localhost/api/v1/game/me/score", {
			method: "GET",
			body: JSON.stringify(username),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getAllMyScores: Client/Server error");
			return;
		}
		return response.json();
	} catch (error) {
		console.error("getAllMyScores: ", error);
	}
}

/*
export const getAllMyGames = async () => {
	let f_token = getCookie("token");

	try {
		const response = await fetch("https://localhost/api/v1/game/me", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getAllMyGames: Client/Server error");
			return;
		}
		return response.json();
	} catch (error) {
		console.error("getAllMyGames: ", error);
	}
}

export const getAllMyScores = async () => {
	let f_token = getCookie("token");

	try {
		const response = await fetch("https://localhost/api/v1/game/me/score", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!response.ok) {
			console.log("getAllMyScores: Client/Server error");
			return;
		}
		return response.json();
	} catch (error) {
		console.error("getAllMyScores: ", error);
	}

}
*/