import { gameSettingHTML } from "./home_gameSettings.js";

export function    gameOverHTML()
{
    document.querySelector("#frontpage").outerHTML =
    `
    <div id="frontpage">

        <!-------------------- Game over layer -------------------->
        <div id="gameOverLayer">

            <!--------------------  -------------------->
            <div id="titleGameOver">
                <span>Game Over</span>
            </div>

            <!--------------------  -------------------->
            <div id="resultsMatchPanel"></div>

            <!--------------------  -------------------->
            <div id="buttonsGameOver">
                <div>
                    <button>
                        <span>Exit</span>
                    </button>
                    <button>
                        <span>Play again</span>
                    </button>
                </div>
            </div>
        </div>

    </div>
    `;
}

export function    gameLayerHTML()
{
    document.querySelector("#frontpage").outerHTML =
    `
    <div id="frontpage">

        <!-------------------- Game layer -------------------->
        <div id="gameLayer">

            <!-------------------- Countdown -------------------->
            <div id="countdownLayer">
                <span></span>
            </div>

            <!-------------------- Game intructions -------------------->
            <div id="gameInstructionsLayer">
                <div id="gameInstructionsPanel"></div>
            </div>

            ${gameSettingHTML()}

            <!-------------------- Game windows -------------------->
            <canvas id="gameWindows"></canvas>

        </div>

    </div>
    `;
}
