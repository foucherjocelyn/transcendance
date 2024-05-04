import { loadSpinner } from "../authentication/spinner.js";
import { upperPanel } from "./home_homeboard.js";
import { to_homePage } from "./home_homeboard.js";
import { to_tournament } from "./home_tournament.js";
import { to_profilePage } from "./home_changeprofile.js";
import { classy_signOut } from "../authentication/auth_connect.js";
import { create_match } from "../createMatch/createMatch.js";
import { client, user } from "../client/client.js";
import { getCookie } from "../authentication/auth_cookie.js";

async function	drawGame(callback)
{
	document.querySelector("#frontpage").outerHTML =
		`<div id="frontpage">
		${loadSpinner()}
		${upperPanel()}
		    <!-------------------- Loader match making -------------------->
    <div id="loaderMatchmakingLayer">
        <div class="loading">
            <div class="loading-box">
              <div class="WH color l1"></div>
              <div class="ball color"></div>
              <div class="WH color l2"></div>
            </div>
        </div>          
    </div>

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

    <!-------------------- Create match Layer -------------------->
    <div id="createMatchLayer">

        <!--------------------  -------------------->
        <button id="cancelCreateMatchButton">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256" style="fill:#40C057;">
                <g fill="#40c057" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M4.70703,3.29297l-1.41406,1.41406l7.29297,7.29297l-7.29297,7.29297l1.41406,1.41406l7.29297,-7.29297l7.29297,7.29297l1.41406,-1.41406l-7.29297,-7.29297l7.29297,-7.29297l-1.41406,-1.41406l-7.29297,7.29297z"></path></g></g>
            </svg>
        </button>

        <!--------------------  -------------------->
        <button id="startCreateMatchButton">
            <div></div>
            <h1>Start</h1>
        </button>

        <!--------------------  -------------------->
        <div id="addPlayerLayer"></div>
    </div>

    <!-------------------- Invitation play Layer -------------------->
    <div id="invitationPlayLayer">

        <!--------------------  -------------------->
        <button id="cancelInvitationPlayButton">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256" style="fill:#40C057;">
                <g fill="#40c057" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M4.70703,3.29297l-1.41406,1.41406l7.29297,7.29297l-7.29297,7.29297l1.41406,1.41406l7.29297,-7.29297l7.29297,7.29297l1.41406,-1.41406l-7.29297,-7.29297l7.29297,-7.29297l-1.41406,-1.41406l-7.29297,7.29297z"></path></g></g>
            </svg>
        </button>

        <!--------------------  -------------------->
        <div id="invitationPlayPanel">

            <!--------------------  -------------------->
            <div id="searchInvitationPlayBar">

                <!--------------------  -------------------->
                <input type="search" id="searchInvitationPlayInput" placeholder="Search ...">
                
                <!--------------------  -------------------->
                <button id="clearInvitationPlayButton">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32" style="fill:#22C3E6;">
                        <path d="M 11 2 L 11 4 L 21 4 L 21 2 L 11 2 z M 4 6 L 4 8 L 28 8 L 28 6 L 4 6 z M 7.9921875 9.875 L 6.0078125 10.125 C 6.0078125 10.125 7 18.074074 7 27 L 7 28 L 25 28 L 25 27 C 25 18.074074 25.992188 10.125 25.992188 10.125 L 24.007812 9.875 C 24.007812 9.875 23.120303 17.398914 23.042969 26 L 8.9570312 26 C 8.8796974 17.398914 7.9921875 9.875 7.9921875 9.875 z M 12.986328 10.835938 L 11.013672 11.164062 C 11.013672 11.164062 12 17.111111 12 23 L 14 23 C 14 16.888889 12.986328 10.835936 12.986328 10.835938 z M 19.013672 10.835938 C 19.013672 10.835938 18 16.888889 18 23 L 20 23 C 20 17.111111 20.986328 11.164064 20.986328 11.164062 L 19.013672 10.835938 z"></path>
                    </svg>
                </button>
                
                <!--------------------  -------------------->
                <button id="searchInvitationPlayButton">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256" style="fill:#22C3E6;">
                        <g fill="#22c3e6" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M10,2c-4.40347,0 -8,3.59653 -8,8c0,4.40347 3.59653,8 8,8c1.75213,0 3.37052,-0.57793 4.69141,-1.54102l5.1543,5.1543c0.31352,0.32654 0.77908,0.45808 1.21713,0.34388c0.43805,-0.1142 0.78014,-0.45628 0.89433,-0.89433c0.1142,-0.43805 -0.01734,-0.90361 -0.34388,-1.21713l-5.1543,-5.1543c0.96309,-1.32088 1.54102,-2.93928 1.54102,-4.69141c0,-4.40347 -3.59653,-8 -8,-8zM10,4.5c3.05237,0 5.5,2.44763 5.5,5.5c0,3.05237 -2.44763,5.5 -5.5,5.5c-3.05237,0 -5.5,-2.44763 -5.5,-5.5c0,-3.05237 2.44763,-5.5 5.5,-5.5z"></path></g></g>
                    </svg>
                </button>
            </div>

            <!--------------------  -------------------->
            <div id="resultsSearchInvitationPlayPanel"></div>

        </div>

    </div>
    
    <!-------------------- Game layer -------------------->
    <div id="gameLayer">

        <!-------------------- Countdown -------------------->
        <div id="countdownLayer">
            <span>3</span>
        </div>

        <!-------------------- Game intructions -------------------->
        <div id="gameInstructionsLayer">
            <div id="gameInstructionsPanel"></div>
        </div>

        <!-------------------- Game Settings -------------------->
        <div id="gameSettingsLayer">

            <!--------------------  -------------------->
            <div id="gameSettingButton">
                <button>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACBElEQVR4nK2Wy0qcQRCFR9zFzETNRl9B8wqC97XEC4bZB8MMinEl6iLRTRbBF8gTREG3voGGmAxewE0iJLsQdWICiS7mk4LTULY9F+IcaPj5q/qcnlPVNX8m0wCAPuAH8Be4An4C05lmAXjDXbxvpsDnhMA50Hpf4klgj+rYBcYbJRuUt5vAc2BbJAfAHNALtGn16t2hciy3H1gEdoCRmNw2fY1O9w94AXQDa7Lpj9YnYBXoAgoqvMepcXqBlQT5gCy6rGGRxSb062ORZX/6chScEXmF+qhIpJhoglwQWXeBA9niT/7NiglktcaAExf/JbuO3LsPlhsEWoB3CszJc0/emWiKDsUCXgPzev4ItMcb7ISGHqDkNo7XaeMAK/wTPedTyUE9G9mTrSGQc3mX2mtYSCUv/IfAo6gOQWA+lZx3FvnRMFZDYKqKRbdttYKoMKHIdokCTqygCfLHwHeX98rZbA3TEhKzaqmAQ7Vc3KaT8jynk3vysvYcu3frvlB2KTwKujwV6sNyngKz0fsL4EEQWY6Cdu2HJGLFq4ayyIeB6yi25P1s04CKRYr66XaJ9oHfWvvyvEsnj8m/3Bp2EhnVqF3U6A3j+kjFsw55qGXPL53nWxrxmxr5/dU6L3W7d5vyh1NDpBU4S5CX7kUciWwkBN42U+CZvLXC26eLfcIMNrL5BpiAXtJiIvepAAAAAElFTkSuQmCC">
                    <span>Setting</span>
                </button>
            </div>

            <!--------------------  -------------------->
            <div id="gameSettingPanel">
                <div>
                    <div id="gameSettingBar">
                        <button>Size</button>
                        <button>Color</button>
                        <button>Speed</button>
                        <button>Control</button>
                    </div>

                    <!--------------------  -------------------->
                    <div id="gameSettingContents">
                        
                        <!-------------------- Settings size panel -------------------->
                        <div id="settingSizePanel">

                            <!-------------------- Settings size table -------------------->
                            <div class="gameSettingName">
                                <span>Table</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingSizeTable">
                                <div>
                                    <span>width:</span>
                                    <input type="range" value="20" min="20" max="100" step="1">
                                </div>
                                <div>
                                    <span>height:</span>
                                    <input type="range" value="20" min="20" max="100" step="1">
                                </div>
                            </div>

                            <!-------------------- Settings size border -------------------->
                            <div class="gameSettingName">
                                <span>Border</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingSizeBorder">
                                <div>
                                    <span>Size:</span>
                                    <input type="range" value="1" min="1" max="3" step="0.01">
                                </div>
                            </div>

                            <!-------------------- Settings size paddle -------------------->
                            <div class="gameSettingName">
                                <span>Paddle</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingSizePaddle">
                                <div>
                                    <span>width:</span>
                                    <input type="range" value="5" min="5" max="" step="1">
                                </div>
                                <div>
                                    <span>height:</span>
                                    <input type="range" value="1" min="1" max="" step="1">
                                </div>
                            </div>

                            <!-------------------- Settings size ball -------------------->
                            <div class="gameSettingName">
                                <span>Ball</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingSizeBall">
                                <div>
                                    <span>Size:</span>
                                    <input type="range" value="1" min="1" max="" step="1">
                                </div>
                            </div>

                        </div>

                        <!-------------------- Settings color panel -------------------->
                        <div id="settingColorPanel">

                            <!-------------------- Settings color table -------------------->
                            <div class="gameSettingName">
                                <span>Table</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingColorTable">
                                <div>
                                    <span>Plane:</span>
                                    <input type="color" name="" value="#241f31">
                                </div>
                                <div>
                                    <span>Border:</span>
                                    <input type="color" name="" value="#ffffff">
                                </div>
                            </div>

                            <!-------------------- Settings color paddles -------------------->
                            <div class="gameSettingName">
                                <span>Paddles</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingColorPaddles">
                                <div>
                                    <span>Player1:</span>
                                    <input type="color" name="" value="#3584e4">
                                </div>
                                <div>
                                    <span>Player2:</span>
                                    <input type="color" name="" value="#9141ac">
                                </div>
                                <div>
                                    <span>Player3:</span>
                                    <input type="color" name="" value="#f6d32d">
                                </div>
                                <div>
                                    <span>Player4:</span>
                                    <input type="color" name="" value="#33d17a">
                                </div>
                            </div>

                            <!-------------------- Settings color ball -------------------->
                            <div class="gameSettingName">
                                <span>Ball</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingColorBall">
                                <div>
                                    <span>Color:</span>
                                    <input type="color" name="" value="#ff0000">
                                </div>
                            </div>
                        </div>

                        <!-------------------- Settings speed panel -------------------->
                        <div>

                            <!-------------------- Settings speed paddle -------------------->
                            <div class="gameSettingName">
                                <span>Paddle</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingSpeedPaddle">
                                <div>
                                    <span>Speed:</span>
                                    <input type="range" value="0.004" min="0.0001" max="0.01" step="0.0001">
                                </div>
                            </div>

                            <!-------------------- Settings speed ball -------------------->
                            <div class="gameSettingName">
                                <span>Ball</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingSpeedBall">
                                <div>
                                    <span>Speed:</span>
                                    <input type="range" value="0.004" min="0.0001" max="0.01" step="0.0001">
                                </div>
                            </div>
                        </div>

                        <!-------------------- Settings control panel -------------------->
                        <div>

                            <!-------------------- Settings control player 1 -------------------->
                            <div class="gameSettingName">
                                <span>Player 1</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingControlPlayer1">
                                <div>
                                    <span>Left:</span>
                                    <input type="text" maxlength="1" value="a">
                                </div>
                                <div>
                                    <span>Right:</span>
                                    <input type="text" maxlength="1" value="q">
                                </div>
                            </div>

                            <!-------------------- Settings control player 2 -------------------->
                            <div class="gameSettingName">
                                <span>Player 2</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingControlPlayer2">
                                <div>
                                    <span>Left:</span>
                                    <input type="text" maxlength="1" value="p">
                                </div>
                                <div>
                                    <span>Right:</span>
                                    <input type="text" maxlength="1" value="m">
                                </div>
                            </div>

                            <!-------------------- Settings control player 3 -------------------->
                            <div class="gameSettingName">
                                <span>Player 3</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingControlPlayer3">
                                <div>
                                    <span>Left:</span>
                                    <input type="text" maxlength="1" value="z">
                                </div>
                                <div>
                                    <span>Right:</span>
                                    <input type="text" maxlength="1" value="e">
                                </div>
                            </div>

                            <!-------------------- Settings control player 4 -------------------->
                            <div class="gameSettingName">
                                <span>Player 4</span>
                            </div>
    
                            <div class="gameSettingInput" id="gameSettingControlPlayer4">
                                <div>
                                    <span>Left:</span>
                                    <input type="text" maxlength="1" value="i">
                                </div>
                                <div>
                                    <span>Right:</span>
                                    <input type="text" maxlength="1" value="o">
                                </div>
                            </div>

                        </div>

                    </div>

                    <!--------------------  -------------------->
                    <div id="gameSaveButton">
                        <button>
                            <span>Save</span>
                        </button>
                    </div>

                </div>
            </div>

        </div>

        <!-------------------- Game windows -------------------->
        <canvas id="gameWindows"></canvas>

    </div>

    <!-------------------- Game over layer -------------------->
    <div id="gameOverLayer">

        <!--------------------  -------------------->
        <div id="titleGameOver">
            <span>Game Over</span>
        </div>

        <!--------------------  -------------------->
        <div></div>

        <!--------------------  -------------------->
        <div id="buttonsGameOver"></div>
    </div>

    <!--------------------  -------------------->
		<div class="r_successinfo hide"></div>
	</div>
`;
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
			//document.getElementById("g_game").classList.remove("hide");

			user.id = getCookie('id');
			user.name = getCookie('username');
			user.level = getCookie("level");
			user.avatar = '../../img/avatar/avatar1.jpg';
			user.status = 'connection';
			client.inforUser = user;

			// create_match('rank');
			create_match('with friends');
			// create_match('offline');
		}
	});
}
