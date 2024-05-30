const { send_data } = require("../webSocket/dataToClient");
const { boxWS } = require("./formBox");

function    define_paddle(id, pongGame)
{
    if (id === undefined || pongGame.listPaddle === undefined)
        return undefined;

    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        if (paddle !== undefined && i === id)
            return paddle;
    }
    return undefined;
}

function createPaddle(modeGame, gameSettings, name, id, positionX, positionZ, controlLeft, controlRight, color)
{
    const distanceToTable = 0.01;
    const paddle = new boxWS();

    // name
    paddle.name = name;
    paddle.id = id;

    // size
    if (positionZ === 0) {
        paddle.size.width = gameSettings.size.paddle.height;
        paddle.size.height = gameSettings.size.paddle.height;
        paddle.size.length = gameSettings.size.paddle.width;
    } else {
        paddle.size.width = gameSettings.size.paddle.width;
        paddle.size.height = gameSettings.size.paddle.height;
        paddle.size.length = gameSettings.size.paddle.height;
    }

    // position
    paddle.position.x = positionX;
    paddle.position.y = (paddle.size.height / 2) + distanceToTable;
    paddle.position.z = positionZ;

    // control
    paddle.control.left = controlLeft;
    paddle.control.right = controlRight;
    if (modeGame !== 'offline') {
        paddle.control.left = '◄';
        paddle.control.right = '►';
    }

    // vector
    if (positionZ === 0) {
        paddle.vector.x = 0;
        paddle.vector.y = gameSettings.speed.paddle;
    } else {
        paddle.vector.x = gameSettings.speed.paddle;
        paddle.vector.y = 0;
    }

    // color
    paddle.color = color;

    return paddle;
}

function create_left_paddle(modeGame, gameSettings)
{
    const distanceToBorder = 1;

    return createPaddle(modeGame, gameSettings, 'left paddle', 0,
        -(gameSettings.size.table.width / 2) + (gameSettings.size.paddle.height / 2) + distanceToBorder,
        0,
        gameSettings.control.player1.left,
        gameSettings.control.player1.right,
        gameSettings.color.paddles.player1
    );
}

function create_right_paddle(modeGame, gameSettings)
{
    const distanceToBorder = 1;

    return createPaddle(modeGame, gameSettings, 'right paddle', 1,
        (gameSettings.size.table.width / 2) - (gameSettings.size.paddle.height / 2) - distanceToBorder,
        0,
        gameSettings.control.player2.left,
        gameSettings.control.player2.right,
        gameSettings.color.paddles.player2
    );
}

function create_top_paddle(modeGame, gameSettings)
{
    const distanceToBorder = 1;

    return createPaddle(modeGame, gameSettings, 'top paddle', 2,
        0,
        -(gameSettings.size.table.height / 2) + (gameSettings.size.paddle.height / 2) + distanceToBorder,
        gameSettings.control.player3.left,
        gameSettings.control.player3.right,
        gameSettings.color.paddles.player3
    );
}

function create_bottom_paddle(modeGame, gameSettings)
{
    const distanceToBorder = 1;

    return createPaddle(modeGame, gameSettings, 'bottom paddle', 3,
        0,
        (gameSettings.size.table.height / 2) - (gameSettings.size.paddle.height / 2) - distanceToBorder,
        gameSettings.control.player4.left,
        gameSettings.control.player4.right,
        gameSettings.color.paddles.player4
    );
}

function    create_paddles(match)
{
    match.pongGame.paddle.left = undefined;
    match.pongGame.paddle.right = undefined;
    match.pongGame.paddle.top = undefined;
    match.pongGame.paddle.bottom = undefined;

    if (match.pongGame.listPlayer[0].type !== 'none')
        match.pongGame.paddle.left = create_left_paddle(match.mode, match.gameSettings);
    if (match.pongGame.listPlayer[1].type !== 'none')
        match.pongGame.paddle.right = create_right_paddle(match.mode, match.gameSettings);
    if (match.pongGame.listPlayer[2].type !== 'none')
        match.pongGame.paddle.top = create_top_paddle(match.mode, match.gameSettings);
    if (match.pongGame.listPlayer[3].type !== 'none')
        match.pongGame.paddle.bottom = create_bottom_paddle(match.mode, match.gameSettings);

    match.pongGame.listPaddle = [];
    match.pongGame.listPaddle.push(match.pongGame.paddle.left);
    match.pongGame.listPaddle.push(match.pongGame.paddle.right);
    match.pongGame.listPaddle.push(match.pongGame.paddle.top);
    match.pongGame.listPaddle.push(match.pongGame.paddle.bottom);

    match.listPlayer.forEach((player, index) => {
        const   paddle = match.pongGame.listPaddle[index];
        if (paddle !== undefined) {
            player.paddle = paddle;
        }
    })

    send_data('update paddles', match.pongGame.listPaddle, 'server', match.listUser);
}

module.exports = {
    create_paddles,
    define_paddle
};
