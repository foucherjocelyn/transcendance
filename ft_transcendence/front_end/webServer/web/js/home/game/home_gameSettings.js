
function gameSettingsSizePanelHTML()
{
    return (`
        <!-------------------- Settings size panel -------------------->
        <div id="settingSizePanel">

            <!-------------------- Settings size table -------------------->
            <div class="gameSettingName">
                <span>Table</span>
            </div>

            <div class="gameSettingInput" id="gameSettingSizeTable">
                <div>
                    <span>width:</span>
                    <input type="range" value="30" min="30" max="100" step="1">
                </div>
                <div>
                    <span>height:</span>
                    <input type="range" value="30" min="30" max="100" step="1">
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
    `);
}

function gameSettingsColorPanelHTML()
{
    return (`
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
    `);
}

function gameSettingsSpeedPanelHTML()
{
    return (`
        <!-------------------- Settings speed panel -------------------->
        <div>

            <!-------------------- Settings speed paddle -------------------->
            <div class="gameSettingName">
                <span>Paddle</span>
            </div>

            <div class="gameSettingInput" id="gameSettingSpeedPaddle">
                <div>
                    <span>Speed:</span>
                    <input type="range" value="0.488" min="0.488" max="1.608" step="0.01">
                </div>
            </div>

            <!-------------------- Settings speed ball -------------------->
            <div class="gameSettingName">
                <span>Ball</span>
            </div>

            <div class="gameSettingInput" id="gameSettingSpeedBall">
                <div>
                    <span>Speed:</span>
                    <input type="range" value="0.001" min="0.001" max="0.008" step="0.001">
                </div>
            </div>
        </div>
    `);
}

function gameSettingsControlPanelHTML()
{
    return (`
        <!-------------------- Settings control panel -------------------->
        <div>

            <!-------------------- Settings control player 1 -------------------->
            <div class="gameSettingName">
                <span>Player 1</span>
            </div>

            <div class="gameSettingInput" id="gameSettingControlPlayer1">
                <div>
                    <span>Left:</span>
                    <input type="text" maxlength="1" value="q">
                </div>
                <div>
                    <span>Right:</span>
                    <input type="text" maxlength="1" value="a">
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
    `);
}

export function gameSettingHTML() {
    return (`
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
                    
                    ${gameSettingsSizePanelHTML()}
                    ${gameSettingsColorPanelHTML()}
                    ${gameSettingsSpeedPanelHTML()}
                    ${gameSettingsControlPanelHTML()}

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
    `);
}
