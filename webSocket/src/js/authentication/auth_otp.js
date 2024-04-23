import { signIn } from "./auth_connect.js";
import { notice } from "./auth_main.js";

async function	checkInput2FA()
{
	const OtpStatus = await getOtpStatusToken();
	console.log("CheckInput2FA");
	console.log(OtpStatus);
	if (OtpStatus === true)
	{
		document.getElementById("p_2fa_enable").setAttribute("checked", "");
		const	qrCode = await getOtpQR();
		document.getElementById("p_2fa").insertAdjacentHTML("afterend", `<img id="p_qr_code" name="qr_code" src="${qrCode}">`);
	}
	else if (OtpStatus === false)
		document.getElementById("p_2fa_disable").setAttribute("checked", "");
}

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

export async function getOtpStatusPw(f_log) {
    console.log("--getOtpStatusPw starting");
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
			if (response.status === 404)
				notice("Wrong Username/Password combination", 0, "#D20000");
			else
				console.log("getOtpStatusPw: Client/Server error");
			return;
        }
        const data = await response.json();
        return data.otpStatus;
    }
	catch (error)
	{
        console.error("getOtpStatusPw: ", error);
	}
	console.log("--");
}

export async function getOtpStatusToken() {
    console.log("--getOtpStatusToken starting");
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
            return;
        }
        const data = await response.json();
        return data.otpStatus;
    }
	catch (error)
	{
        console.error("getOtpStatusToken: ", error);
	}
	console.log("--");
}

export async function sendOtp(connect_user)
{
/*
	if (document.getElementById("rc_username").value.length === 0)
	{
		notice("Need Username", 2, "#fc0335");
		return ;
	}
	else if (document.getElementById("rc_password").value.length === 0)
	{
		notice("Need Password", 2, "#fc0335");
		return ;
	}
*/
	console.log("==OTP request received");
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
	console.log("==");
}

export async function to_otpForm(connect_user)
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">\
      <div class="r_connect_page">\
			<divclass="r_connect_form">\
			<form method="post"  id="r_registration">
				<input type="text" id="rc_otp" name="rc_otp" placeholder="2FA" required>
				<button type="button" id="rc_otp_send" name="rc_otp_send">Send</button>
				<br>
				<input type="submit" value="Connection" id="rb_connect" name="rb_connect">
			</form>
			</div>
		</div>
	</div>`;
	document.getElementById("rc_otp_send").addEventListener("click", () => { sendOtp(connect_user); });
	document.getElementById("r_registration").addEventListener("submit", async function(event) {
		event.preventDefault();
 		if (document.getElementById("rc_otp").value.length > 0)
			connect_user.otp = document.getElementById("rc_otp").value;
		await signIn(connect_user);
	});
}
