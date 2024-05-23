import { THREE } from './gameWindows.js';
import { createBox, delete_old_object } from "./createObjects.js";
import { pongGame } from '../client/client.js';
import { displayPongGame } from './startGame.js';

function    delete_old_paddles()
{
    pongGame.listPaddle.forEach((paddle, index) => {
        if (displayPongGame.paddles[index] !== undefined)
        {
            // delete_old_score(paddle);
            delete_old_object(displayPongGame.paddles[index]);
        }
    })
}

export function    draw_paddle()
{
    delete_old_paddles();

    pongGame.listPaddle.forEach((paddle, index) => {
        if (paddle !== null)
        {
            displayPongGame.paddles[index] = createBox(paddle.size.width, paddle.size.height, paddle.size.length);
            displayPongGame.paddles[index].material.color = new THREE.Color(paddle.color);
            displayPongGame.paddles[index].position.set(paddle.position.x, paddle.position.y, paddle.position.z);
            pongGame.scene.add(displayPongGame.paddles[index]);
        }
    })
}
