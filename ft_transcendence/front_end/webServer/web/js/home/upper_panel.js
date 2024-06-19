import { to_homePage } from "./home_homeboard.js";
import { to_game } from "./game/home_game.js";
import { to_profilePage } from "./profile/home_changeprofile.js";
import { aliasJoinTournament, to_tournament } from "./tournament/home_tournament.js";
import { classy_signOut } from "../authentication/auth_connect.js";

export function upperPanel()
{
	let panel_def = `
		<div id="h_upperpanel">
			<nav class="h_upperpanel">
				<button id="h_to_home" name="to_homepage"></button>
				<button id="h_to_game" name="to_game"></button>
				<button id="h_to_tournament" name="to_tournament"></button>
				<button id="h_to_myprofile" name="to_myprofile"></button>
				<button id="h_logout" name="logout"></button>
			</nav>
		</div>
`;
	return (panel_def);
}

export function	upperPanelEventListener(source)
{
//	document.getElementById(`h_to_${source}`).setAttribute("style", "margin-top: 5px;");
	document.getElementById("h_to_game").addEventListener("click", function() {
		to_game();
	});
	document.getElementById("h_to_home").addEventListener("click", function() {
		to_homePage();
	});
	document.getElementById("h_to_tournament").addEventListener("click", function() {
		//to_tournament();
		aliasJoinTournament();
	});
	document.getElementById("h_to_myprofile").addEventListener("click", function() {
		to_profilePage();
	});
	document.getElementById("h_logout").addEventListener("click", () => { classy_signOut(`${source}`); });
}

