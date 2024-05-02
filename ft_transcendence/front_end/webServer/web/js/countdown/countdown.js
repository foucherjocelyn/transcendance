import { client, dataToServer } from "../client/client.js";
import { match } from "../createMatch/createMatch.js";
import { pongGame } from "../game/startGame.js";
import { gameSettings } from "../gameSettings/getInputsGameSettings.js";

function    setup_start_game()
{
    const   vector = 45 * gameSettings.speed.ball;
    const   ball = pongGame.ball;

    pongGame.listTouch = [];

    pongGame.speedBall = 0;
    ball.position.x = 0;
    ball.position.z = 0;

    ball.vector.x = (Math.random() < 0.5) ? vector : -vector;
    ball.vector.y = (Math.random() < 0.5) ? vector : -vector;
    // ball.vector.y = 0.1;

    const  sendData = new dataToServer('update vector ball', ball.vector, client.inforUser, match.listUser);
    client.socket.send(JSON.stringify(sendData));
}

function countdown(callback)
{
    const   countdownLayer = document.getElementById('countdownLayer');
    countdownLayer.style.display = 'flex';

    const   contentCountdown = document.querySelector('#countdownLayer > span')
    let count = 3;

    const countdownInterval = setInterval(function() {
        if (count === 1)
            contentCountdown.textContent = "Start";
        else
            contentCountdown.textContent = count - 1;
        count--;
        if (count < 0) {
            clearInterval(countdownInterval);

            document.getElementById('gameInstructionsLayer').style.display = 'none';
            countdownLayer.style.display = 'none';
            
            setup_start_game();
            contentCountdown.textContent = 3;

            callback(true);
            return ;
        }
    }, 1000);
    callback(false);
}

export {
    countdown,
    setup_start_game
};
