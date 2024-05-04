import { loadSpinner } from "./spinner.js";
import { to_regisForm } from "./auth_register.js";
import { to_forgotForm } from "./auth_reset.js";
import { to_otpForm } from "./auth_otp.js";
import { signIn } from "../backend_operation/authentication.js";
import { signOut } from "../backend_operation/authentication.js";
import { getOtpStatusPw } from "../backend_operation/one_time_password.js";
import { getMyInfo } from "../backend_operation/get_user_info.js";

export async function	classy_signOut(sourcename)
{
	if (document.getElementById(sourcename) !== undefined
		&& document.getElementById("loadspinner") !== undefined
		&& document.getElementById(sourcename) !== null
		&& document.getElementById("loadspinner") !== null)
	{
		document.getElementById(sourcename).classList.add("hide");
		document.getElementById("loadspinner").classList.remove("hide");
	}
	await signOut();	
}

async function checkConnect()
{
	console.log("-=Attempting to connect user");
	document.getElementById("r_connect_page").classList.add("hide");
	console.log(document.getElementById("loadspinner"));
	document.getElementById("loadspinner").classList.remove("hide");
	let connect_user = {
		username: document.getElementById("rc_username").value,
		password: document.getElementById("rc_password").value
    };
	const otpStatus = await getOtpStatusPw(connect_user);
//	console.log("otpStatus = " + otpStatus);
	if (otpStatus === false)
	{
		await signIn(connect_user);
	}
	else if (otpStatus === true)
	{
		await to_otpForm(connect_user);
	}
	else
	{
		document.getElementById("r_connect_page").classList.remove("hide");
		document.getElementById("loadspinner").classList.add("hide");		
	}
	console.log("-=");
}

function load_connectForm(callback)
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">
		${loadSpinner()}
<!-- Connection/Register page  -->
      <div id="r_connect_page" class="hide">
			<div id="r_connect_form">
			<form method="post" id="r_registration">
				<input type="text" id="rc_username" name="rc_username" placeholder="Username" required>
           	<br>
				<input type="password" id="rc_password" name="rc_password" placeholder="Password" required>
            <br>
		<input type="submit" value="Connection" id="rb_connect" name="rb_connect">
			</form>
			</div>
        <hr id="r_line2">
        <p id="rb_forgot" name="rb_forgot" class="textlink">Forgot password</p>
        <p id="rb_signup" name="rb_signup" class="textlink">Create new account</p>
	</div>
</div>
<div class="r_successinfo hide"></div>
`;
	document.getElementById("rb_signup").addEventListener("click", to_regisForm);
	document.getElementById("rb_forgot").addEventListener("click", to_forgotForm);
	document.getElementById("r_registration").addEventListener("submit", function(event) { event.preventDefault(); checkConnect(); });
	callback(true);
}

export function to_connectForm(nohistory = "false")
{
	if (nohistory === "false")
		history.pushState( { url: "connection" }, "", "#connection");
	load_connectForm((result) =>
		{
			if (result)
			{
				document.getElementById("loadspinner").style.display = 'none';
				document.getElementById("r_connect_page").classList.remove("hide");
			}
		}
	);
}
