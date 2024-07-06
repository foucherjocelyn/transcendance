import { loadSpinner } from "../../authentication/spinner.js";
import { upperPanel, upperPanelEventListener } from "../upper_panel.js";
import { getMyInfo } from "../../backend_operation/get_user_info.js";
import { getCookie } from "../../authentication/auth_cookie.js";
import { to_connectForm } from "../../authentication/auth_connect.js";
import { create_match } from "../../createMatch/createMatch.js";
import { client, dataToServer } from "../../client/client.js";

export function noticeInvitePlayer() {
    return (
    `
    <!-------------------- Notice invitation play -------------------->
    <div id="noticeInvitationPlayLayer">
        <div id="avatarPlayerInvite"></div>
        <div id="noticeIvitationPlayPanel">
            <div id="contentInvitationPlay">
                <h3>From:</h3>
                <span>Content:</span>
            </div>
            <div id="acceptRejectBar">
                <button id="rejectInvitationPlayButton">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50" style="fill:#FFFFFF;">
                        <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                    </svg>
                </button>
                <button id="acceptInvitationPlayButton">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256" style="fill:#228BE6;">
                        <g fill="#228be6" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(3.55556,3.55556)"><path d="M57.658,12.643c1.854,1.201 2.384,3.678 1.183,5.532l-25.915,40c-0.682,1.051 -1.815,1.723 -3.064,1.814c-0.098,0.008 -0.197,0.011 -0.294,0.011c-1.146,0 -2.241,-0.491 -3.003,-1.358l-13.051,-14.835c-1.459,-1.659 -1.298,-4.186 0.36,-5.646c1.662,-1.46 4.188,-1.296 5.646,0.361l9.563,10.87l23.043,-35.567c1.203,-1.854 3.68,-2.383 5.532,-1.182z"></path></g></g>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    `);
}

function drawGame(callback) {
    document.querySelector("#frontpage").outerHTML =
    `
    <div id="frontpage">

        ${loadSpinner()}
        ${upperPanel()}

        <!--	Choose game mode		-->
        <div id="g_choose_mode">
        <p id="g_choose_mode_title">Choose a game mode</p>
            <button id="g_rankedmatch" class="button-img">Ranked Match</button>
        <br>
            <button id="g_creatematch" class="button-img">Create a match</button>
        <br>
            <button id="g_localmatch" class="button-img">Local game</button>
        </div>

        <div id="g_match_html" class="hide"></div>
        <div class="r_successinfo hide"></div>

        ${noticeInvitePlayer()}
        
    </div>  
    `;
	upperPanelEventListener("game");
    callback(true);
}

export function gameEventListener() {
    document.getElementById("g_rankedmatch").addEventListener("click", () => {
        create_match('ranked');
    });
    document.getElementById("g_creatematch").addEventListener("click", () => {
        create_match('with friends');
    });
    document.getElementById("g_localmatch").addEventListener("click", () => {
        create_match('offline');
    });
}

export async function to_game(nohistory = "false") {
    await getMyInfo();
	if (!getCookie("username"))
	{
		to_connectForm();
		return ;
	}
    if (nohistory === "false")
        history.pushState({ url: "game" }, "", "#game");
    const myInfo = await getMyInfo()
    let alias = myInfo.alias;
    drawGame((result) => {
        if (result) {
            document.getElementById("loadspinner").classList.add("hide");
            document.getElementById("g_match_html").classList.remove("hide");
                if (alias)
                    {
                        document.getElementById("g_rankedmatch").className = "button-img_disabled";
                        document.getElementById("g_creatematch").className = "button-img_disabled";
                        document.getElementById("g_localmatch").className = "button-img_disabled";
                    }
                else
                    gameEventListener();
        }
    });
}
