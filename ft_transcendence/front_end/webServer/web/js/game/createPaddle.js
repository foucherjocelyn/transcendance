import { THREE } from './gameWindows.js';
import { gameSettings } from "../gameSettings/getInputsGameSettings.js";
import { box, createBox, delete_old_object } from "./createObjects.js";
import { pongGame } from "./startGame.js";
import { delete_old_score } from './createScore.js';
import { match } from '../createMatch/createMatch.js';

function    create_left_paddle()
{
    const   distanceToBorder = 1;
    const   distanceToTable = 0.01;

    const   paddle  = new box();

    // name
    paddle.name = 'left paddle';
    paddle.id = 0;

    // size
    paddle.size.width = gameSettings.size.paddle.height;
    paddle.size.height = gameSettings.size.paddle.height;
    paddle.size.length = gameSettings.size.paddle.width;

    // position
    paddle.position.x = -(gameSettings.size.table.width / 2) + (paddle.size.width / 2) + distanceToBorder;
    paddle.position.y = (paddle.size.height / 2) + distanceToTable;
    paddle.position.z = 0;

    // control
    paddle.control.left = gameSettings.control.player1.left;
    paddle.control.right = gameSettings.control.player1.right;
    if (match.mode !== 'offline')
    {
        paddle.control.left = '◄';
        paddle.control.right = '►';
    }

    // vector
    paddle.vector.x = 0;
    paddle.vector.y = 90 * gameSettings.speed.paddle;

    // color
    paddle.color = gameSettings.color.paddles.player1;

    // display
    paddle.display = createBox(paddle.size.width, paddle.size.height, paddle.size.length);
    paddle.display.material.color = new THREE.Color(paddle.color);
    paddle.display.position.set(paddle.position.x, paddle.position.y, paddle.position.z);
    pongGame.scene.add(paddle.display);

    return paddle;
}

function    create_right_paddle()
{
    const   distanceToBorder = 1;
    const   distanceToTable = 0.01;

    const   paddle  = new box();

    // name
    paddle.name = 'right paddle';
    paddle.id = 1;

    // size
    Object.assign(paddle.size, pongGame.paddle.left.size);

    // position
    paddle.position.x = (gameSettings.size.table.width / 2) - (paddle.size.width / 2) - distanceToBorder;
    paddle.position.y = (paddle.size.height / 2) + distanceToTable;
    paddle.position.z = 0;

    // control
    paddle.control.left = gameSettings.control.player2.left;
    paddle.control.right = gameSettings.control.player2.right;
    if (match.mode !== 'offline')
    {
        paddle.control.left = '◄';
        paddle.control.right = '►';
    }

    // vector
    paddle.vector.x = 0;
    paddle.vector.y = 90 * gameSettings.speed.paddle;

    // color
    paddle.color = gameSettings.color.paddles.player2;

    // display
    paddle.display = createBox(paddle.size.width, paddle.size.height, paddle.size.length);
    paddle.display.material.color = new THREE.Color(paddle.color);
    paddle.display.position.set(paddle.position.x, paddle.position.y, paddle.position.z);
    pongGame.scene.add(paddle.display);

    return paddle;
}

function    create_top_paddle()
{
    const   distanceToBorder = 1;
    const   distanceToTable = 0.01;

    const   paddle  = new box();

    // name
    paddle.name = 'top paddle';
    paddle.id = 2;

    // size
    paddle.size.width = gameSettings.size.paddle.width;
    paddle.size.height = gameSettings.size.paddle.height;
    paddle.size.length = gameSettings.size.paddle.height;

    // position
    paddle.position.x = 0;
    paddle.position.y = (paddle.size.height / 2) + distanceToTable;
    paddle.position.z = -(gameSettings.size.table.height / 2) + (paddle.size.length / 2) + distanceToBorder;

    // control
    paddle.control.left = gameSettings.control.player3.left;
    paddle.control.right = gameSettings.control.player3.right;
    if (match.mode !== 'offline')
    {
        paddle.control.left = '◄';
        paddle.control.right = '►';
    }

    // vector
    paddle.vector.x = 90 * gameSettings.speed.paddle;
    paddle.vector.y = 0;

    // color
    paddle.color = gameSettings.color.paddles.player3;

    // display
    paddle.display = createBox(paddle.size.width, paddle.size.height, paddle.size.length);
    paddle.display.material.color = new THREE.Color(paddle.color);
    paddle.display.position.set(paddle.position.x, paddle.position.y, paddle.position.z);
    pongGame.scene.add(paddle.display);

    return paddle;
}

function    create_bottom_paddle()
{
    const   distanceToBorder = 1;
    const   distanceToTable = 0.01;

    const   paddle  = new box();

    // name
    paddle.name = 'bottom paddle';
    paddle.id = 3;

    // size
    Object.assign(paddle.size, pongGame.paddle.top.size);

    // position
    paddle.position.x = 0;
    paddle.position.y = (paddle.size.height / 2) + distanceToTable;
    paddle.position.z = (gameSettings.size.table.height / 2) - (paddle.size.length / 2) - distanceToBorder;

    // control
    paddle.control.left = gameSettings.control.player4.left;
    paddle.control.right = gameSettings.control.player4.right;
    if (match.mode !== 'offline')
    {
        paddle.control.left = '◄';
        paddle.control.right = '►';
    }

    // vector
    paddle.vector.x = 90 * gameSettings.speed.paddle;
    paddle.vector.y = 0;

    // color
    paddle.color = gameSettings.color.paddles.player4;

    // display
    paddle.display = createBox(paddle.size.width, paddle.size.height, paddle.size.length);
    paddle.display.material.color = new THREE.Color(paddle.color);
    paddle.display.position.set(paddle.position.x, paddle.position.y, paddle.position.z);
    pongGame.scene.add(paddle.display);

    return paddle;
}

function    delete_old_paddles()
{
    if (pongGame.listPaddle === undefined)
        return ;

    pongGame.listPaddle.forEach(paddle => {
        if (paddle !== undefined)
        {
            delete_old_score(paddle);
            delete_old_object(paddle.display);
            paddle = undefined;
        }
    })

    pongGame.paddle.left = undefined;
    pongGame.paddle.right = undefined;
    pongGame.paddle.top = undefined;
    pongGame.paddle.bottom = undefined;
}

function    define_paddle(id)
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

function    create_paddle()
{
    delete_old_paddles();

    if (pongGame.listPlayer[0].type !== 'none')
        pongGame.paddle.left = create_left_paddle();
    if (pongGame.listPlayer[1].type !== 'none')
        pongGame.paddle.right = create_right_paddle();
    if (pongGame.listPlayer[2].type !== 'none')
        pongGame.paddle.top = create_top_paddle();
    if (pongGame.listPlayer[3].type !== 'none')
        pongGame.paddle.bottom = create_bottom_paddle();

    pongGame.listPaddle = [];
    pongGame.listPaddle.push(pongGame.paddle.left);
    pongGame.listPaddle.push(pongGame.paddle.right);
    pongGame.listPaddle.push(pongGame.paddle.top);
    pongGame.listPaddle.push(pongGame.paddle.bottom);
}

export {
    create_paddle,
    define_paddle
};
