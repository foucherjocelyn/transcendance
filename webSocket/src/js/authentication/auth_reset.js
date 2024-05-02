import { to_connectForm } from "./auth_connect.js";

function resetPwRequest()
{
	console.log("--Reset password request received");
    //send pw request link to given mail
    //or check one time password
    //if (success)
    //	connectPage.classList.add('hide');
	console.log("--");
}

export function to_forgotForm(nohistory = "false")
{
	if (nohistory === "false")
		history.pushState( { url: "reset" }, "", "#reset");
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">
<!-- Connect page  -->\
      <div id="r_connect_page">
<div class="r_forgot_form">\
<form method="post" id="r_registration">\
                <input type="text" id="rf_forgot" name="rf_forgot" pattern="[^@]+@[^@]+\.[^@]+" title="Must be a mail address" placeholder="E-mail" required>\
                <br>\
                <input type="submit" value="Reset" id="rb_pwreset" name="rb_pwreset">\
</form>
              </div>\
<hr id="r_line2">\
        <p id="rb_back" name="rb_back" class="textlink">Back</p>\
	</div>
</div>
<div class="r_successinfo hide"></div>`
	document.getElementById("rb_back").addEventListener("click", to_connectForm);
	document.getElementById("r_registration").addEventListener("submit", function(event) { event.preventdefault(); resetPwRequest() });
}
