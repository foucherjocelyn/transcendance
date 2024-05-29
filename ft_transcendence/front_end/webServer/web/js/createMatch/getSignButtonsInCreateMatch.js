import { match } from "./createMatch.js";
import { client, dataToServer } from "../client/client.js";
import { to_game } from "../home/home_game.js";

function    get_sign_cancel_create_match_button()
{
    const   button = document.getElementById('cancelCreateMatchButton');

    button.onclick = () => {
        const  sendData = new dataToServer('leave match', match, client.inforUser, 'socket server');
        client.socket.send(JSON.stringify(sendData));

        to_game();
    }
}

function    get_sign_start_create_match_button()
{
    const   button = document.getElementById('startCreateMatchButton');
    button.onclick = () => {
        const  sendData = new dataToServer('start game', match, client.inforUser, 'socket server');
        client.socket.send(JSON.stringify(sendData));
    }
}

function    get_sign_add_player_button()
{
    const   buttons = document.querySelectorAll('#addPlayerLayer > button')

    for (let i = 1; i < buttons.length; i++)
    {
        buttons[i].onclick = () => {
            if (match.mode === 'tournament')
                return ;

            const sendData = new dataToServer('add player', i, client.inforUser, 'socket server');
            client.socket.send(JSON.stringify(sendData));
        }
    }
}

export function    get_signe_buttons_in_create_match()
{
    get_sign_cancel_create_match_button();
    get_sign_start_create_match_button();
    get_sign_add_player_button();
}
