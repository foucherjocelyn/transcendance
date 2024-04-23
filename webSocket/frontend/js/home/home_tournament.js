async function drawTournament()
{
	document.getElementById("frontpage").outerHTML =
	`			<div id="chat"></div>
		<div id="frontpage">
			${upperPanel()}
				<div id="h_tournament_page">
					<div id="h_tournament_board">\
						<div class="t_sort_head">\
					<input id="htb_search" name="search" type="text" placeholder="Search for a Tournament">\
		            <button type="button" id="htb_mglass" name="mglass"></button>\
        		    <select id="htb_dropdown" name="options">\
		              <option value="upcoming" selected>Upcoming</option>\
        		      <option value="ongoing">Ongoing</option>\
             		  <option value="finished">Finished</option>\
		            </select>\
        				</div>\
          <hr id="htb_sep" name="t_sep" class="t_separator">\
          <table id="t_tournament">\
            <thead>\
              <tr id="htb_filter">\
                <th scope="col">Name</th>\
				<th scope="col">Player</th>\
                <th scope="col">Time</th>\
                <th scope="col">Rating</th>\
              </tr>\
            </thead>\
            <tbody id="htb_info">\
            </tbody>\
          </table>\
          <button class="button-img" type="button" id="htb_temp" name="temp">Add label (debug)</button>\
				</div>
			</div>
		</div>
`;
	document.getElementById("h_tohome").addEventListener("click", () => { drawHomePage(); });
	document.getElementById("h_to_myprofile").addEventListener("click", drawProfilePage);
	document.getElementById("h_togame").addEventListener("click", drawGame);
	document.getElementById("htb_temp").addEventListener("click", addLabel);
	document.getElementById("htb_mglass").addEventListener("click", searchLabel);
	document.getElementById("h_logout").addEventListener("click", () => { signOut(); });

}

function	 addLabel()
{
//	label_index++;
//	console.log(`adding new label: ${label_index}`);
	let newLabel;
	newLabel = `<tr class="t_tourlabel"><th scope="row">tour_name</td> <td>tour_playernb</td> <td>tour_time</td> <td>tour_rating</td><button id="t_joinbutton">Join</button></tr>`;
	document.getElementById("htb_info").insertAdjacentHTML("beforeend", newLabel);
}

function 	searchLabel()
{
	if (document.getElementById("t_search").value !== "")
	{
		let foundLabel = "";
		tournInfo.insertAdjacentHTML("beforeend", foundLabel);
	}
}
