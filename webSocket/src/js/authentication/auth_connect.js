import { client, dataToServer } from "../client/client.js";
import { drawHomePage } from "../home/home_homeboard.js";
import { deleteAllCookie, getCookie } from "./auth_cookie.js";
import { getMyInfo } from "./auth_get_my_info.js";
import { authCheck, notice } from "./auth_main.js";
import { getOtpStatusPw } from "./auth_otp.js";
import { to_regisForm } from "./auth_register.js";
import { to_forgotForm } from "./auth_reset.js";

export async function signIn(connect_user)
{
	console.log("--Connecting user: ");
	console.log(connect_user);
    const r = await fetch(`http://127.0.0.1:8000/api/v1/auth/login`, {
		method: "POST",
		body: JSON.stringify(connect_user),
		headers: {
			"Accept": "application/json",
			"Content-type": "application/json; charset=UTF-8",
		}
    })
		  .then(response =>  {
			  console.log("response =");
			  console.log(response);
			  if (response.ok)
			  {
				  notice("Connection successful", 1, "#0c9605");
				  document.cookie = `username=${connect_user.username}; SameSite=Strict`;
				  authCheck();
			  }
			  else if (!response.ok)
			  {
				  notice("One of the given information is invalid", 1, "#D20000");
				  console.log("Your password or username is wrong");
				  return ;
			  }
			  return response.json();
		  })
	  .then(data =>
		  {
			  document.cookie = `refresh=${data.refresh}; SameSite=Strict`;
			  document.cookie = `token=${data.access}; SameSite=Strict`;
			  getMyInfo();
			  drawHomePage();
		  })
		  .catch(error => {
	      console.error("Sign in: ", error);
		  });
	if (getCookie("token") === null || getCookie("token") === "")
    {//need custom message when wrong OTP
		console.log("Username/Password invalid");
		notice("The username and/or password is invalid", 2, "#b00009");
	}
	console.log("--");
}

export async function signOut()
{
	console.log("----User is signing out: [" + getCookie("username") + "]");
	let f_username = {
		username: getCookie("username")
	};
	if (f_username.username === null || f_username.username === "")
	{
		console.log("signOut ERROR: no username defined");
		return ;
	}
    const r = await fetch(`http://127.0.0.1:8000/api/v1/auth/logout`, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${getCookie("token")}`
		}
    })
		  .then(response =>  {
			  if (!response.ok)
			  {
				  console.log("Error during disconnection");
//				  throw new Error("fetch POST op failed");
			  }
//			  console.log("logout status: " + response.status);
			  notice("You are now disconnected", 1, "#0c9605");
			  getMyInfo();
			  deleteAllCookie();
//			  document.cookie = `refresh=; SameSite=Strict`;
//			  document.cookie = `token=; SameSite=Strict`;
			  authCheck();
		  })
		  .catch(error => {
			  console.error("Error: ", error);
		  });
//	console.log("----");
}

async function checkConnect()
{
	console.log("-=Attempting to connect user");
	let connect_user = {
		username: document.getElementById("rc_username").value,
		password: document.getElementById("rc_password").value
    };
	const otpStatus = await getOtpStatusPw(connect_user);
	console.log("otpStatus = " + otpStatus);
	if (otpStatus === false)
	{
		await signIn(connect_user);
	}
	else if (otpStatus === true)
	{
		await to_otpForm(connect_user);
	}
	/*
	if (getCookie("token") != null && getCookie("token") != "")
	{ 
		const  sendData = new dataToServer('connection', client.inforUser, client.inforUser);
        client.socket.send(JSON.stringify(sendData));
	}
	*/
	console.log("-=");
}

export function to_connectForm()
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">\
<!-- Connection/Register page  -->\
      <div class="r_connect_page">\
			<div class="r_connect_form">\
			<form method="post" id="r_registration">
				<input type="text" id="rc_username" name="rc_username" placeholder="Username" required>\
           	<br>\
				<input type="password" id="rc_password" name="rc_password" placeholder="Password" required>\
            <br>\
		<input type="submit" value="Connection" id="rb_connect" name="rb_connect">
			</form>
			</div>\
        <hr id="r_line2">\
        <p id="rb_forgot" name="rb_forgot" class="textlink">Forgot password</p>\
        <p id="rb_signup" name="rb_signup" class="textlink">Create new account</p>\
	</div>\
</div>`;
	document.getElementById("chat").style.display = "none";

	document.getElementById("rb_signup").addEventListener("click", to_regisForm);
	document.getElementById("rb_forgot").addEventListener("click", to_forgotForm);
	document.getElementById("r_registration").addEventListener("submit", function(event) { event.preventDefault(); checkConnect(); });
}
