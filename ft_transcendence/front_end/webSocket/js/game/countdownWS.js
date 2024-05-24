const { send_data } = require("../webSocket/dataToClient");
const { update_status_objects_ws } = require("./updateCollisionsPoint");
const { movements_ball_ws } = require("./movementsBall");
const { movement_AI_ws } = require("./movementsAI");
const { webSocket } = require("../webSocket/webSocket");
const { create_paddles_ws } = require("./createPaddleWS");
const { check_game_over } = require("./gameOver");

function    setup_start_game_ws(pongGame, gameSettings)
{
    pongGame.lostPoint = false;
    const   vector = gameSettings.speed.ball;
    const   ball = pongGame.ball;

    pongGame.listTouch = [];

    pongGame.speedBall = 0;
    ball.position.x = 0;
    ball.position.z = 0;

    ball.vector.x = (Math.random() < 0.5) ? vector : -vector;
    ball.vector.y = (Math.random() < 0.5) ? vector : -vector;
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
            create_paddles_ws(match);
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
            countdownWS(match);
            clearInterval(intervalId);
            return ;
        }

        update_status_objects_ws(match.pongGame);
        movement_AI_ws(match.pongGame);
        movements_ball_ws(match.pongGame, match.gameSettings);
        send_data('movement ball', match.pongGame.ball.position, 'server', match.listUser);
    }, 20);
}

function    countdownWS(match)
{
    let count = (match.pongGame.lostPoint === false) ? 15 : 3;
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
    countdownWS
};
