const { send_data } = require("../webSocket/dataToClient");
const { update_status_objects } = require("./collisionsPoint");
const { movements_ball } = require("./movementsBall");
const { movement_AI } = require("./movementsAI");
const { webSocket } = require("../webSocket/webSocket");
const { create_paddles } = require("./createPaddle");
const { check_game_over } = require("./gameOver");

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

    // console.log(minSpeed + ' - ' + maxSpeed);

    pongGame.lostPoint = false;
    pongGame.listTouch = [];
    pongGame.ballSpeed = 0;
    pongGame.maxSpeed = maxSpeed;

    ball.position.x = 0;
    ball.position.z = 0;

    ball.vector.x = (Math.random() < 0.5) ? minSpeed : -minSpeed;
    ball.vector.y = (Math.random() < 0.5) ? minSpeed : -minSpeed;
}

function    handle_player_deconnection(arr1, arr2, match)
{
    const   playerLeave = arr1.filter(element => !arr2.includes(element));
    match.result.push(playerLeave[0]);
}

function    start_game_ws(match)
{
    const intervalId = setInterval(function()
    {
        // The number of players has changed
        const nbrPaddle = 4 - match.pongGame.listPaddle.filter(paddle => paddle === undefined).length;
        const nbrPlayer = 4 - match.pongGame.listPlayer.filter(player => player.type === 'none').length;
        if (nbrPlayer !== nbrPaddle)
        {
            create_paddles(match);
            handle_player_deconnection(match.pongGame.listUser, match.listUser, match);
            match.pongGame.listUser = match.listUser;
            send_data('draw paddles', '', 'server', match.listUser);
        }

        // game over
        check_game_over(match);
        if (match.pongGame.gameOver) {
            clearInterval(intervalId);
            return;
        }

        // lost point
        if (match.pongGame.lostPoint)
        {
            countdown(match);
            clearInterval(intervalId);
            return ;
        }

        update_status_objects(match.pongGame);
        movements_ball(match.pongGame, match.gameSettings);
        movement_AI(match.pongGame);
        send_data('movement ball', match.pongGame.ball.position, 'server', match.listUser);
    }, 20);
}

function    countdown(match)
{
    let count = (match.pongGame.lostPoint === false) ? 1 : 3;
    const countdownInterval = setInterval(function() {
        if (count < -1)
        {
            clearInterval(countdownInterval);
            setup_start_game_ws(match.pongGame, match.gameSettings);
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
