import { to_connectForm } from "./auth_connect.js";
import { loadSpinner } from "./spinner.js"
import { postUser } from "../backend_operation/authentication.js"
import { notice } from "./auth_main.js";

export async function sendForm()
{
	console.log("=Verifying given information");
	document.getElementById("r_connect_page").classList.add("hide");
	document.getElementById("loadspinner").classList.remove("hide");
	if (document.getElementById("r_password").value != document.getElementById("r_passwordconfirm").value)
	{
		notice("Your password/confirmation does not match", 2, "#a83238");
		return ;
	}
    let new_user = {
		username: document.getElementById("r_username").value,
		password: document.getElementById("r_password").value,
		email: document.getElementById("r_email").value,
		first_name: document.getElementById("r_firstname").value,
		last_name: document.getElementById("r_lastname").value,
    };
    let register_status = await postUser(new_user);
	document.getElementById("loadspinner").classList.add("hide");
	console.log(register_status);
	if (register_status >= 400 && register_status < 500)
		document.getElementById("r_connect_page").classList.remove("hide");
	if (register_status >= 200 && register_status < 300)
		to_connectForm();
	console.log("=");
}

async function load_regisForm(callback)
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">
		${loadSpinner()}
<!-- Register form -->
	<div id="r_connect_page" class="hide">
        <div id="r_connect_info">
          <form method="post" id="r_registration">
            <div id="r_regis_form">
              <input type="text" id="r_username" name="r_username" placeholder="Username" pattern="[a-zA-Z0-9]{3,20}" title="Alphanumeric only" required>
              <br>
              <input type="password" maxlength="30" id="r_password" name="r_password" placeholder="Password (a-z A-Z 0-9)" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,30}$" title="Must contains at least one number, one uppercase and one lowercase letter, and 6 to 30 characters" required>
              <br>
			  <input type="password" maxlength="30" id="r_passwordconfirm" placeholder="Confirm your password" title="Must be the same as the password" required>
			  <br>
              <input type="text" id="r_firstname"name="r_firstname" placeholder="Firstname" title="Letters only" pattern="[a-zA-Z]{3,20}" required>
              <br>
              <input type="text" id="r_lastname" name="r_lastname" placeholder="Lastname" title="Letters only" pattern="[a-zA-Z]{3,20}" required>
<!--
              <br>
              <input type="date" id="r_dob" name="r_dob" title="Cannot be changed later" required>
-->
              <br>
              <input type="text" id="r_email" name="r_email" pattern="[^@]+@[^@]+\.[^@]+" title="Must be a mail address" placeholder="E-mail" maxlength="320" required>
<!--
              <label for="bio" style="white-space: nowrap; display: block; margin-left: 48px; margin-bottom: 5px;">Write something about yourself(optional):<br>
                <textarea id="bio" rows="3" cols="30" maxlength="90"  style="margin-left: 30px; resize: none;" placeholder="Mama told me time is an illusion so I hit her with an hourglass and asked if pain was an illusion"></textarea>
              </label>
-->
              <br>
              <input type="submit" value="Create account" id="rb_submit" name="rb_submit">
</div>
            </form>
        </div>
        <hr id="r_line2">
	<p id="rb_signin" name="rb_signin" class="textlink">Already have an account ?</
p>
			</div>
		</div>
	</div>
<div class="r_successinfo hide"></div>`;
	document.getElementById("r_registration").addEventListener("submit", function(event) { event.preventDefault(); sendForm(); });
	document.getElementById("rb_signin").addEventListener("click", to_connectForm);
	callback(true);
}

export async function to_regisForm(nohistory = "false")
{
	if (nohistory === "false")
		history.pushState( { url: "register" }, "", "#register");
	await	load_regisForm( (result) => {
		if (result)
		{
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("r_connect_page").classList.remove("hide");
		}
	});
}
