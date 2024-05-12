import { client, dataToServer } from "../client/client.js";
import { match, pMatch } from "./createMatch.js";

// export function    join_the_tournament()
// {
//     match = new pMatch();
//     match.mode = 'tournament';
//     match.admin = client.inforUser;

//     match.tournamentID = 42;

//     const player1 = new inforPlayer(client.inforUser.id, client.inforUser.name, client.inforUser.avatar, client.inforUser.level, 'player');
//     const player2 = new inforPlayer(42, 'Player 2', "../../img/avatar/avatar2.png", 42, 'player');
//     const player3 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');
//     const player4 = new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');

//     match.listPlayer.push(player1);
//     match.listPlayer.push(player2);
//     match.listPlayer.push(player3);
//     match.listPlayer.push(player4);

//     const  sendData = new dataToServer('start game', match, client.inforUser, match.listUser);
//     client.socket.send(JSON.stringify(sendData));
// }
