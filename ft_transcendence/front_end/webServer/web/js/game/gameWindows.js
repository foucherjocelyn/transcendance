import * as THREE from '../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { client } from '../client/client.js';
import { countdown } from '../countdown/countdown.js';
import { match } from '../createMatch/createMatch.js';
import { check_game_over } from '../gameOver/gameOver.js';
import { gameSettings } from '../gameSettings/getInputsGameSettings.js';

import { screen } from "../screen/screen.js";
import { create_ball, update_status_objects } from './createBall.js';
import { create_border } from './createBorder.js';
import { create_paddle } from './createPaddle.js';
import { create_plane } from './createPlane.js';
import { movement_AI } from './movementsAI.js';
import { movements_ball } from './movementsBall.js';
import { movements_paddle } from './movementsPaddle.js';
import { pongGame } from './startGame.js';

function	addLight(scene)
{
	const	ambientLight = new THREE.AmbientLight(0xFFFFFF, 2); // (color, brightness)
	pongGame.scene.add(ambientLight);

	const	directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
	directionalLight.position.set(0, 60, 30);
	directionalLight.castShadow = true; // put shadow
	pongGame.scene.add(directionalLight);
}

function    handle_player_deconnection()
{
    for (let i = 0; i < pongGame.listPlayer.length; i++)
    {
        const   player1 = pongGame.listPlayer[i];
        const   player2 = match.listPlayer[i];
        if (player1.id !== player2.id)
        {
            match.result.push(player1);
            return ;
        }
    }
}

function    start_game()
{
    if (pongGame.listPlayer !== match.listPlayer)
    {
        handle_player_deconnection();
        pongGame.listPlayer = match.listPlayer;
        create_paddle();
    }

    update_status_objects();
    movements_ball();
    update_status_objects();
    movement_AI();

    for (let i = 0; i < pongGame.listPaddle.length; i++)
    {
        const   paddle = pongGame.listPaddle[i];
        if (paddle !== undefined)
        {
            paddle.display.position.set(paddle.position.x, paddle.position.y, paddle.position.z);
        }
    }

    const   ball = pongGame.ball;
    ball.display.position.set(ball.position.x, ball.position.y, ball.position.z);

    update_status_objects();
}

let countdownCalled = false;

function    check_lost_point(countdownCalled, callback)
{
    if (countdownCalled)
    {
        callback(false);
        return ;
    }

    if (pongGame.lostPoint)
    {
        callback(true);
        return ;
    }

    const   poX = pongGame.ball.position.x;
    const   poZ = pongGame.ball.position.z;

    if (poZ < pongGame.limit.top || poZ > pongGame.limit.bottom
        || poX < pongGame.limit.left || poX > pongGame.limit.right)
    {
        callback(true);
        return;
    }
    callback(false);

}

function    animation(renderer, scene, camera)
{
    check_game_over();
    if (pongGame.gameOver)
    {
        renderer.setAnimationLoop(null);
        return ;
    }

    check_lost_point(countdownCalled, (result) => {
        if (result)
        {
            countdownCalled = true;
            countdown((start) => {
                if (start)
                {
                    pongGame.lostPoint = false;
                    countdownCalled = false;
                    add_objects();
                }
            })
        }
    });
    if (countdownCalled)
        return ;

    start_game();
    
    renderer.render(scene, camera);
}

function    setup_camera_position(camera)
{
    if (match.mode === 'offline')
        camera.position.set(0, 35, 0);
    else
    {
        const   wTable = gameSettings.size.table.width + 3;
        const   hTable = gameSettings.size.table.height + 3;

        for (let i = 0; i < match.listPlayer.length; i++)
        {
            const   player = match.listPlayer[i];
            if (player.id === client.inforUser.id)
            {
                if (i === 0) // left
                    camera.position.set(-wTable, 20, 0);
                else if (i === 1) // right
                    camera.position.set(wTable, 20, 0);
                else if (i === 2) // top
                    camera.position.set(0, 20, -hTable);
                else // bottom
                    camera.position.set(0, 20, hTable);
                return ;
            }
        }
    }
}

function    add_objects()
{
    setup_camera_position(pongGame.camera);
    create_plane();
    create_border();
    create_paddle();
    create_ball();
    movements_paddle();
}

function    setup_game_windows()
{
    const   renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('gameWindows')
    });
    renderer.setSize(screen.width, screen.height);

    const   scene = new THREE.Scene();
    pongGame.scene = scene;

    const   camera = new THREE.PerspectiveCamera(
        45,
        screen.width / screen.height,
        0.1,
        1000
    );
    pongGame.camera = camera;

    // const   axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    addLight();
    add_objects();

    const   orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    renderer.setAnimationLoop(() => animation(renderer, scene, camera));
}

export {
    THREE,
    setup_game_windows,
    add_objects
};
