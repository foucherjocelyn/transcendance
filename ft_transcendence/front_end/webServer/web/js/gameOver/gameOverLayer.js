import { client, dataToServer } from "../client/client.js";
import { create_match, match } from "../createMatch/createMatch.js";
import { pongGame } from "../game/startGame.js";
import { to_game } from "../home/home_game.js";
import { gameOverHTML } from "../home/home_gamewindows.js";
import { screen } from "../screen/screen.js";

function    create_results_bar_html(player)
{
    const resultBar = document.createElement('div');
    resultBar.classList.add('resultBar');

    // display avatar
    const innerInnerDiv = document.createElement('div');
    innerInnerDiv.style.backgroundImage = `url("${player.avatar}")`;

    const innerDiv = document.createElement('div');
    innerDiv.appendChild(innerInnerDiv);
    resultBar.appendChild(innerDiv);

    const spans = [];
    for (let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        if (i === 0)
            span.textContent = player.id;
        else if (i === 1)
            span.textContent = player.name;
        else if (i === 2)
            span.textContent = player.paddle.name;
        else
            span.textContent = player.score;
        spans.push(span);
    }

    spans.forEach(span => {
        resultBar.appendChild(span);
    });

    return resultBar;
}

function    display_results_match()
{
    for (let i = 0; i < match.result.length; i++)
    {
        const   player = match.result[i];
        if (player.type !== 'none')
        {
            const   div = create_results_bar_html(player);
            document.getElementById('resultsMatchPanel').appendChild(div);
        }
    }
}

function    setup_size_game_over_layer()
{
    const   gameOverLayer = document.getElementById('gameOverLayer');
    gameOverLayer.style.height = `${screen.height}px`;
    gameOverLayer.style.width = `${screen.width}px`;
}

function    get_sign_buttons_game_over_layer()
{
    const   button = document.querySelectorAll('#buttonsGameOver > div > button');

    // exit button
    button[0].onclick = () => {
        client.inforUser.status = 'connection';
        const  sendData = new dataToServer('leave match', match, client.inforUser, match.listUser);
        client.socket.send(JSON.stringify(sendData));
        to_game();
    }
    
    // play again button
    button[1].onclick = () => {
        const   mode = match.mode;
        client.inforUser.status = 'connection';
        const  sendData = new dataToServer('leave match', match, client.inforUser, match.listUser);
        client.socket.send(JSON.stringify(sendData));
        create_match(mode);
    }
}

function    setup_game_over()
{
    gameOverHTML();
    setup_size_game_over_layer();
    display_results_match();
    get_sign_buttons_game_over_layer();
}

export {
    setup_game_over
};
