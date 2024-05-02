import { screen } from "../screen/screen.js";

function    setup_size_game_over_layer()
{
    const   gameOverLayer = document.getElementById('gameOverLayer');
    gameOverLayer.style.height = `${screen.height}px`;
    gameOverLayer.style.width = `${screen.width}px`;
}

function    setup_game_over()
{
    document.getElementById('gameLayer').style.display = 'none';
    document.getElementById('gameOverLayer').style.display = 'flex';

    setup_size_game_over_layer();
}

export {
    setup_game_over
};
