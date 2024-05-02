import { THREE } from './gameWindows.js';
import { box, createBox, delete_old_object } from "./createObjects.js";
import { pongGame } from "./startGame.js";
import { gameSettings } from '../gameSettings/getInputsGameSettings.js';

function    update_collision_points(obj)
{
    if (obj === undefined)
        return ;

    obj.collisionPoint.top = obj.position.z - (obj.size.length / 2);
    obj.collisionPoint.bottom = obj.position.z + (obj.size.length / 2);
    obj.collisionPoint.left = obj.position.x - (obj.size.width / 2);
    obj.collisionPoint.right = obj.position.x + (obj.size.width / 2);
}

function    update_status_objects()
{
    update_collision_points(pongGame.ball);

    pongGame.listPaddle.forEach(paddle => {
        if (paddle !== undefined) {
            update_collision_points(paddle);
        }
    })

    pongGame.listBorder.forEach(border => {
        if (border !== undefined) {
            update_collision_points(border);
        }
    })
}

function    create_ball()
{
    if (pongGame.ball !== undefined)
        delete_old_object(pongGame.ball.display);

    const   distanceToTable = 0.01;
    const   ball  = new box();

    // name
    ball.name = 'ball';

    // size
    ball.size.width = gameSettings.size.ball;
    ball.size.height = gameSettings.size.ball;
    ball.size.length = gameSettings.size.ball;

    // position
    ball.position.x = 0;
    ball.position.y = (ball.size.height / 2) + distanceToTable;
    ball.position.z = 0;

    // display
    ball.display = createBox(ball.size.width, ball.size.height, ball.size.length);
    ball.display.material.color = new THREE.Color(gameSettings.color.ball);
    ball.display.position.set(ball.position.x, ball.position.y, ball.position.z);
    pongGame.scene.add(ball.display);

    pongGame.ball = ball;
}

export {
    create_ball,
    update_status_objects
};
