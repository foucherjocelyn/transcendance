import { client, dataToServer, pongGame } from "../client/client.js";
import { create_match, match } from "../createMatch/createMatch.js";
import { to_game } from "../home/game/home_game.js";
import { gameOverHTML } from "../home/game/home_gamewindows.js";
import { to_tournament } from "../home/tournament/home_tournament.js";
import { renderTournamentTree } from "../home/tournament/tournamentTree/tournamentTree.js";
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
            span.textContent = player.paddle;
        else
            span.textContent = player.score;
        spans.push(span);
    }

    spans.forEach(span => {
        resultBar.appendChild(span);
    });

    return resultBar;
}

function    display_results_match(result)
{
    for (let i = 0; i < result.length; i++)
    {
        const   player = result[i];
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

export function    display_button_game_over(status)
{
    const   button = document.querySelectorAll('#buttonsGameOver > div > button')[0];
    button.style.display = status;
}

function    get_sign_buttons_game_over_layer()
{
    const   button = document.querySelectorAll('#buttonsGameOver > div > button');

    console.log("get_sign_buttons_game_over_layer: button = ");
    console.log(button);
    // exit button
    button[0].onclick = () => {
        const  sendData = new dataToServer('leave match', '', 'socket server');
        client.socket.send(JSON.stringify(sendData));
        if (match.mode === 'tournament')
            to_tournament();
        else
            to_game();
    }
    
    if (match.mode === 'tournament') {
        button[1].style.display = 'none';
        button[2].style.display = 'flex';
        button[2].onclick = () => {
            const tour_html = `<div id="tournament_tree"></div>`;
            document.getElementById("resultsMatchPanel").insertAdjacentHTML("beforeend", tour_html);
            console.log(pongGame.tournamentID);
            renderTournamentTree(pongGame.tournamentID);
        }
        return ;
    }

    // play again button
    button[1].onclick = () => {
        const   mode = match.mode;
        const  sendData = new dataToServer('leave match', '', 'socket server');
        client.socket.send(JSON.stringify(sendData));
        create_match(mode);
    }
}

export function    display_game_over_layer(result)
{
    gameOverHTML();
    setup_size_game_over_layer();
    display_results_match(result);
    get_sign_buttons_game_over_layer();
}


