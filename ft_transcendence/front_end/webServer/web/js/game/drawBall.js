import { THREE } from './gameWindows.js';
import { createBox, delete_old_object } from "./createObjects.js";
import { gameSettings } from '../gameSettings/updateGameSetting.js';
import { pongGame } from '../client/client.js';
import { displayPongGame } from './startGame.js';

function    update_collision_points(obj)
{
    if (obj === undefined)
        return ;

    obj.collisionPoint.top = obj.position.z - (obj.size.length / 2);
    obj.collisionPoint.bottom = obj.position.z + (obj.size.length / 2);
    obj.collisionPoint.left = obj.position.x - (obj.size.width / 2);
    obj.collisionPoint.right = obj.position.x + (obj.size.width / 2);
}

export function    draw_ball()
{
    if (displayPongGame.ball !== undefined)
        delete_old_object(displayPongGame.ball);

    const   ball = pongGame.ball;

    // display
    displayPongGame.ball = createBox(ball.size.width, ball.size.height, ball.size.length);
    displayPongGame.ball.material.color = new THREE.Color(gameSettings.color.ball);
    displayPongGame.ball.position.set(ball.position.x, ball.position.y, ball.position.z);
    pongGame.scene.add(displayPongGame.ball);
}
