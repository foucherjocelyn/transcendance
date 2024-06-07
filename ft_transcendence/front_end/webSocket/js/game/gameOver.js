const { request_game_DB } = require("../dataToDB/requestGame");
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

    // Arranged from smallest to largest
    match.result.sort((a, b) => a.score - b.score);
    match.result.reverse();
    const   winner = match.result.filter(player => player.type === 'player')[0];

    request_game_DB(`/api/v1/game/${match.id}/end`, match, winner);
    send_data('game over', match.result, 'server', match.listUser);
    send_data('update pongGame', match.pongGame, 'server', match.listUser);
}

function    check_game_over(match)
{
    const   nbrPaddle = 4 - match.pongGame.listPaddle.filter(paddle => paddle === undefined).length;
    const   winner = match.pongGame.listPlayer.filter(player => player.score === match.pongGame.maxPoint)[0];

    if (nbrPaddle < 2 || match.listUser.length === 0) {
        match.pongGame.gameOver = true;
    }
    else if (match.mode === 'ranked' && match.listUser.length === 1) {
        match.pongGame.gameOver = true;
    }
    else if (winner !== undefined) {
        match.pongGame.gameOver = true;
    }

    if (match.pongGame.gameOver) {
        create_result(match);
    }
}

module.exports = {
    check_game_over
};
