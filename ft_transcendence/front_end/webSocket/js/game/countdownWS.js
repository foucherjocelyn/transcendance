const { send_data } = require("../webSocket/dataToClient");
const { update_status_objects_ws } = require("./updateCollisionsPoint");
const { movements_ball_ws } = require("./movementsBall");
const { movement_AI_ws } = require("./movementsAI");
const { webSocket } = require("../webSocket/webSocket");
const { create_paddles_ws } = require("./createPaddleWS");

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

function    start_game_ws(match)
{
    const intervalId = setInterval(function()
    {
        // player = 0
        if (match.listUser.length === 0) {
            clearInterval(intervalId);
            return;
        }

        // The number of players has changed
        const nbrPaddle = 4 - match.pongGame.listPaddle.filter(paddle => paddle === undefined).length;
        const nbrPlayer = 4 - match.pongGame.listPlayer.filter(player => player.type === 'none').length;
        if (nbrPlayer !== nbrPaddle)
            create_paddles_ws(match);

        // game over
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
        movements_ball_ws(match.pongGame, match.gameSettings);
        send_data('movement ball', match.pongGame.ball.position, 'server', match.listUser);
        movement_AI_ws(match.pongGame);
    }, 20);
}

function    countdownWS(match)
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
    countdownWS
};
