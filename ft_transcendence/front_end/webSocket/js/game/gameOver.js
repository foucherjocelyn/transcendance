const { send_data } = require("../webSocket/dataToClient");

function    create_result(match)
{
    match.pongGame.listPlayer.forEach((player, index) => {
        player.paddle = match.pongGame.listPaddle[index];
    })
    
    // Arranged from smallest to largest
    match.pongGame.listPlayer.sort((a, b) => a.score - b.score);
    
    const   listPlayerInMatch = match.pongGame.listPlayer.filter(player => player.type !== 'none');
    match.result = (match.result.length !== 0) ?
    match.result.concat(listPlayerInMatch) : match.pongGame.listPlayer;

    // Arranged from largest to smallest
    match.result.reverse();

    // // define winner
    // for (let i = 0; i < match.result.length; i++)
    // {
    //     const   winner = match.result[i];
    //     if (winner.type === 'player')
    //     {
    //         // console.table(winner);
    //         // console.table(match.listUser);
    //         return ;
    //     }
    // }

    send_data('game over', match.result, 'server', match.listUser);
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

    if (match.pongGame.gameOver)
        create_result(match);
}

module.exports = {
    check_game_over
};
