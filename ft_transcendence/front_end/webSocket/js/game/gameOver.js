const { request_game_DB } = require("../dataToDB/requestGame");
const { update_match } = require("../match/updateMatch");
const { send_data } = require("../webSocket/dataToClient");
const { define_user_by_ID } = require("../webSocket/webSocket");

async function    create_result(match)
{
    // Arranged from smallest to largest
    const   result = match.listPlayer.filter(player => player.type !== 'none');
    result.sort((a, b) => a.score - b.score);
    result.reverse();

    // Define the winner
    const   winner = result.filter(player => player.type === 'player')[0];
    if (match.listUser.length > 0) {
        match.winner = define_user_by_ID(winner.id);
        console.log('---> winner: ' + match.winner.username);
    }

    // add the loser on the table result
    match.result.forEach(loser => {
        result.push(loser);
    })
    match.result = result;

    request_game_DB(`/api/v1/game/${match.id}/end`, match, match.winner);

    send_data('game over', match.result, 'server', match.listUser);
    send_data('update pongGame', match.pongGame, 'server', match.listUser);

    if (match.mode === 'tournament') {
        for (let i = 0; i < 2; i++)
        {
            const   player = match.listPlayer[i];
            const   user = define_user_by_ID(player.id);
            if (user !== undefined)
            {
                let status_exit_button = (match.finalMatch || user.id !== match.winner.id) ? 'flex' : 'none';
                send_data('display exit match', status_exit_button, 'server', user);
    
                if (player.id === match.winner.id && match.finalMatch === false) {
                    Object.assign(match.listPlayer[i], match.listPlayer[3]);
                }
                update_match(user);
            }
        }
    }
}

function    check_game_over(match)
{
    const   nbrPaddle = 4 - match.pongGame.listPaddle.filter(paddle => paddle === undefined).length;
    const   winner = match.pongGame.listPlayer.filter(player => player.score === match.pongGame.maxPoint)[0];

    if (nbrPaddle < 2 || match.listUser.length === 0) {
        match.pongGame.gameOver = true;
    }
    else if ((match.mode === 'ranked' || match.mode === 'with friends') && match.listUser.length === 1) {
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
