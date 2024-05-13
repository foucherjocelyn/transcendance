import { noticeInvitePlayer } from "./home_game.js";

export function invitationPlayLayerHTML()
{
    document.querySelector("#frontpage").outerHTML =
    `
    <div id="frontpage">

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

    </div>
    `;
}

function loadMatchMakingHTML() {
    return (
    `
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
    `);
}

export function    createMatchHTML()
{
    document.querySelector("#frontpage").outerHTML =
    `
    <div id="frontpage">

        ${loadMatchMakingHTML()}
        ${noticeInvitePlayer()}

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

    </div>
    `;
}
