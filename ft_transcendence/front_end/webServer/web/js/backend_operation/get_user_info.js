import { getCookie } from "../authentication/auth_cookie.js";

export async function	getMyInfo()
{
	console.log("-Obtaining user info");
	let f_token = getCookie("token");

	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch("http://127.0.0.1:8000/api/v1/profile/me", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getMyInfo: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getMyInfo data:");
				  console.log(data);
				  if (data !== undefined)
				  {
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
//				  showCookie();
			  })
		  .catch(error => {
			  console.error("getMyInfo: ", error);
		  });
	console.log("-");
}

export async function	getUserList()
{
	console.log("-Obtaining user list");
	let f_token = getCookie("token");

	if (f_token === null || f_token === "")
	{
		console.log("Token is null");
		return;
	}
    const r = await fetch("http://127.0.0.1:8000/api/v1/users", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("getUserList: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
				  console.log("getUserList:");
				  console.log(data);
			  })
		  .catch(error => {
			  console.error("getUserList: ", error);
		  });
	console.log("-");
}
