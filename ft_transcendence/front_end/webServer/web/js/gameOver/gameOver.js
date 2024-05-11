import { client } from '../client/client.js';
import { match } from '../createMatch/createMatch.js';
import { count_empty_place } from '../createMatch/getSignButtonsInCreateMatch.js';
import { create_score } from '../game/createScore.js'
import { get_date, get_time, pongGame } from '../game/startGame.js';
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
            create_result();
            
            match.timeStop = get_time();
            match.dateStop = get_date();
            
            if (player.id === client.inforUser.id)
            {
                console.log('send to data base');
            }

            setup_game_over();
            return ;
        }
    }
}

export {
    check_game_over
};
