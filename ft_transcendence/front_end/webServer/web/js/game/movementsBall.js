import { client, dataToServer } from "../client/client.js";
import { match } from "../createMatch/createMatch.js";
import { define_player } from "../createMatch/createPlayers.js";
import { gameSettings } from "../gameSettings/getInputsGameSettings.js";
import { check_collision } from "./collision.js";
import { update_status_objects } from "./createBall.js";
import { define_paddle } from "./createPaddle.js";
import { create_score } from "./createScore.js";
import { pongGame } from "./startGame.js";

function    check_collisions(obj, callback)
{
    // collision with Ball
    if (obj !== pongGame.ball && check_collision(obj, pongGame.ball))
    {
        callback(true);
        return;
    }

    // collision with Paddles
    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        if (paddle !== undefined && paddle.name !== obj.name)
        {
            if (check_collision(obj, paddle))
            {
                callback(true);
                return ;
            }
        }
    }

    // collision with Borders
    for (let i = 0; i < pongGame.listBorder.length; i++)
    {
        const   border = pongGame.listBorder[i];
        if (border !== undefined)
        {
            if (check_collision(obj, border))
            {
                callback(true);
                return ;
            }
        }
    }
    callback(false);
}

function    update_position_ball(data)
{
    Object.assign(pongGame.ball.position, data.position);
    update_status_objects();
}

function    last_touch(lostPaddle)
{
    pongGame.listTouch = pongGame.listTouch.reverse();
    for (let i = 0; i < pongGame.listTouch.length; i++)
    {
        const   paddle = pongGame.listTouch[i];
        if (paddle.name !== lostPaddle.name)
        {
            const   player = define_player(paddle.id);
            player.score++;
            // console.log(paddle.name + ': ' +  player.score);
            create_score();
            return ;
        }
    }
}

function    check_lost_point()
{
    const   touch = pongGame.ball.collision.who;
    
    let   paddle = define_paddle(touch.id);
    if (paddle !== undefined)
    {
        pongGame.listTouch.push(paddle);
        return ;
    }

    for (let i = 0; i < pongGame.listBorder.length; i++)
    {
        const   border = pongGame.listBorder[i];
        paddle = pongGame.listPaddle[i];
        if (pongGame.listTouch.length > 0 && border.name === touch.name && paddle !== undefined)
        {
            last_touch(paddle);
            pongGame.lostPoint = true;
            pongGame.listBorder.forEach(border => {
                border.display.material.color.set(0xff0000);
            })
            return ;
        }
    }
}

function    change_color_after_collision(touch)
{
    for (let i = 0; i < pongGame.listBorder.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        const   border = pongGame.listBorder[i];
        if ((paddle !== undefined && paddle.name === touch.name)
        || (border.name === touch.name))
        {
            border.display.material.color.set(0x18e1e7);
            setTimeout(function() {
                border.display.material.color.set(gameSettings.color.border);
            }, 100);
            return ;
        }
    }
}

function    movements_ball()
{
    const   ball = pongGame.ball;

    let speedX = ball.vector.x;
    let speedY = ball.vector.y;

    check_collisions(ball, (result) => {
        if (result)
        {
            check_lost_point();

            pongGame.speedBall += 0.001;
            if ((pongGame.speedBall + speedX >= gameSettings.speed.paddle)
            || (pongGame.speedBall + speedY >= gameSettings.speed.paddle))
                pongGame.speedBall = 0;
        
            const   distance = ball.collision.distance;
            const   touchPoint = ball.collision.touch;
            
            if (touchPoint === 'left' || touchPoint === 'right')
            {
                speedX = (speedX < 0) ? -distance : distance;
                let speed = (ball.vector.x < 0) ? -pongGame.speedBall : pongGame.speedBall;
                ball.vector.x += speed;
                ball.vector.x = -ball.vector.x;
            }
            else
            {
                speedY = (speedY < 0) ? -distance : distance;
                let speed = (ball.vector.y < 0) ? -pongGame.speedBall : pongGame.speedBall;
                ball.vector.y += speed;
                ball.vector.y = -ball.vector.y;
            }

            change_color_after_collision(ball.collision.who);

            const  sendData = new dataToServer('update movement ball', ball.position, client.inforUser, match.listPlayer);
            client.socket.send(JSON.stringify(sendData));
        }
    })

    ball.position.x += speedX;
    ball.position.z += speedY;
}

export {
    movements_ball,
    update_position_ball,
    check_collisions
};
