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
            <div></div>

            <!--------------------  -------------------->
            <div id="buttonsGameOver"></div>
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
                <span>3</span>
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