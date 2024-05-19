import { screen } from "../screen/screen.js";
import { setup_game_instructions } from "../gameInstructions/gameInstructions.js";
import { setup_game_settings } from "../gameSettings/gameSetting.js";
import { setup_game_windows } from "./gameWindows.js";
import { match } from "../createMatch/createMatch.js";
import { gameLayerHTML } from "../home/home_gamewindows.js";
import { client } from "../client/client.js";

class   formPongGame {
    constructor() {
        this.lostPoint = true,
        this.gameOver = false,
        this.plane = undefined,
        this.limit = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined
        },
        this.border = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined
        },
        this.listBorder = undefined,
        this.paddle = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined
        },
        this.listPaddle = undefined,
        this.score = {
            player1: undefined,
            player2: undefined,
            player3: undefined,
            player4: undefined
        },
        this.ball = undefined
    }
};
let pongGame;

function    setup_size_game_layer()
{
    const   gameLayer = document.getElementById('gameLayer');
    gameLayer.style.height = `${screen.height}px`;
    gameLayer.style.width = `${screen.width}px`;
}

function    setup_game_layer()
{
    // console.table(match.timeStart);
    client.inforUser.status = 'playing game';

    gameLayerHTML();
    pongGame = new formPongGame();
    pongGame.maxPoint = 500;
    pongGame.listPlayer = match.listPlayer;

    setup_size_game_layer();
    setup_game_settings();
    setup_game_windows();
    setup_game_instructions();
}

export {
    setup_game_layer,
    pongGame
};
