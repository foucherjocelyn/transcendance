const { send_data } = require("../webSocket/dataToClient");
const { update_status_objects } = require("./collisionsPoint");
const { movements_ball, check_lost_point } = require("./movementsBall");
const { movement_AI } = require("./movementsAI");
const { create_paddles } = require("./createPaddle");
const { check_game_over } = require("./gameOver");
const { define_user_by_ID } = require("../webSocket/webSocket");

function calculate_ball_speed(gameSettings)
{
    const   ballSpeed = gameSettings.speed.ball;
    const   tableWidth = gameSettings.size.table.width;
    const   tableHeight = gameSettings.size.table.height;

    // Base speed multipliers
    const minSpeedMultiplier = ballSpeed;
    const maxSpeedMultiplier = 0.008;

    // Calculate the ball speed based on the multipliers and table dimensions
    const minSpeed = minSpeedMultiplier * (tableWidth + tableHeight);
    const maxSpeed = maxSpeedMultiplier * (tableWidth + tableHeight);

    return { minSpeed, maxSpeed };
}

function    setup_start_game_ws(pongGame, gameSettings)
{
    const { minSpeed, maxSpeed } = calculate_ball_speed(gameSettings);
    const   ball = pongGame.ball;

    pongGame.lostPoint = false;
    pongGame.listTouch = [];
    pongGame.ballSpeed = 0;
    pongGame.maxSpeed = maxSpeed;

    ball.position.x = 0;
    ball.position.z = 0;

    ball.vector.x = (Math.random() < 0.5) ? minSpeed : -minSpeed;
    ball.vector.y = (Math.random() < 0.5) ? minSpeed : -minSpeed;
}

function    handle_player_leave_match(match)
{
    const   newListPlayer = match.listUser;
    const   oldListPlayer = match.pongGame.listUser;

    const   playerLeave = (oldListPlayer.filter(player => !newListPlayer.includes(player)))[0];
    match.result.push(playerLeave);
    match.pongGame.listUser = match.listUser;

    create_paddles(match);
    send_data('draw paddles', '', 'server', match.listUser);
}

function    check_position_of_ball(match)
{
    const   ball = match.pongGame.ball;
    if (ball.collisionPoint.bottom < match.pongGame.limit.top) {
        match.pongGame.lostPoint = true;
        check_lost_point(match);
    }
    else if (ball.collisionPoint.top > match.pongGame.limit.bottom) {
        match.pongGame.lostPoint = true;
        check_lost_point(match);
    }
    else if (ball.collisionPoint.right < match.pongGame.limit.left) {
        match.pongGame.lostPoint = true;
        check_lost_point(match);
    }
    else if (ball.collisionPoint.left > match.pongGame.limit.right) {
        match.pongGame.lostPoint = true;
        check_lost_point(match);
    }
}

function    start_game_ws(match)
{
    const intervalId = setInterval(function()
    {
        // The number of players has changed
        if (match.listUser.length !== match.pongGame.listUser.length) {
            handle_player_leave_match(match);
        }

        // game over
        check_game_over(match);
        if (match.pongGame.gameOver)
        {
            clearInterval(intervalId);
            return;
        }

        // lost point
        if (match.pongGame.lostPoint)
        {
            clearInterval(intervalId);
            countdown(match);
            return ;
        }

        update_status_objects(match.pongGame);
        movements_ball(match);
        check_position_of_ball(match);
        movement_AI(match.pongGame);
        send_data('movement ball', match.pongGame.ball.position, 'server', match.listUser);
    }, 20);
}

function    countdown(match)
{
    let count = (match.pongGame.lostPoint === false) ? 15 : 3;
    if (match.mode === 'tournament') {
        count = 3;
    }
    
    const countdownInterval = setInterval(function() {
        if (count < -1)
        {
            clearInterval(countdownInterval);
            setup_start_game_ws(match.pongGame, match.gameSettings);
            create_paddles(match);
            start_game_ws(match);
            return ;
        }
        else
        {
            send_data('countdown', count, 'server', match.listUser);
            count--;
        }
    }, 1000);
}

module.exports = {
    countdown,
    calculate_ball_speed
};
