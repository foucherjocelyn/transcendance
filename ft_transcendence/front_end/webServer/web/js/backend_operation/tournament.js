import { getCookie } from "../authentication/auth_cookie.js";

export async function	getTournamentsList()
{
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
	try {
//		console.log("-Listing all tournaments");
		const r = await fetch("https://localhost/api/v1/tournament/list", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok)
		{
			console.log("getTournamentsList: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		if (data !== undefined)
			return (data);
//		console.log("-");
	} catch(error)
	{
		console.error(`error caught: ${error}`);
	}
}

export async function	createTournament(tour_info)
{
//	console.log("-creating a new tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch("https://localhost/api/v1/tournament/create", {
			method: "POST",
			body: JSON.stringify(tour_info),
			headers: {
				"Accept": "application/json",
				"Authorization": `Bearer ${f_token}`,
				"Content-type": "application/json; charset=UTF-8",
			}
		})
		if (!r.ok)
		{
			console.log("createTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("createTournament data:");
		console.log(data);
		if (data !== undefined)
		{
			return data;
		}
//		console.log("-");
	} catch(error) {
		console.error("createTournament: ", error);
	}
}

export async function	joinTournament(tour_id)
{
	console.log("-Joining a tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://localhost/api/v1/tournament/${tour_id}/join`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok)
		{
			console.log("joinTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("joinTournament data:");
		console.log(data);
		if (data !== undefined)
		{
			return data;
		}
		console.log("-");
	} catch(error) {
		console.error("joinTournament: ", error);
	}
}

export async function	leaveTournament(tour_id)
{
	console.log("-Joining a tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch(`https://localhost/api/v1/tournament/${tour_id}/leave`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok)
		{
			console.log("joinTournament: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("joinTournament data:");
		console.log(data);
		if (data !== undefined)
		{
			return data;
		}
		console.log("-");
	} catch(error) {
		console.error("joinTournament: ", error);
	}
}

export async function	getTournamentInfoById(tour_id)
{
	console.log("-Get tournaments info by id");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch("https://localhost/api/v1/tournament/${tour_id}", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok)
		{
			console.log("getTournamentsList: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("getTournamentsList data:");
		console.log(data);
		if (data !== undefined)
		{
			return (data);
		}
		console.log("-");
	} catch(error) {
		console.error("getTournamentsList: ", error);
	};
}

export async function	updateTournamentsById(tour_id, tour_info)
{
/*
		//tour_info requires:
name: string,
description: string, // optional
start_date: Date, // Format: YYYY-MM-DD
end_date: Date, // Format: YYYY-MM-DD
status: "upcoming" | "ongoing" | "completed", // optional
will return a tournament object
*/
	console.log("-Updating tournaments by id");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
	try {
		const r = await fetch("https://localhost/api/v1/tournament/${tour_id}", {
			method: "PUT",
			body: JSON.stringify(tour_info),
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		})
		if (!r.ok)
		{
			console.log("getTournamentsList: Client/Server error");
			return;
			//throw new Error("fetch POST op failed");
		}
		const data = await r.json();
		console.log("getTournamentsList data:");
		console.log(data);
		if (data !== undefined)
		{
			return (data);
		}
		console.log("-");
	} catch(error) {
		console.error("getTournamentsList: ", error);
	};
}
