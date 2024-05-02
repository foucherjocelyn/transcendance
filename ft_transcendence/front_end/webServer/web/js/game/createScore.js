import { define_player } from "../createMatch/createPlayers.js";
import { gameSettings } from "../gameSettings/getInputsGameSettings.js";
import { define_border } from "./createBorder.js";
import { box, createBox, delete_old_object } from "./createObjects.js";
import { THREE } from "./gameWindows.js";
import { pongGame } from "./startGame.js";

function    draw_score(x, y, z, color)
{
    const   score  = new box();

    // size
    score.size.width = gameSettings.size.border;
    score.size.height = gameSettings.size.border;
    score.size.length = gameSettings.size.border;

    // position
    score.position.x = x;
    score.position.y = y;
    score.position.z = z;

    // display
    score.display = createBox(score.size.width, score.size.height, score.size.length);
    score.display.material.color = new THREE.Color(color);
    score.display.position.set(score.position.x, score.position.y, score.position.z);
    pongGame.scene.add(score.display);

    return score;
}

function    delete_old_score(paddle)
{
    if (paddle.listScore === undefined)
        return ;

    for (let i = 0; i < paddle.listScore.length; i++)
    {
        const   score = paddle.listScore[i];
        delete_old_object(score.display);
    }
}

function    draw_vertical_score_bar(x, y, z, nextDistance, paddle)
{
    const   player = define_player(paddle.id);
    if (player === undefined)
        return ;

    delete_old_score(paddle);
    paddle.listScore = [];
    for (let i = 0; i < player.score; i++)
    {
        const   score = draw_score(x, y, z, paddle.color);
        z += nextDistance;
        paddle.listScore.push(score);
    }
}

function    vertical_score_bar(paddle)
{
    if (paddle === undefined)
        return ;

    const   border = define_border(paddle.id);
    if (border === undefined)
        return ;

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

    draw_vertical_score_bar(x, y, z, nextDistance, paddle);
}

function    draw_horizontal_score_bar(x, y, z, nextDistance, paddle)
{
    const   player = define_player(paddle.id);
    if (player === undefined)
        return ;

    delete_old_score(paddle);
    paddle.listScore = [];
    for (let i = 0; i < player.score; i++)
    {
        const   score = draw_score(x, y, z, paddle.color);
        x += nextDistance;
        paddle.listScore.push(score);
    }
}

function    horizontal_score_bar(paddle)
{
    if (paddle === undefined)
        return ;

    const   border = define_border(paddle.id);
    if (border === undefined)
        return ;

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

    draw_horizontal_score_bar(x, y, z, nextDistance, paddle);
}

function    create_score()
{
    vertical_score_bar(pongGame.paddle.left);
    vertical_score_bar(pongGame.paddle.right);
    horizontal_score_bar(pongGame.paddle.top);
    horizontal_score_bar(pongGame.paddle.bottom);
}

export {
    create_score,
    delete_old_score
}
