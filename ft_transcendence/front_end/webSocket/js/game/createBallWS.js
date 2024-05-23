const { send_data } = require("../webSocket/dataToClient");
const { boxWS } = require("./formBox");

function    create_ball_ws(match)
{
    const   distanceToTable = 0.01;
    const   ball  = new boxWS();

    // name
    ball.name = 'ball';

    // size
    ball.size.width = match.gameSettings.size.ball;
    ball.size.height = match.gameSettings.size.ball;
    ball.size.length = match.gameSettings.size.ball;

    // position
    ball.position.x = 0;
    ball.position.y = (ball.size.height / 2) + distanceToTable;
    ball.position.z = 0;

    match.pongGame.ball = ball;
    send_data('update ball', match.pongGame.ball, 'server', match.listUser)
}

module.exports = {
    create_ball_ws
};
