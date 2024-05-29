export const renderTournamentTree = () => {
    document.getElementById("tournament_tree").innerHTML = `
    <div class="bracket" id="bracket">
    </div>`;
    const participants = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8"
        /*"Player 9", "Player 10", "Player 11", "Player 12", "Player 13", "Player 14", "Player 15", "Player 16"*/
    ]; // Example participants

    createBracket(participants);
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
                matchDiv.innerHTML = `<div>${currentRoundParticipants[i]}</div><div>Bye</div>`;
                nextRoundParticipants.push(currentRoundParticipants[i]);
            }

            roundDiv.appendChild(matchDiv);
        }

        bracketContainer.appendChild(roundDiv);
        currentRoundParticipants = nextRoundParticipants;
    }

}

function updateBracket(matchId, winner) {
    const [round, match] = matchId.split('-').map(Number);
    const nextRound = document.getElementById(`round${round + 1}`);
    const nextMatch = nextRound ? nextRound.querySelector(`#match${round + 1}-${Math.ceil(match / 2)}`) : null;
    if (nextMatch) {
        const divs = nextMatch.querySelectorAll('div');
        if (divs[0].textContent === 'Winner 1' || divs[0].textContent === 'Winner 2' || divs[0].textContent === '') {
            divs[0].textContent = winner;
        } else {
            divs[1].textContent = winner;
        }
    }
}
