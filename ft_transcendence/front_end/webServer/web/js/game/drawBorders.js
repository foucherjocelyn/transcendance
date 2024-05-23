import { THREE } from './gameWindows.js';
import { createBox, delete_old_object } from "./createObjects.js";
import { gameSettings } from '../gameSettings/updateGameSetting.js';
import { pongGame } from '../client/client.js';
import { displayPongGame } from './startGame.js';

function    delete_old_border()
{
    for (let i = 0; i < pongGame.listBorder.length; i++)
    {
        if (displayPongGame.borders[i] !== undefined)
            delete_old_object(displayPongGame.borders[i]);
    }
}

export function    draw_border()
{
    delete_old_border();

    pongGame.listBorder.forEach((border, index) => {
        displayPongGame.borders[index] = createBox(border.size.width, border.size.height, border.size.length);
        displayPongGame.borders[index].material.color = new THREE.Color(gameSettings.color.border);
        displayPongGame.borders[index].position.set(border.position.x, border.position.y, border.position.z);
        pongGame.scene.add(displayPongGame.borders[index]);
    })
}
