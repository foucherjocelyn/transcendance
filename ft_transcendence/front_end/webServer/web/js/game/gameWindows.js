import * as THREE from '../../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { client, dataToServer, pongGame } from '../client/client.js';
import { match } from '../createMatch/createMatch.js';
import { gameSettings } from '../gameSettings/updateGameSetting.js';
import { screen } from "../screen/screen.js";
import { displayPongGame } from './startGame.js';

import { draw_table } from './drawTable.js';
import { draw_border } from './drawBorders.js';
import { draw_paddle } from './drawPaddles.js';
import { draw_ball } from './drawBall.js';

function	addLight(scene)
{
	const	ambientLight = new THREE.AmbientLight(0xFFFFFF, 2); // (color, brightness)
	pongGame.scene.add(ambientLight);

	const	directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
	directionalLight.position.set(0, 60, 30);
	directionalLight.castShadow = true; // put shadow
	pongGame.scene.add(directionalLight);
}

function    handleKeyDown(event)
{
    // console.log(event.keyCode);
    // console.log(event.key);

    const sendData = new dataToServer('movement paddle', event.key, 'socket server');
    client.socket.send(JSON.stringify(sendData));
}

function    movements_paddle() {
    document.addEventListener("keydown", handleKeyDown);
}

function    stop_movements_paddle() {
    document.removeEventListener("keydown", handleKeyDown);
}

function    animation(renderer, scene, camera)
{
    const   ball = pongGame.ball;
    if (pongGame.gameOver || ball === undefined)
    {
        stop_movements_paddle();
        renderer.setAnimationLoop(null);
        return ;
    }
    
    displayPongGame.ball.position.set(ball.position.x, ball.position.y, ball.position.z);
    pongGame.listPaddle.forEach((paddle, index) => {
        if (paddle !== null)
            displayPongGame.paddles[index].position.set(paddle.position.x, paddle.position.y, paddle.position.z);
    })
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
    draw_table();
    draw_border();
    draw_paddle();
    draw_ball();
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
    movements_paddle();

    const   orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    renderer.setAnimationLoop(() => animation(renderer, scene, camera));
}

export {
    THREE,
    setup_game_windows,
    add_objects
};
