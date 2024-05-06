import { getCookie } from "../authentication/auth_cookie.js"

export async function uploadAvatar(formData)
{
	console.log("-uploadAvatar starting");
	let f_token = getCookie("token");

    const r = await fetch("http://127.0.0.1:8000/api/v1/profile/me/avatar", {
		method: "POST",
		body: formData,
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("uploadAvatar: Client/Server error");
				  return;
			  }
			  return response.text();
		  })
		  .then(data =>
			  {
				  console.log(data);
			  })
		  .catch(error => {
			  console.error("uploadAvatar: ", error);
		  });
	console.log("-");
}

export async function getAvatar(elemImageId)
{
	console.log("-getAvatar starting");
	let f_token = getCookie("token");

	try {
		const response = await fetch("http://127.0.0.1:8000/api/v1/profile/me/avatar", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${f_token}`
			}
		});		
		if (!response.ok)
		{
			console.log("getAvatar: Client/Server error");
			return ;
		}
		const data = await response.blob();
		const imageUrl = URL.createObjectURL(data);
		if (document.getElementById(elemImageId) !== null)
			document.getElementById(elemImageId).src = imageUrl;
		return (imageUrl);
	}
	catch(error)
	{
		console.error("getAvatar: ", error);
	}
	console.log("-");
}
