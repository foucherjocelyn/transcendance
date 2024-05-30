const { send_data } = require("../webSocket/dataToClient");
const { boxWS } = require("./formBox");

function    create_score_point(x, y, z, color, gameSettings)
{
    const   score = new boxWS();

    // size
    score.size.width = gameSettings.size.border;
    score.size.height = gameSettings.size.border;
    score.size.length = gameSettings.size.border;

    // position
    score.position.x = x;
    score.position.y = y;
    score.position.z = z;

    // color
    score.color = color;

    return score;
}

function    draw_vertical_score_bar(x, y, z, nextDistance, paddle, match)
{
    const   pongGame = match.pongGame;
    const   gameSettings = match.gameSettings;
    const   player = pongGame.listPlayer[paddle.id];

    paddle.listScore = [];
    for (let i = 0; i < player.score; i++)
    {
        const   score = create_score_point(x, y, z, paddle.color, gameSettings);
        z += nextDistance;
        paddle.listScore.push(score);
    }
    send_data('draw score', paddle, 'server', pongGame.listUser);
}

function    vertical_score_bar(paddle, match)
{
    const   pongGame = match.pongGame;

    if (paddle === undefined) {
        return ;
    }

    const   border = pongGame.listBorder[paddle.id];

    let x = (border.position.x < 0) ?
    border.position.x - (border.size.height * 2) :
    border.position.x + (border.size.height * 2);

    let y = border.position.y;

    let z = (border.position.x < 0) ?
    (border.collisionPoint.bottom - (border.size.height / 2)) :
    (border.collisionPoint.top + (border.size.height / 2));

    // Distance between score boxes 
    let nextDistance = border.size.height + (border.size.height / 2);
    nextDistance = (border.position.x < 0) ? -nextDistance : nextDistance;

    draw_vertical_score_bar(x, y, z, nextDistance, paddle, match);
}

function    draw_horizontal_score_bar(x, y, z, nextDistance, paddle, match)
{
    const   pongGame = match.pongGame;
    const   gameSettings = match.gameSettings;
    const   player = pongGame.listPlayer[paddle.id];

    paddle.listScore = [];
    for (let i = 0; i < player.score; i++)
    {
        const   score = create_score_point(x, y, z, paddle.color, gameSettings);
        x += nextDistance;
        paddle.listScore.push(score);
    }
    send_data('draw score', paddle, 'server', pongGame.listUser);
}

function    horizontal_score_bar(paddle, match)
{
    const   pongGame = match.pongGame;

    if (paddle === undefined) {
        return ;
    }

    const   border = pongGame.listBorder[paddle.id];

    let x = (border.position.z < 0) ?
    (border.collisionPoint.left + (border.size.height / 2)) :
    (border.collisionPoint.right - (border.size.height / 2));

    let y = border.position.y;

    let z = (border.position.z < 0) ?
    border.position.z - (border.size.height * 2) :
    border.position.z + (border.size.height * 2);

    // Distance between score boxes 
    let nextDistance = border.size.height + (border.size.height / 2);
    nextDistance = (border.position.z < 0) ? nextDistance : -nextDistance;

    draw_horizontal_score_bar(x, y, z, nextDistance, paddle, match);
}

function    create_score(paddle, match)
{
    if (paddle.name === 'left paddle' || paddle.name === 'right paddle') {
        vertical_score_bar(paddle, match);
    }
    else {
        horizontal_score_bar(paddle, match);
    }
}

module.exports = {
    create_score
};
