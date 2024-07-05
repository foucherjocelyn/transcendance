import { loadSpinner } from "./spinner.js";
import { getCookie } from "./auth_cookie.js";
import { signIn } from "../backend_operation/authentication.js";
import { getOtpQR } from "../backend_operation/one_time_password.js";
import { sendOtp } from "../backend_operation/one_time_password.js";
import { getOtpStatusToken } from "../backend_operation/one_time_password.js";

export async function	checkInput2FA()
{
	const OtpStatus = await getOtpStatusToken();
	if (OtpStatus === true)
	{
		document.getElementById("p_2fa_enable").setAttribute("checked", "");
		const	qrCode = await getOtpQR();
		document.getElementById("p_2fa").insertAdjacentHTML("afterend", `
			<img id="p_qr_code" name="qr_code" src="${qrCode}">
			`);
	}
	else if (OtpStatus === false)
		document.getElementById("p_2fa_disable").setAttribute("checked", "");
}

async function load_otpForm(connect_user)
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">
	${loadSpinner()}
      <div id="r_connect_page" class="hide">
			<divclass="r_connect_form">
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
		document.getElementById("loadspinner").classList.remove("hide");
		document.getElementById("r_connect_page").classList.add("hide");
		await signIn(connect_user);
		if (getCookie("status") === "offline")
		{
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("r_connect_page").classList.remove("hide");
		}
	});
}

export async function	to_otpForm(connect_user)
{
	history.pushState( { url: "otp" }, "", "#otp");
	await load_otpForm(connect_user);
	document.getElementById("loadspinner").classList.add("hide");
	document.getElementById("r_connect_page").classList.remove("hide");
}
