const { horizontal_movement, vertical_movement } = require("./movementsPaddle");
const { update_status_objects } = require("./collisionsPoint");

function    vertical_movement_AI(paddle, pongGame)
{
    const   directionBall = (pongGame.ball.vector.y < 0) ? 'top' : 'bottom';

    if (pongGame.ball.position.z < paddle.position.z && directionBall === 'top') {
        vertical_movement(paddle, -1, pongGame);
    }
    else if (pongGame.ball.position.z > paddle.position.z && directionBall === 'bottom') {
        vertical_movement(paddle, 1, pongGame);
    }

    update_status_objects(pongGame);
}

function    horizontal_movement_AI(paddle, pongGame)
{
    const   directionBall = (pongGame.ball.vector.x < 0) ? 'left' : 'right';

    if (pongGame.ball.position.x < paddle.position.x && directionBall === 'left') {
        horizontal_movement(paddle, -1, pongGame);
    }
    else if (pongGame.ball.position.x > paddle.position.x && directionBall === 'right') {
        horizontal_movement(paddle, 1, pongGame);
    }

    update_status_objects(pongGame);
}

function    movement_AI(pongGame)
{
    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        const   player = pongGame.listPlayer[i];

        if (paddle !== undefined && player.type === 'AI')
        {
            if (paddle.name === 'left paddle' || paddle.name === 'right paddle') {
                vertical_movement_AI(paddle, pongGame);
            }
            else {
                horizontal_movement_AI(paddle, pongGame);
            }
        }
    }
}

module.exports = {
    movement_AI
};
