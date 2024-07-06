const { request_game_DB } = require("../dataToDB/requestGame");
const { send_data } = require("../webSocket/dataToClient");
const { check_collision } = require("./collision");
const { define_paddle } = require("./createPaddle");
const { create_score } = require("./createScore");

async function    last_touch(lostPaddle, match)
{
    const   pongGame = match.pongGame;

    pongGame.listTouch = pongGame.listTouch.reverse();
    for (let i = 0; i < pongGame.listTouch.length; i++)
    {
        const   paddle = pongGame.listTouch[i];
        if (paddle.name !== lostPaddle.name)
        {
            const   player = pongGame.listPlayer[paddle.id];
            player.score++;
            create_score(paddle, match);

            if (player.type === 'player' && match.mode !== 'offline') {
                let responseDB = await request_game_DB(`/api/v1/game/${match.id}/score`, match, player);
                // if (!responseDB)
                //     return ;
            }
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

function    check_lost_point(match)
{
    const   pongGame = match.pongGame;
    const   touch = pongGame.ball.collision.who;
    
    let   paddle = define_paddle(touch.id, pongGame);
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
            if (pongGame.listTouch.length === 0) {
                handled_anyone_touching_ball(paddle, pongGame);
            }

            last_touch(paddle, match);
            pongGame.lostPoint = true;
            return ;
        }
    }
}

function    change_color_after_collision(touch, pongGame)
{
    for (let i = 0; i < pongGame.listBorder.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        const   border = pongGame.listBorder[i];

        if ((paddle !== undefined && paddle.name === touch.name)
            || (border.name === touch.name))
        {
            send_data('change color border', border, 'server', pongGame.listUser);
            return ;
        }
    }
}

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

    pongGame.ballSpeed += 0.01;
    if (speed + pongGame.ballSpeed > pongGame.maxSpeed) {
        pongGame.ballSpeed = pongGame.maxSpeed - speed;
    }
}

function    movements_ball(match)
{
    const   pongGame = match.pongGame;
    const   ball = pongGame.ball;

    let speedX = ball.vector.x;
    let speedY = ball.vector.y;

    check_collisions(ball, pongGame, (result) => {
        if (result)
        {
            check_lost_point(match);
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

            change_color_after_collision(ball.collision.who, pongGame);
        }
    })

    // change position of ball
    if ((speedX < 0 && ball.collisionPoint.left > match.pongGame.limit.left) ||
    (speedX >= 0 && ball.collisionPoint.right < match.pongGame.limit.right)) {
        ball.position.x += speedX;
    }
    if ((speedY < 0 && ball.collisionPoint.top > match.pongGame.limit.top) ||
    (speedY >= 0 && ball.collisionPoint.bottom < match.pongGame.limit.bottom)) {
        ball.position.z += speedY;
    }
}

module.exports = {
    movements_ball,
    check_collisions,
    check_lost_point
};
