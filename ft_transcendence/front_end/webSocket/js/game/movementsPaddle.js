const { send_data } = require("../webSocket/dataToClient");
const { check_collisions } = require("./movementsBall");
const { update_status_objects_ws } = require("./updateCollisionsPoint");

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
    update_status_objects_ws(pongGame);
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
    update_status_objects_ws(pongGame);
}

// function    get_sign_movement_paddle(player, keyCode)
// {
//     if (keyCode === player.control.left)
//     {
//         if (player.name === 'left paddle' || player.name === 'right paddle')
//             vertical_movement(player, -1);
//         else
//             horizontal_movement(player, -1);
//     }
//     else if (keyCode === player.control.right)
//     {
//         if (player.name === 'left paddle' || player.name === 'right paddle')
//             vertical_movement(player, 1);
//         else
//             horizontal_movement(player, 1);
//     }
// }

// function    get_sign_movement_paddle_mode_online(player, keyCode)
// {
//     if ((keyCode === 'ArrowLeft' && player.name === 'left paddle')
//         || (keyCode === 'ArrowRight' && player.name === 'right paddle'))
//         vertical_movement(player, -1);
//     else if ((keyCode === 'ArrowLeft' && player.name === 'right paddle')
//         || (keyCode === 'ArrowRight' && player.name === 'left paddle'))
//         vertical_movement(player, 1);
//     else if ((keyCode === 'ArrowLeft' && player.name === 'top paddle')
//         || (keyCode === 'ArrowRight' && player.name === 'bottom paddle'))
//         horizontal_movement(player, 1);
//     else
//         horizontal_movement(player, -1);
// }

// function    movements_paddle_mode_online(keyCode)
// {
//     for (let i = 0; i < match.listPlayer.length; i++)
//     {
//         const   player = match.listPlayer[i];
//         if (player.id === client.inforUser.id)
//         {
//             const   paddle = pongGame.listPaddle[i];
//             if (paddle !== undefined) {
//                 get_sign_movement_paddle_mode_online(paddle, keyCode);
//             }
//             return ;
//         }
//     }
// }

// function    movements_paddle()
// {
//     document.addEventListener("keydown", function(event) {
//         // console.log(event.keyCode);
//         // console.log(event.key);

//         if (match.mode !== 'offline')
//             movements_paddle_mode_online(event.key);
//         else
//         {
//             for (let i = 0; i < pongGame.listPaddle.length; i++)
//             {
//                 const   paddle = pongGame.listPaddle[i];
//                 if (paddle !== undefined)
//                     get_sign_movement_paddle(paddle, event.key);
//             }
//         }
//     });
// }

module.exports = {
    vertical_movement,
    horizontal_movement
};
