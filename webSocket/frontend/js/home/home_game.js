function	drawGame()
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">\
		${upperPanel()}
		<div id="game">\
			<img src="https://miro.medium.com/v2/resize:fit:800/1*uJO86STRG1ckfuxe56PJmQ.gif" style="display: block; margin: auto; margin-top: 10%; width: 40%;">\
		</div>\
	</div>`;
	document.getElementById("h_tohome").addEventListener("click", drawHomePage);
	document.getElementById("h_to_myprofile").addEventListener("click", drawProfilePage);
	document.getElementById("h_totournament").addEventListener("click", drawTournament);
	document.getElementById("h_logout").addEventListener("click", () => { signOut(); });
}
