import { getCookie } from "../authentication/auth_cookie.js";

export async function	getTournamentsList()
{
	console.log("-Listing all tournaments");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch("http://127.0.0.1:8000/api/v1/tournament/list", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getTournamentsList: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getTournamentsList data:");
				  console.log(data);
				  if (data !== undefined)
				  {
					  console.log("-=-=-===========data is workable");
					  return (data);
				  }
				  else
					  console.log("data is undefined==============----");
			  })
		  .catch(error => {
			  console.error("getTournamentsList: ", error);
		  });
	console.log("-");
}

export async function	createTournament(tour_info)
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
	console.log("-creating a new tournament");
	let f_token = getCookie("token");
	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch("http://127.0.0.1:8000/api/v1/tournament/create", {
		method: "POST",
		body: JSON.stringify(tour_info),
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("createTournament: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("createTournament data:");
				  console.log(data);
				  if (data !== undefined)
				  {
				  }
			  })
		  .catch(error => {
			  console.error("createTournament: ", error);
		  });
	console.log("-");
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
    const r = await fetch("http://127.0.0.1:8000/api/v1/tournament/${tour_id}/join", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("joinTournament: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("joinTournament data:");
				  console.log(data);
				  if (data !== undefined)
				  {
				  }
			  })
		  .catch(error => {
			  console.error("joinTournament: ", error);
		  });
	console.log("-");
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
    const r = await fetch("http://127.0.0.1:8000/api/v1/tournament/${tour_id}", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getTournamentsList: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getTournamentsList data:");
				  console.log(data);
				  if (data !== undefined)
				  {
					  return (data);
				  }
			  })
		  .catch(error => {
			  console.error("getTournamentsList: ", error);
		  });
	console.log("-");
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
    const r = await fetch("http://127.0.0.1:8000/api/v1/tournament/${tour_id}", {
		method: "PUT",
		body: JSON.stringify(tour_info),
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getTournamentsList: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getTournamentsList data:");
				  console.log(data);
				  if (data !== undefined)
				  {
				  }
			  })
		  .catch(error => {
			  console.error("getTournamentsList: ", error);
		  });
	console.log("-");
}
