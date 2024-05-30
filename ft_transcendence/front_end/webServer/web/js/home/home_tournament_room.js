import { loadSpinner } from "../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "./upper_panel.js";
import { noticeInvitePlayer } from "./home_game.js";
import { loadChat } from "../chat/load-chat.js";
import { to_connectForm } from "../authentication/auth_connect.js";
import { to_tournament } from "./home_tournament.js";
import { join_the_tournament } from "../createMatch/createMatch.js";

async function  drawWaitingRoom(callback)
{
	document.getElementById("frontpage").outerHTML =
		`<div id="frontpage">
			${loadSpinner()}
			${upperPanel()}
			<div id="tournament_waiting_room" class="hide">

			</div>
			<br>
			<div id="chat"></div>
			<div class="r_successinfo hide"></div>
			${noticeInvitePlayer()}
		</div>
`;
    callback(true);
}

function    checkRegistration()
{
    join_the_tournament(document.getElementById("tour_inputalias").value, tour_obj.id);
	joinTournament(tour_obj.id);
}

export async function to_tournamentWaitingRoom(nohistory = "false", tour_obj)
{
    checkRegistration(tour_obj);
	await getMyInfo();
	if (!getCookie("username"))
	{
		to_connectForm();
		return ;
	}
	if (nohistory === "false")
		history.pushState( { url: "tournament_room" }, "", "#tournament_room");
	drawWaitingRoom( (result) => {
		if (result)
		{
			document.getElementById("loadspinner").classList.add("hide");
			document.getElementById("tournament_waiting_room").classList.remove("hide");
			loadChat();
		}
	});
}
