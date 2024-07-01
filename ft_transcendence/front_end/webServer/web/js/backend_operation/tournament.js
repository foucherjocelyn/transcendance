import { getCookie } from "../authentication/auth_cookie.js";
import { domain_name } from "./authentication.js";

export async function getTournamentsList() {
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		//		console.log("-Listing all tournaments");
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/list`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok) {
			console.log("getTournamentsList: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		if (data !== undefined)
			return (data);
		//		console.log("-");
	} catch (error) {
		console.error(`error caught: ${error}`);
	}
}

export async function createTournament(tour_info) {
	//	console.log("-creating a new tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/create`, {
			method: "POST",
			body: JSON.stringify(tour_info),
			headers: {
				"Accept": "application/json",
				"Authorization": `Bearer ${f_token}`,
				"Content-type": "application/json; charset=UTF-8",
			}
		})
		if (!r.ok) {
			console.log("createTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		if (data !== undefined) {
			return data;
		}
		//		console.log("-");
	} catch (error) {
		console.error("createTournament: ", error);
	}
}

export async function joinTournament(tour_id) {
	console.log("-Joining a tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}/join`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok) {
			console.log("joinTournament: Client/Server error");
			return;
		}
		const data = await r.json();
		//console.log("joinTournament data:");
		//console.log(data);
		if (data) {
			return data;
		}
		console.log("-");
	} catch (error) {
		console.error("joinTournament: ", error);
	}
}

export async function endTournament(tour_id) {
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${f_token}`,
			}
		})
		if (!r.ok) {
			console.log("deleteTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		//const data = await r.json();
		//console.log("deleteTournament data:");
		//console.log(data);
		//if (data) {
			//return data;
		//}
		//		console.log("-");
	} catch (error) {
		console.error("deleteTournament: ", error);
	}
}

export async function startTournament(tour_id) {
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}/start`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${f_token}`,
			}
		})
		if (!r.ok) {
			console.log("startTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("startTournament data:");
		console.log(data);
		if (data !== undefined) {
			return data;
		}
		//		console.log("-");
	} catch (error) {
		console.error("startTournament: ", error);
	}
}

export async function leaveTournament(tour_id) {
	console.log("-Leaving a tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}/leave`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${f_token}`,
			}
		})
		if (!r.ok) {
			console.log("leaveTournament: Client/Server error");
			return;
		}
		const data = await r.json();
		console.log("leaveTournament data:");
		console.log(data);
		if (data !== undefined) {
			return data;
		}
		console.log("-");
	} catch (error) {
		console.error("leaveTournament: ", error);
	}
}

export async function deleteTournament(tour_id) {
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}/delete`, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok) {
			console.log("deleteTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		//console.log("deleteTournament data:");
		//console.log(data);
		if (data !== undefined) {
			return data;
		}
		//		console.log("-");
	} catch (error) {
		console.error("deleteTournament: ", error);
	}
}

export async function setChampionTournament(tour_username) {
	//	console.log("-creating a new tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}/champion/update`, {
			method: "POST",
			body: JSON.stringify(tour_username),
			headers: {
				"Accept": "application/json",
				"Authorization": `Bearer ${f_token}`,
				"Content-type": "application/json; charset=UTF-8",
			}
		})
		if (!r.ok) {
			console.log("setChampionTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("setChampionTournament data:");
		console.log(data);
		if (data !== undefined) {
			return data;
		}
		//		console.log("-");
	} catch (error) {
		console.error("setChampionTournament: ", error);
	}
}

export async function getTournamentInfoById(tour_id) {
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok) {
			console.log("getTournamentsList: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		//console.log("getTournamentsList data:");
		//console.log(data);
		if (data !== undefined) {
			return (data);
		}
		console.log("-");
	} catch (error) {
		console.error("getTournamentsList: ", error);
	};
}

export async function updateTournamentsById(tour_id, tour_info) {
	console.log("-Updating tournaments by id");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tour_id}`, {
			method: "PUT",
			body: JSON.stringify(tour_info),
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok) {
			console.log("getTournamentsList: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("getTournamentsList data:");
		console.log(data);
		if (data !== undefined) {
			return (data);
		}
		console.log("-");
	} catch (error) {
		console.error("getTournamentsList: ", error);
	};
}


export async function getTournamentsGames(tournamentId) {
	let f_token = getCookie("token");
	if (f_token === null || f_token === "") {
		console.log("Token is null");
		return;
	}
	try {
		//		console.log("-Listing all tournaments games");
		const r = await fetch(`https://${domain_name}:8000/api/v1/tournament/${tournamentId}/game/list`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok) {
			console.log("getTournamentsGames: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		if (data !== undefined)
			return (data);
		//		console.log("-");
	} catch (error) {
		console.error(`error caught: ${error}`);
	}
}