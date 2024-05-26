const { check_collision } = require("./collision");
const { define_paddle_ws } = require("./createPaddleWS");
const { create_score_ws } = require("./createScoreWS");

function    last_touch(lostPaddle, pongGame, gameSettings)
{
    pongGame.listTouch = pongGame.listTouch.reverse();
    for (let i = 0; i < pongGame.listTouch.length; i++)
    {
        const   paddle = pongGame.listTouch[i];
        if (paddle.name !== lostPaddle.name)
        {
            const   player = pongGame.listPlayer[paddle.id];
            player.score++;
            create_score_ws(paddle, pongGame, gameSettings);
            return ;
        }
    }
}

function    handled_anyone_touching_ball(lostPaddle, pongGame)
{
    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        if (paddle !== undefined && paddle.name !== lostPaddle.name)
        {
            pongGame.listTouch.push(paddle);
            return ;
        }
    }
}

function    check_lost_point(pongGame, gameSettings)
{
    const   touch = pongGame.ball.collision.who;
    
    let   paddle = define_paddle_ws(touch.id, pongGame);
    if (paddle !== undefined)
    {
        pongGame.listTouch.push(paddle);
        return ;
    }

    for (let i = 0; i < pongGame.listBorder.length; i++)
    {
        const   border = pongGame.listBorder[i];
        paddle = pongGame.listPaddle[i];
        if (border.name === touch.name && paddle !== undefined)
        {
            if (pongGame.listTouch.length === 0)
                handled_anyone_touching_ball(paddle, pongGame);
            last_touch(paddle, pongGame, gameSettings);
            pongGame.lostPoint = true;
            // pongGame.listBorder.forEach(border => {
            //     border.display.material.color.set(0xff0000);
            // })
            return ;
        }
    }
}

// function    change_color_after_collision(touch, pongGame)
// {
//     for (let i = 0; i < pongGame.listBorder.length; i++)
//     {
//         const   paddle = pongGame.listPaddle[i];
//         const   border = pongGame.listBorder[i];
//         if ((paddle !== undefined && paddle.name === touch.name)
//         || (border.name === touch.name))
//         {
//             border.display.material.color.set(0x18e1e7);
//             setTimeout(function() {
//                 border.display.material.color.set(gameSettings.color.border);
//             }, 100);
//             return ;
//         }
//     }
// }

function    check_collisions(obj, pongGame, callback)
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

function    increase_ball_speed(ball, pongGame)
{
    let speedX = (ball.vector.x > 0) ? ball.vector.x : -ball.vector.x;
    let speedY = (ball.vector.y > 0) ? ball.vector.y : -ball.vector.y;
    let speed = (speedX > speedY) ? speedX : speedY;

    // console.log('max: ' + pongGame.maxSpeed);
    // console.log(speed + pongGame.ballSpeed);

    pongGame.ballSpeed += 0.01;
    if (speed + pongGame.ballSpeed > pongGame.maxSpeed)
        pongGame.ballSpeed = pongGame.maxSpeed - speed;
}

function    movements_ball_ws(pongGame, gameSettings)
{
    const   ball = pongGame.ball;

    let speedX = ball.vector.x;
    let speedY = ball.vector.y;

    check_collisions(ball, pongGame, (result) => {
        if (result)
        {
            check_lost_point(pongGame, gameSettings);
            increase_ball_speed(ball, pongGame);
            
            const   distance = ball.collision.distance;
            const   touchPoint = ball.collision.touch;
            
            if (touchPoint === 'left' || touchPoint === 'right')
            {
                speedX = (speedX < 0) ? -distance : distance;
                let speed = (ball.vector.x < 0) ? -pongGame.ballSpeed : pongGame.ballSpeed;
                ball.vector.x += speed;
                ball.vector.x = -ball.vector.x;
            }
            else
            {
                speedY = (speedY < 0) ? -distance : distance;
                let speed = (ball.vector.y < 0) ? -pongGame.ballSpeed : pongGame.ballSpeed;
                ball.vector.y += speed;
                ball.vector.y = -ball.vector.y;
            }

            // change_color_after_collision(ball.collision.who, pongGame);
        }
    })

    ball.position.x += speedX;
    ball.position.z += speedY;
}

module.exports = {
    movements_ball_ws,
    check_collisions,
};
