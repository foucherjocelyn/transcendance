import { client, dataToServer } from '../client/client.js';
import { match } from '../createMatch/createMatch.js';
import { count_empty_place } from '../createMatch/getSignButtonsInCreateMatch.js';
import { create_score } from '../game/createScore.js'
import { pongGame } from '../game/startGame.js';
import { setup_game_over } from './gameOverLayer.js';

function    create_result()
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        for (let j = 0; j < match.listPlayer.length; j++)
        {
            const   player = match.listPlayer[j];
            if (j > 0)
            {
                const   player2 = match.listPlayer[j - 1];
                if (player.score <= player2.score)
                {
                    const   tmp = match.listPlayer[j];
                    match.listPlayer[j] = match.listPlayer[j - 1];
                    match.listPlayer[j - 1] = tmp;
                }
            }
        }
    }
    match.listPlayer.forEach(player => {
        if (player.type !== 'none')
            match.result.push(player);
    })
    match.result.reverse();
    // console.table(match.result);
}

function    define_winner()
{
    for (let i = 0; i < match.result.length; i++)
    {
        const   player = match.result[i];
        if (player.type === 'player')
            return player;
    };
    return undefined;
}

function    check_game_over()
{
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.score !== 0)
            create_score();

        if (player.score === pongGame.maxPoint || count_empty_place() === 3)
        {
            pongGame.gameOver = true;

            match.listPlayer.forEach((player, index) => {
                player.paddle = pongGame.listPaddle[index];
            })
            
            create_result();

            const   winner = define_winner();
            if (client.inforUser.id === winner.id)
            {
                const sendData = new dataToServer('game over', match, client.inforUser, match.listUser);
	            client.socket.send(JSON.stringify(sendData));
            }
            
            setup_game_over();
            return ;
        }
    }
}

export {
    check_game_over
};
