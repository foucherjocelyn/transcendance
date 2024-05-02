import { loadSpinner } from "../authentication/spinner.js";
import { upperPanel } from "./home_homeboard.js";
import { to_homePage } from "./home_homeboard.js";
import { to_tournament } from "./home_tournament.js";
import { to_profilePage } from "./home_changeprofile.js";

async function	drawGame(callback)
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">\
		${loadSpinner()}
		${upperPanel()}
		<div id="g_game" class="hide">\
			<img src="https://miro.medium.com/v2/resize:fit:800/1*uJO86STRG1ckfuxe56PJmQ.gif" style="display: block; margin: auto; margin-top: 10%; width: 40%;">\
		</div>\
	</div>
<div class="r_successinfo hide"></div>`;
	document.getElementById("h_to_home").addEventListener("click", to_homePage);
	document.getElementById("h_to_tournament").addEventListener("click", to_tournament);
	document.getElementById("h_to_myprofile").addEventListener("click", to_profilePage);
	document.getElementById("h_logout").addEventListener("click", () => { classy_signOut("g_game"); });
	callback(true);
}

export async function	to_game(nohistory = "false")
{
	if (nohistory === "false")
		history.pushState( { url: "game" }, "", "#game");
	await drawGame( (result) => {
		if (result)
		{
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("g_game").classList.remove("hide");
		}
	});
}
