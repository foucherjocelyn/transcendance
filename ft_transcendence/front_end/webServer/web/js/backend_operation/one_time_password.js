import { requestToken } from "./authentication.js";
import { notice } from "../authentication/auth_main.js";
import { getCookie } from "../authentication/auth_cookie.js";

export async function getOtpQR() {
    let f_username = {
        username: getCookie("username")
    };
    console.log("getOtpQR starting");
    let f_token = getCookie("token");
    console.log(f_token);
    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/auth/otp/qr-code", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${f_token}`
            }
        });
        if (!response.ok)
		{
            console.log("getOtpQR: Client/Server error");
            return;
        }
        const data = await response.blob();
		return URL.createObjectURL(data);
    }
	catch (error)
	{
        console.error("getOtpQR: ", error);
    }
}

export async function toggleOtpStatus()
{
	let f_username = {
		username: getCookie("username")
	};
	console.log("toggleOtp starting");
	let f_token = getCookie("token");
	await fetch("http://127.0.0.1:8000/api/v1/auth/otp/switch", {
		method: "POST",
		body: JSON.stringify(f_username),
		headers: {
			"Accept": "application/json",
			"Content-type": "application/json",
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("toggleOtp: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return ;
		  })
		  .catch(error => {
			  console.error("toggleOtp: ", error);
		  });
}

export async function sendOtp(connect_user)
{
	console.log("-OTP request received");
    await requestToken(connect_user);
	if (getCookie("token") === null || getCookie("token") === "")
		return ;
	let f_token = getCookie("token");
    const r = await fetch("http://127.0.0.1:8000/api/v1/auth/otp", {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${f_token}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("sendOtp: Client/Server error");
				  return;
				  //throw new Error("fetch POST op failed");
			  }
			  return response.json();
		  })
		  .then(data =>
			  {
			  	  notice("(debug)Your otp is displayed in the console", 3, "#37e6e6");
				  console.log(`Your otp is: ${data.otp}`);
			  })
		  .catch(error => {
			  console.error("sendOtp: ", error);
		  });
	console.log("-");
}

export async function getOtpStatusPw(f_log) {
    console.log("-getOtpStatusPw starting");
	console.log(f_log);
    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/auth/otp/status", {
            method: "POST",
			body: JSON.stringify(f_log),
            headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
            }
        });
        if (!response.ok)
		{
			console.log("response status = [" + response.status) + "]";
			return response.status;
        }
        const data = await response.json();
        return data.otpStatus;
    }
	catch (error)
	{
        console.error("getOtpStatusPw: ", error);
	}
	console.log("-");
	return (response);
}

export async function getOtpStatusToken() {
    console.log("-getOtpStatusToken starting");
    let f_token = getCookie("token");
//    console.log(f_token);
    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/auth/otp/status", {
            method: "GET",
            headers: {
				"Accept": "application/json",
				"Content-type": "application/json",
				"Authorization": `Bearer ${f_token}`
            }
        });
        if (!response.ok)
		{
            console.log("getOtpStatusToken: Client/Server error");
            return response.status;
        }
        const data = await response.json();
        return data.otpStatus;
    }
	catch (error)
	{
        console.error("getOtpStatusToken: ", error);
	}
	console.log("-");
	return (response);
}
