const { request_game_DB } = require("../dataToDB/requestGame");
const { update_match } = require("../match/updateMatch");
const { send_data } = require("../webSocket/dataToClient");
const { define_user_by_ID } = require("../webSocket/webSocket");

function    create_result(match)
{
    // Arranged from smallest to largest
    match.result = match.listPlayer.filter(player => player.type !== 'none');
    match.result.sort((a, b) => a.score - b.score);
    match.result.reverse();

    const   winner = match.result.filter(player => player.type === 'player')[0];
    match.winner = define_user_by_ID(winner.id);

    request_game_DB(`/api/v1/game/${match.id}/end`, match, winner);
    send_data('game over', match.result, 'server', match.listUser);
    send_data('update pongGame', match.pongGame, 'server', match.listUser);

    if (match.mode === 'tournament') {
        match.listUser.forEach((player, index) => {
            const user = define_user_by_ID(player.id);
            Object.assign(match.listPlayer[index], match.listPlayer[3]);
            update_match(user);
        })
    }
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
