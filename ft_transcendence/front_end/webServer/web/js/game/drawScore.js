import { THREE } from "./gameWindows.js";
import { pongGame } from "../client/client.js";
import { createBox, delete_old_object } from "./createObjects.js";
import { displayPongGame } from "./startGame.js";

export function    delete_old_score_bar(paddle)
{
    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   check = pongGame.listPaddle[i];
        if (check !== null &&
            check.name === paddle.name &&
            displayPongGame.scores[i] !== undefined &&
            displayPongGame.scores[i].length > 0)
        {
            for (let j = 0; j < check.listScore.length; j++)
            {
                delete_old_object(displayPongGame.scores[i][j]);
            }
            return ;
        }
    }
}

export function draw_score(paddle)
{
    delete_old_score_bar(paddle);

    displayPongGame.scores[paddle.id] = [];
    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   check = pongGame.listPaddle[i];
        if (check.name === paddle.name)
        {
            pongGame.listPaddle[i] = paddle;
            paddle.listScore.forEach(score => {
                const    scorePoint = createBox(score.size.width, score.size.height, score.size.length);
                scorePoint.material.color = new THREE.Color(score.color);
                scorePoint.position.set(score.position.x, score.position.y, score.position.z);
                pongGame.scene.add(scorePoint);
                displayPongGame.scores[i].push(scorePoint);
            })
            return ;
        }
    }
}
