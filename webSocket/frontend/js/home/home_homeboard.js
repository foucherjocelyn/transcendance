function upperPanel()
{
	let panel_def = `<div class="h_upperpanel">
				<button id="h_tohome" name="to_homepage"></button>
				<button id="h_togame" name="to_game"></button>
				<button id="h_totournament" name="to_tournament"></button>
				<button id="h_to_myprofile" name="to_myprofile"></button>
				<button id="h_logout" name="logout"></button>
			</div>`;
	return (panel_def);
}

async function	drawHomePage()
{
	await getMyInfo();
	console.log("drawHomepage called");
	document.getElementById("frontpage").outerHTML =
		`<div id="chat"></div>
		<div id="frontpage">
			${upperPanel()}
		<div id="h_homepage">
			<div id="h_common_boards">
				<div id="h_player_board">
			<img id="p_player_img" src="../../ressource/avatar_default.png" onload="getAvatar('p_player_img')">\
			<p id="hpb_username">${getCookie("username")}</p>
			<p id="hpb_level">Level: ${getCookie("level")}</p>
<!--			<hr id="hpb_div1">  -->
				<div id="h_scoreboard">
				<table id="h_score">\
            <thead>\
              <tr id="hs_filter">\<!-- display in red or blue if defeat/victory  -->
				<th scope="col">Match name</th>\
                <th scope="col">Players</th>\
                <th scope="col">Score</th>\
				<th scope="col">Playtime</th>
                <th scope="col">Conclusion</th>\
<!-- Display player stats  -->
              </tr>\
            </thead>\
            <tbody id="htb_info">\
            </tbody>\
          </table>\
				</div>
				</div>\
      </div>\
	</div>\
</div>`;

	document.getElementById("h_to_myprofile").addEventListener("click", drawProfilePage);
	document.getElementById("h_togame").addEventListener("click", drawGame);
	document.getElementById("h_totournament").addEventListener("click", drawTournament);
	document.getElementById("h_logout").addEventListener("click", () => { signOut(); });
}

