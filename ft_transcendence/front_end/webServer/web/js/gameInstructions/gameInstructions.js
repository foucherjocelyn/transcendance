import { screen } from "../screen/screen.js";
import { match } from "../createMatch/createMatch.js";
import { pongGame } from "../client/client.js";

function    setup_size_game_instructions_layer()
{
    const   gameInstructionsLayer = document.getElementById('gameInstructionsLayer');
    gameInstructionsLayer.style.height = `${screen.height - 160}px`;
    gameInstructionsLayer.style.width = `${screen.width / 4}px`;
}

function    create_button_introduction(contentButton, position)
{
    const spanInsideButton = document.createElement('span');
    spanInsideButton.textContent = contentButton;
    
    const buttonElement = document.createElement('button');
    buttonElement.appendChild(spanInsideButton);
    
    const spanElement = document.createElement('span');
    spanElement.textContent = position;
    
    const divElement = document.createElement('div');
    divElement.appendChild(buttonElement);
    divElement.appendChild(spanElement);

    return divElement;
}

function    create_paddle_introduction(paddle)
{
    const spanInsideDiv = document.createElement('span');
    spanInsideDiv.textContent = paddle.name;

    const divInsidePaddle = document.createElement('div');
    divInsidePaddle.style.backgroundColor = paddle.color;
    divInsidePaddle.appendChild(spanInsideDiv);

    const paddleIntroduction = document.createElement('div');
    paddleIntroduction.className = 'paddleIntroduction';
    paddleIntroduction.appendChild(divInsidePaddle);

    return paddleIntroduction;
}

function    create_player_introduction(paddle)
{
    const   buttonLeft = create_button_introduction(paddle.control.left, 'Left');
    const   buttonRight = create_button_introduction(paddle.control.right, 'Right');

    const   buttonIntroduction = document.createElement('buttonIntroduction');
    buttonIntroduction.className = 'buttonIntroduction';

    buttonIntroduction.appendChild(buttonLeft);
    buttonIntroduction.appendChild(buttonRight);

    const   paddleIntroduction = create_paddle_introduction(paddle);

    const   playerIntroduction = document.createElement('div');
    playerIntroduction.className = 'playerIntroduction';

    playerIntroduction.appendChild(paddleIntroduction);
    playerIntroduction.appendChild(buttonIntroduction);

    return playerIntroduction;
}

function    setup_game_instructions()
{
    document.getElementById('gameInstructionsLayer').style.display = 'flex';

    setup_size_game_instructions_layer();

    const   gameInstructionsPanel = document.getElementById('gameInstructionsPanel');

    for (let i = 0; i < match.listPlayer.length; i++)
    {
        const   player = match.listPlayer[i];
        if (player.type !== 'none')
        {
            const       paddle = pongGame.listPaddle[i];
            if (paddle !== null) {
                const   playerIntroduction = create_player_introduction(paddle);
                gameInstructionsPanel.appendChild(playerIntroduction);
            }
        }
    }
}

export {
    setup_game_instructions
};
