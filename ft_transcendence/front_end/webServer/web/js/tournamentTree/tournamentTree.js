import { getTournamentsGames } from "../backend_operation/tournament.js";

export const renderTournamentTree = async (tournament) => {
    document.getElementById("tournament_tree").innerHTML = `
    <div class="bracket" id="bracket">
    </div>`;
    /*const participants = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8",
        "Player 9", "Player 10", "Player 11", "Player 12", "Player 13", "Player 14", "Player 15", "Player 16",
        "Player 17", "Player 18", "Player 19"/*, "Player 20", "Player 21", "Player 22", "Player 23", "Player 24",
        "Player 25", "Player 26", "Player 27", "Player 28", "Player 29", "Player 30", "Player 31", "Player 32"
    ]; // Example participants

    createBracket(participants);
    //createBracket(tournament.player_usernames);
    updateBracket(1, 1, "Player 1");
    updateBracket(1, 2, "Player 4");
    updateBracket(1, 3, "Player 5");
    updateBracket(1, 4, "Player 7");
    updateBracket(1, 5, "Player 10");
    updateBracket(1, 6, "Player 12");
    updateBracket(1, 7, "Player 13");
    updateBracket(1, 8, "Player 15");
    updateBracket(1, 9, "Player 17");

    updateBracket(2, 1, "Player 4");
    updateBracket(2, 2, "Player 5");
    updateBracket(2, 3, "Player 12");
    updateBracket(2, 4, "Player 13");
    updateBracket(2, 5, "Player 17");

    updateBracket(3, 1, "Player 4");
    updateBracket(3, 2, "Player 13");

    updateBracket(4, 1, "Player 13");

    updateBracket(5, 1, "Player 17");*/

    createBracket(tournament.player_usernames);
    const numberOfPlayers = tournament.player_usernames.length;
    const tournamentGames = await getTournamentsGames(tournament.id);
    const tournamentGamesEnded = tournamentGames.filter(game => game.status === "end");
    console.log(tournamentGames);
    let currentRound = 1;
    let numberOfMatchesInCurrentRound = Math.floor(numberOfPlayers / 2);
    let currentMatch = 1;
    for (let i = 0; i < tournamentGamesEnded.length; i++) {
        updateBracket(currentRound, currentMatch, tournamentGamesEnded[i].winner_username);
        currentMatch++;
        if (currentMatch === numberOfMatchesInCurrentRound) {
            currentRound++;
            let numberOfMatchesInCurrentRound = Math.floor(numberOfMatchesInCurrentRound / 2);
            currentMatch = 1;
        }
    }
}

function createBracket(participants) {
    const bracketContainer = document.getElementById('bracket');
    const totalRounds = Math.ceil(Math.log2(participants.length));
    let currentRoundParticipants = [...participants];

    for (let round = 1; round <= totalRounds; round++) {
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');
        roundDiv.id = `round${round}`;
        const nextRoundParticipants = [];
        let numberOfPlaceholderMatches = Math.floor((Math.pow(2, (totalRounds - round + 1)) - currentRoundParticipants.length) / 2);

        for (let i = 0; i < currentRoundParticipants.length; i += 2) {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.id = `match${round}-${Math.ceil(i / 2) + 1}`;

            if (i + 1 < currentRoundParticipants.length) {
                matchDiv.innerHTML = `
                        <div class="match-top team"><span class="name">${currentRoundParticipants[i]}</span></div>
                        <div class="match-bottom team"><span class="name">${currentRoundParticipants[i + 1]}</span></div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    `;
                matchDiv.addEventListener('click', () => {
                    const winner = prompt('Enter winner:', `${currentRoundParticipants[i]} or ${currentRoundParticipants[i + 1]}`);
                    if (winner) {
                        updateBracket(matchDiv.id, winner);
                    }
                });
                nextRoundParticipants.push('');
            } else {
                if (round === 1) {
                    matchDiv.classList.add("winner-top");
                    matchDiv.innerHTML = `
                    <div class="team match-top"><span class="name">${currentRoundParticipants[i]}</span></div>
                    <div class="match-lines">
                        <div class="line one"></div>
                        <div class="line two"></div>
                    </div>
                    <div class="match-lines alt">
                        <div class="line one"></div>
                    </div>`;
                } else {
                    matchDiv.innerHTML = `
                    <div class="match-bye"></div>
                    <div class="match-lines">
                        <div class="line one"></div>
                        <div class="line two"></div>
                    </div>
                    <div class="match-lines alt">
                        <div class="line one"></div>
                    </div>
                    `;
                }
                nextRoundParticipants.push(currentRoundParticipants[i]);
            }

            roundDiv.appendChild(matchDiv);
        }
        for (let i = 0; i < numberOfPlaceholderMatches; i++) {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.id = `match${round}-placeholder${i + 1}`;
            roundDiv.appendChild(matchDiv);
        }
        bracketContainer.appendChild(roundDiv);
        currentRoundParticipants = nextRoundParticipants;
    }

}

function updateBracket(round, match, winner) {
    const matchDiv = document.getElementById(`match${round}-${match}`);
    matchDiv.classList.add(`${matchDiv.querySelector(".match-top .name").innerText === winner ? "winner-top" : "winner-bottom"}`);
    //if there is a next round, put the winner in the match of the next round
    //if the next round is a bye put it in the next round again
    let nextRound = round + 1;
    while (document.getElementById(`round${nextRound}`)) {
        const nextMatch = Math.floor((match + 1) / 2);
        const playerNextPosition = match % 2 ? "top" : "bottom";
        const nextMatchDiv = document.getElementById(`match${nextRound}-${nextMatch}`);
        if (nextMatchDiv.querySelector(`.match-bye`)) {
            match = nextMatch;
            nextRound++;
        } else {
            nextMatchDiv.querySelector(`.match-${playerNextPosition} .name`).innerText = winner;
            break;
        }
    }
}
