import { client, dataToServer, pongGame } from "../client/client.js";
import { match } from "../createMatch/createMatch.js";
import { gameSettings } from "../gameSettings/updateGameSetting.js";

function    setup_start_game()
{
    const   vector = gameSettings.speed.ball;
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

            if (document.getElementById('gameInstructionsLayer') !== null)
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

export function display_countdown(number)
{
    const   countdownLayer = document.getElementById('countdownLayer');
    countdownLayer.style.display = 'flex';

    const   contentCountdown = document.querySelector('#countdownLayer > span')

    if (number === -1)
    {
        countdownLayer.style.display = 'none';
        if (document.getElementById('gameInstructionsLayer') !== null)
            document.getElementById('gameInstructionsLayer').style.display = 'none';
        if (document.getElementById('gameSettingPanel') !== null)
            document.getElementById('gameSettingPanel').style.display = 'none';
    }
    else if (number === 0)
        contentCountdown.textContent = "Start";
    else
        contentCountdown.textContent = number;
}

export {
    countdown,
    setup_start_game
};
