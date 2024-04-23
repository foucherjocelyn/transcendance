import { to_connectForm } from "./auth_connect.js";
import { notice } from "./auth_main.js";

async function postUser(new_user)
{
	console.log("-Registering new user into database");
	console.log(new_user);
    const r = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
		method: "POST",
		body: JSON.stringify(new_user),
		headers: {
			"Accept": "application/json",
			"Content-type": "application/json; charset=UTF-8"
		}
    })
		  .then(response =>  {
			  console.log("status = " + response.status);
			  notice("Your account was succesfully created", 2, "#0c9605");
			  to_connectForm();
			  if (!response.ok)
			  {
				  notice("Given information invalid (mail or username is already taken)", 2, "#fc2403");
				  console.log("Client error");
				  return ;
		  }
			  return response.json();
		  })
		  .then(data => {
			  console.log(data);
		  })
	  .catch(error => {
	      console.error("postUser :", error);
	  });
	console.log("-");
}

async function sendForm()
{
	console.log("=Verifying given information");
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
    await postUser(new_user);
	console.log("=");
}

export function to_regisForm()
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">\
<!-- Connect/register page  -->\
      <div class="r_connect_page">\
<!-- Register form -->\
        <div class="r_connect_info">\
          <form method="post" id="r_registration">\
            <div class="r_regis_form">\
              <input type="text" id="r_username" name="r_username" placeholder="Username" required>\
              <br>\
              <input type="password" id="r_password" name="r_password" placeholder="Password (a-z A-Z 0-9)" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{6,12}$" title="Must contains at least one number, one uppercase and one lowercase letter, and 6 to 12 characters" required>\
              <br>\
			  <input type="password" id="r_passwordconfirm" placeholder="Confirm your password" title="Must be the same as the password" required>
			  <br>
              <input type="text" id="r_firstname" name="r_firstname" placeholder="Firstname" title="Cannot be changed later" required>\
              <br>\
              <input type="text" id="r_lastname" name="r_lastname" placeholder="Lastname" title="Cannot be changed later" required>\
<!--\
              <br>\
              <input type="date" id="r_dob" name="r_dob" title="Cannot be changed later" required>\
-->\
              <br>\
              <input type="text" id="r_email" name="r_email" pattern="[^@]+@[^@]+\.[^@]+" title="Must be a mail address" placeholder="E-mail" required>\
<!--\
              <label for="bio" style="white-space: nowrap; display: block; margin-left: 48px; margin-bottom: 5px;">Write something about yourself(optional):<br>\
                <textarea id="bio" rows="3" cols="30" maxlength="90"  style="margin-left: 30px; resize: none;" placeholder="Mama told me time is an illusion so I hit her with an hourglass and asked if pain was an illusion"></textarea>\
              </label>\
-->\
              <br>\
              <input type="submit" value="Create account" id="rb_submit" name="rb_submit">\
</div>\
            </form>\
        </div>\
        <hr id="r_line2">\
	<p id="rb_signin" name="rb_signin" class="textlink">Already have an account ?</\
p>\
</div>\
</div>`;
	document.getElementById("r_registration").addEventListener("submit", function(event) { event.preventDefault(); sendForm(); });
	document.getElementById("rb_signin").addEventListener("click", to_connectForm);
}
