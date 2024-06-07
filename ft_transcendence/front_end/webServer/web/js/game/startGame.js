import { screen } from "../screen/screen.js";
import { setup_game_instructions } from "../gameInstructions/gameInstructions.js";
import { setup_game_settings } from "../gameSettings/gameSetting.js";
import { setup_game_windows } from "./gameWindows.js";
import { gameLayerHTML } from "../home/game/home_gamewindows.js";
import { client } from "../client/client.js";

class   formDisplay {
    constructor() {
        this.ball = undefined,
        this.borders = [],
        this.paddles = [],
        this.scores = [],
        this.table = []
    }
};

function    setup_size_game_layer()
{
    const   gameLayer = document.getElementById('gameLayer');
    gameLayer.style.height = `${screen.height}px`;
    gameLayer.style.width = `${screen.width}px`;
}

export let  displayPongGame;
export function    setup_game_layer()
{
    displayPongGame = new formDisplay();

    gameLayerHTML();
    setTimeout(function() {
        setup_size_game_layer();
        setup_game_settings();
        setup_game_windows();
        setup_game_instructions();
    }, 100);
}
