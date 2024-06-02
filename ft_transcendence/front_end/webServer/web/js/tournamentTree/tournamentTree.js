export const renderTournamentTree = (tournament) => {
    document.getElementById("tournament_tree").innerHTML = `
    <div class="bracket" id="bracket">
    </div>`;
    const participants = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"/*, "Player 6", "Player 7", "Player 8"
        /*"Player 9", "Player 10", "Player 11", "Player 12", "Player 13", "Player 14", "Player 15", "Player 16"*/
    ]; // Example participants

    createBracket(participants);
    //createBracket(tournament.player_usernames);
    updateBracket(1, 1, "Player 1");
    updateBracket(1, 2, "Player 4");
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
                matchDiv.innerHTML = `
                <div class="team match-bye"><span class="name">${currentRoundParticipants[i]}</span></div>
                <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                </div>
                <div class="match-lines alt">
                    <div class="line one"></div>
                </div>`;
                nextRoundParticipants.push(currentRoundParticipants[i]);
            }

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
    if (document.getElementById(`round${round + 1}`)) {
        const nextMatch = Math.floor((match + 1) / 2);
        const playerNextPosition = match % 2 ? "top" : "bottom";
        const nextMatchDiv = document.getElementById(`match${round + 1}-${nextMatch}`);
        nextMatchDiv.querySelector(`.match-${playerNextPosition} .name`).innerText = winner;
    }
}
