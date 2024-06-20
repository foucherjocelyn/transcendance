import { loadSpinner } from "./spinner.js";
import { to_regisForm } from "./auth_register.js";
import { to_otpForm } from "./auth_otp.js";
import { notice } from "./auth_main.js";
import { signIn, signOut } from "../backend_operation/authentication.js";
import { getOtpStatusPw } from "../backend_operation/one_time_password.js";
import { updateMyInfo } from "../backend_operation/data_update.js";
import { client, dataToServer } from "../client/client.js";
//import { request42Login } from "../backend_operation/forty_two_login.js";

export async function classy_signOut(sourcename) {
	let source;
	if (sourcename === "game")
		source = "g_game";
	else if (sourcename === "tournament")
		source = "h_tournament_page";
	else if (sourcename === "home")
		source = "h_homepage";
	else if (sourcename === "myprofile")
		source = "h_myprofile";
	else if (sourcename === "profilepage")
		source = "inspectprofile_page";
	if (document.getElementById(source) !== undefined
		&& document.getElementById("loadspinner") !== undefined
		&& document.getElementById(source) !== null
		&& document.getElementById("loadspinner") !== null) {
		document.getElementById(source).classList.add("hide");
		document.getElementById("loadspinner").classList.remove("hide");
	}
	await signOut();
	const send_data = new dataToServer('disconnect', "", 'socket server');
	client.socket.send(JSON.stringify(send_data));
}

async function checkConnect() {
	console.log("-=Attempting to connect user");
	document.getElementById("r_connect_page").classList.add("hide");
	document.getElementById("loadspinner").classList.remove("hide");
	let connect_user = {
		username: document.getElementById("rc_username").value,
		password: document.getElementById("rc_password").value
	};
	const otpStatus = await getOtpStatusPw(connect_user);
	//	console.log("otpStatus = " + otpStatus);
	updateMyInfo();
	if (otpStatus === false) {
		await signIn(connect_user);
	}
	else if (otpStatus === true) {
		await to_otpForm(connect_user);
	}
	else {
		if (otpStatus >= 400 && otpStatus < 500)
			notice("Wrong Username/Password combination", 0, "#D20000");
		document.getElementById("r_connect_page").classList.remove("hide");
		document.getElementById("loadspinner").classList.add("hide");
	}
	console.log("-=");
}

async function request42Login() {
    return new Promise((resolve, reject) => {
		//let response = await axios.get();

        let oauth2Endpoint = "https://api.intra.42.fr/oauth/authorize";

        let form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        let params = {
            "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
            "redirect_uri": "https://127.0.0.1:5500/",
            "scope": "",
            "state": "pass-through-value",
            "response_type": "code"
        };

        for (var p in params) {
            let input = document.createElement("input");
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Écouter l'événement de soumission du formulaire
        form.addEventListener('submit', () => {
            resolve(); // Résoudre la promesse lorsque le formulaire est soumis
        });

        document.body.appendChild(form);
        form.submit();
    });
}


function load_connectForm(callback) {
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
      <!--  <p id="rb_forgot" name="rb_forgot" class="textlink">Forgot password</p> -->
        <p id="rb_signup" name="rb_signup" class="textlink">Create new account</p>
		<p id="rb_signup42" name="rb_signup42" class="textlink">Login with 42</p>
	</div>
</div>
<div class="r_successinfo hide"></div>
`;
	document.getElementById("rb_signup").addEventListener("click", to_regisForm);
	document.getElementById("rb_signup42").addEventListener("click", async () => {
		console.log("login42 clicked");
		await request42Login();
		const sendData = new dataToServer('connection_42', "", 'socket server');
		client.socket.send(JSON.stringify(sendData));
		//let data = await axios.get("https://localhost:5500/json");
		//console.log(data);
		console.log("The login 42 click ended------------------------");
	});
	document.getElementById("r_registration").addEventListener("submit", function (event) { event.preventDefault(); checkConnect(); });
	callback(true);
}

export function to_connectForm(nohistory = "false") {
	if (nohistory === "false")
		history.pushState({ url: "connection" }, "", "#connection");
	load_connectForm((result) => {
		if (result) {
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("r_connect_page").classList.remove("hide");
		}
	}
	);
}
