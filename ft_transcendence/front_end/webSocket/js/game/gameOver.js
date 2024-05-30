const { send_data } = require("../webSocket/dataToClient");

function    create_result(match)
{
    for (let i = 0; i < 4; i++)
    {
        if (match.result.length === 4) {
            break ;
        }
        const   player = match.listPlayer[i];
        if (player.type !== 'none') {
            match.result.push(player);
        }
    }
    
    // Arranged from largest to smallest
    match.result.sort((a, b) => b.score - a.score);
    
    send_data('game over', match.result, 'server', match.listUser);
    send_data('update pongGame', match.pongGame, 'server', match.listUser);
}

function    check_game_over(match)
{
    const   nbrPaddle = 4 - match.pongGame.listPaddle.filter(paddle => paddle === undefined).length;
    const   winner = match.pongGame.listPlayer.filter(player => player.score === match.pongGame.maxPoint);

    if (nbrPaddle < 2) {
        match.pongGame.gameOver = true;
    }
    else if (match.mode === 'ranked' && match.listUser.length === 1) {
        match.pongGame.gameOver = true;
    }
    else if (winner.length !== 0) {
        match.pongGame.gameOver = true;
    }

    if (match.pongGame.gameOver) {
        create_result(match);
    }
}

module.exports = {
    check_game_over
};
