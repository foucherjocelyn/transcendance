const { webSocket } = require("../webSocket/webSocket");
const { send_data } = require("../webSocket/dataToClient");
const { check_collisions } = require("./movementsBall");
const { update_status_objects } = require("./collisionsPoint");
const { define_match } = require("../match/updateMatch");

function vertical_movement(paddle, direction, pongGame)
{
    if ((paddle.collisionPoint.top === pongGame.limit.top && direction < 0)
    || (paddle.collisionPoint.bottom === pongGame.limit.bottom && direction > 0))
        return ;

    let speed = paddle.vector.y;
    if ((speed > 0 && direction < 0) || (speed < 0 && direction > 0)) {
        paddle.vector.y = -paddle.vector.y;
        speed = -speed;
    }

    check_collisions(paddle, pongGame, (result) => {
        if (result && (paddle.collision.touch === 'top' || paddle.collision.touch === 'bottom')) {
            let distance = paddle.collision.distance;
            speed = (speed < 0) ? -distance : distance;
        }
    })
    paddle.position.z += speed;
    send_data('update paddles', pongGame.listPaddle, 'server', pongGame.listUser);
    update_status_objects(pongGame);
}

function horizontal_movement(paddle, direction, pongGame)
{
    if ((paddle.collisionPoint.left === pongGame.limit.left && direction < 0)
    || (paddle.collisionPoint.right === pongGame.limit.right && direction > 0))
        return ;

    let speed = paddle.vector.x;
    if ((speed > 0 && direction < 0) || (speed < 0 && direction > 0)) {
        paddle.vector.x = -paddle.vector.x;
        speed = -speed;
    }

    check_collisions(paddle, pongGame, (result) => {
        if (result && (paddle.collision.touch === 'left' || paddle.collision.touch === 'right')) {
            let distance = paddle.collision.distance;
            speed = (speed < 0) ? -distance : distance;
        }
    })
    paddle.position.x += speed;
    send_data('update paddles', pongGame.listPaddle, 'server', pongGame.listUser);
    update_status_objects(pongGame);
}


function    movement_paddle_mode_offline(keyCode, paddle, pongGame)
{
    if (paddle === undefined)
        return ;
    
    if (keyCode === paddle.control.left)
    {
        if (paddle.name === 'left paddle' || paddle.name === 'right paddle')
            vertical_movement(paddle, -1, pongGame);
        else
            horizontal_movement(paddle, -1, pongGame);
    }
    else if (keyCode === paddle.control.right)
    {
        if (paddle.name === 'left paddle' || paddle.name === 'right paddle')
            vertical_movement(paddle, 1, pongGame);
        else
            horizontal_movement(paddle, 1, pongGame);
    }
}

function    movement_paddle_mode_online(keyCode, paddle, pongGame)
{
    if ((paddle === undefined) || (keyCode !== 'ArrowLeft' && keyCode !== 'ArrowRight'))
        return ;

    if ((keyCode === 'ArrowLeft' && paddle.name === 'left paddle')
        || (keyCode === 'ArrowRight' && paddle.name === 'right paddle'))
        vertical_movement(paddle, -1, pongGame);
    else if ((keyCode === 'ArrowLeft' && paddle.name === 'right paddle')
        || (keyCode === 'ArrowRight' && paddle.name === 'left paddle'))
        vertical_movement(paddle, 1, pongGame);
    else if ((keyCode === 'ArrowLeft' && paddle.name === 'top paddle')
        || (keyCode === 'ArrowRight' && paddle.name === 'bottom paddle'))
        horizontal_movement(paddle, 1, pongGame);
    else
        horizontal_movement(paddle, -1, pongGame);
}

function    get_sign_movement_paddle(socket, keyCode)
{
    if (keyCode === '')
        return ;

    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.socket === socket)
        {
            const   user = connection.user;
            let indexMatch = define_match(user);
            if (indexMatch === undefined)
                return ;

            const   match = webSocket.listMatch[indexMatch];
            const   index = match.listPlayer.findIndex(player => player.id === user.id);
            const   paddle = match.pongGame.listPaddle[index];

            (match.mode === 'offline') ?
            movement_paddle_mode_offline(keyCode, paddle, match.pongGame) :
            movement_paddle_mode_online(keyCode, paddle, match.pongGame);
        }
    }
}

module.exports = {
    vertical_movement,
    horizontal_movement,
    get_sign_movement_paddle
};
