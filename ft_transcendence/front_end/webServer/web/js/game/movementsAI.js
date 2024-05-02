import { match } from "../createMatch/createMatch.js";
import { update_status_objects } from "./createBall.js";
import { horizontal_movement, vertical_movement } from "./movementsPaddle.js";
import { pongGame } from "./startGame.js";

function    vertical_movement_AI(paddle)
{
    const   directionBall = (pongGame.ball.vector.y < 0) ? 'top' : 'bottom';

    if (pongGame.ball.position.z < paddle.position.z && directionBall === 'top')
    {
        vertical_movement(paddle, -1);
    }
    else if (pongGame.ball.position.z > paddle.position.z && directionBall === 'bottom')
    {
        vertical_movement(paddle, 1);
    }

    update_status_objects();
}

function    horizontal_movement_AI(paddle)
{
    const   directionBall = (pongGame.ball.vector.x < 0) ? 'left' : 'right';

    if (pongGame.ball.position.x < paddle.position.x && directionBall === 'left')
    {
        horizontal_movement(paddle, -1);
    }
    else if (pongGame.ball.position.x > paddle.position.x && directionBall === 'right')
    {
        horizontal_movement(paddle, 1);
    }

    update_status_objects();
}

function    movement_AI()
{
    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        const   player = match.listPlayer[i];

        if (paddle !== undefined && player.type === 'AI')
        {
            if (paddle.name === 'left paddle' || paddle.name === 'right paddle')
            {
                vertical_movement_AI(paddle);
            }
            else
            {
                horizontal_movement_AI(paddle);
            }
        }
    }
}

export {
    movement_AI
};
