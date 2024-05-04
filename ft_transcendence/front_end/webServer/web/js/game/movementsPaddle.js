import { client, dataToServer } from "../client/client.js";
import { match } from "../createMatch/createMatch.js";
import { update_status_objects } from "./createBall.js";
import { define_paddle } from "./createPaddle.js";
import { check_collisions } from "./movementsBall.js";
import { pongGame } from "./startGame.js";

function    update_position_paddle(data)
{
    const   paddle = define_paddle(data.id);
    if (paddle !== undefined)
        Object.assign(paddle.position, data.position);

    update_status_objects();
}

function vertical_movement(paddle, direction)
{
    let speed = paddle.vector.y;
    if ((speed > 0 && direction < 0) || (speed < 0 && direction > 0)) {
        paddle.vector.y = -paddle.vector.y;
        speed = -speed;
    }

    let collision = false;
    check_collisions(paddle, (result) => {
        if (result) {
            collision = true;
            let distance = paddle.collision.distance;
            speed = (speed < 0) ? -distance : distance;
        }
    })

    const   typePlayer = match.listPlayer[paddle.id].type;

    if (!collision)
        paddle.position.z += speed;
    update_status_objects();

    if (typePlayer !== 'AI' && !collision)
    {
        const sendData = new dataToServer('update movement paddle', paddle, client.inforUser, match.listPlayer);
        client.socket.send(JSON.stringify(sendData));
    }
}

function horizontal_movement(paddle, direction)
{
    let speed = paddle.vector.x;
    if ((speed > 0 && direction < 0) || (speed < 0 && direction > 0)) {
        paddle.vector.x = -paddle.vector.x;
        speed = -speed;
    }

    let collision = false;
    check_collisions(paddle, (result) => {
        if (result) {
            collision = true;
            let distance = paddle.collision.distance;
            speed = (speed < 0) ? -distance : distance;
        }
    })

    const   typePlayer = match.listPlayer[paddle.id].type;

    if (!collision)
        paddle.position.x += speed;
    update_status_objects();

    if (typePlayer !== 'AI' && !collision)
    {
        const sendData = new dataToServer('update movement paddle', paddle, client.inforUser, match.listPlayer);
        client.socket.send(JSON.stringify(sendData));
    }
}


function    get_sign_movement_paddle(player, keyCode)
{
    if (keyCode === player.control.left)
    {
        if (player.name === 'left paddle' || player.name === 'right paddle')
            vertical_movement(player, -1);
        else
            horizontal_movement(player, -1);
    }
    else if (keyCode === player.control.right)
    {
        if (player.name === 'left paddle' || player.name === 'right paddle')
            vertical_movement(player, 1);
        else
            horizontal_movement(player, 1);
    }
}

function    get_sign_movement_paddle_mode_online(player, keyCode)
{
    if ((keyCode === 'ArrowLeft' && player.name === 'left paddle')
        || (keyCode === 'ArrowRight' && player.name === 'right paddle'))
        vertical_movement(player, -1);
    else if ((keyCode === 'ArrowLeft' && player.name === 'right paddle')
        || (keyCode === 'ArrowRight' && player.name === 'left paddle'))
        vertical_movement(player, 1);
    else if ((keyCode === 'ArrowLeft' && player.name === 'top paddle')
        || (keyCode === 'ArrowRight' && player.name === 'bottom paddle'))
        horizontal_movement(player, 1);
    else
        horizontal_movement(player, -1);
}

function    movements_paddle_mode_online(keyCode)
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.id === client.inforUser.id)
        {
            const   paddle = pongGame.listPaddle[i];
            if (paddle !== undefined) {
                get_sign_movement_paddle_mode_online(paddle, keyCode);
            }
            return ;
        }
    }
}

function    movements_paddle()
{
    document.addEventListener("keydown", function(event) {
        // console.log(event.keyCode);
        // console.log(event.key);

        if (match.mode !== 'offline')
            movements_paddle_mode_online(event.key);
        else
        {
            for (let i = 0; i < pongGame.listPaddle.length; i++)
            {
                const   paddle = pongGame.listPaddle[i];
                if (paddle !== undefined)
                    get_sign_movement_paddle(paddle, event.key);
            }
        }
    });
}

export {
    movements_paddle,
    vertical_movement,
    horizontal_movement,
    update_position_paddle
};
