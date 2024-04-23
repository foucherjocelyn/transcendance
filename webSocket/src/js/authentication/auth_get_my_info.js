
import { getCookie } from "./auth_cookie.js";
import { notice } from "./auth_main.js";

export async function requestToken(f_log)
{
	console.log("--Requesting new token");
	try {
		const response = await fetch("http://127.0.0.1:8000/api/v1/token", {
			method: "POST",
			body: JSON.stringify(f_log),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
				//send refresh token in newer version when askins for token
			}
		});
//		console.log("requestToken status: " + response.status);
		if (!response.ok)
		{
			document.cookie = `token=; SameSite=Strict`;
console.log("requestToken: Client or Server error");
			return ;
		}
		const data = await response.json();
		console.log("New token generated:\n" + data.access);
		document.cookie = `token=; SameSite=Strict`;
		document.cookie = `token=${data.access}; SameSite=Strict`;
	}
	catch(error)
	{
		console.error("requestToken: ", error);
	}
	console.log("--");
}

export async function	getMyInfo()
{
//	console.log("--Obtaining user info");
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
//				  console.log("getMyInfo data:");
//				  console.log(data);
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
//				  showCookie();
			  })
		  .catch(error => {
			  console.error("getMyInfo: ", error);
		  });
//	console.log("--");
}

function checkPasswordChange()
{
	if (document.getElementById("p_oldpassword").value.length > 0 && document.getElementById("p_newpassword").value.length > 0 && document.getElementById("p_newpasswordconfirm").value.length > 0)
	{
		if (!(document.getElementById("p_newpassword").value === document.getElementById("p_newpasswordconfirm").value))
			console.log("new password and confirmation are different");
		console.log("new password is valid");
		return (true);
	}
	return (false);
}

async function dataUpdate(newInfo)
{
	console.log("----dataUpdate starting");
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
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("dataUpdate: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
//				  console.log("update info data:");
//				  console.log(data);
			  })
		  .catch(error => {
			  console.error("updateMyInfo: ", error);
		  });
	console.log("----");
}

export async function	updateMyInfo()
{
	console.log("----Updating user information");
	let changes = 0;
	let	newInfo = {
	};
	if (document.getElementById("p_username").value.length > 0)
	{
		newInfo.username = document.getElementById("p_username").value;
		changes = 1;
	}
	if (checkPasswordChange() === true)
	{
		newInfo.password = document.getElementById("p_newpassword").value;
		changes = 2;
	}
	if (document.getElementById("p_avatar").files.length > 0)
	{
		let avatarForm = new FormData();
		avatarForm.append("avatar", document.getElementById("p_avatar").files[0]);
		await uploadAvatar(avatarForm);
		changes = 3;
	}

	if (changes > 0)
		await dataUpdate(newInfo);

	const status = document.getElementById("p_2fa_enable").checked ? true : false;
	let	f_username = {
		username: getCookie("username")
	};
	const OtpStatus = await getOtpStatusToken();
	if (OtpStatus != status)
	{
		toggleOtpStatus();
		changes = 4;
	}
	if (changes > 0)
	{
		drawProfilePage();
		notice("Changes applied", 2, "#2c456e");
	}
	console.log("----");
}
