import { getAliasFromUsername } from "../../../backend_operation/alias.js";
import { getTournamentInfoById, getTournamentsGames } from "../../../backend_operation/tournament.js";

export function update_tournament_tree(tournamentId)
{
    console.log('tournament ID: ' + tournamentId);
    const tour_html = `<div id="tournament_tree"></div>`;
    const end_screen = document.getElementById("resultsMatchPanel");
    if (end_screen) {
        console.log("end_screen is true------------------");
        end_screen.insertAdjacentHTML("beforeend", tour_html);
    }
    renderTournamentTree(tournamentId);
}

export const renderTournamentTree = async (tournamentId) => {
    const tournamentTree = document.getElementById("tournament_tree")
    if (!tournamentTree)
        return;
    tournamentTree.innerHTML = `
    <div class="bracket" id="bracket">
    </div>`;

    const tournament = await getTournamentInfoById(tournamentId);
    const participants = tournament.ordered_players_usernames;
    if (!participants)
        return;
    const participantAliasesMap = await Promise.all(participants.map(async username => {
        const alias = await getAliasFromUsername(username);
        return {username: username, alias: alias};
    }));
    createBracket(participants, participantAliasesMap);
    const numberOfPlayers = participants.length;
    const tournamentGames = await getTournamentsGames(tournamentId);
    const tournamentGamesEnded = tournamentGames.filter(game => game.status === "end");
    let currentRound = 1;
    let numberOfMatchesInCurrentRound = Math.floor(numberOfPlayers / 2);
    let currentMatch = 1;
    for (let i = 0; i < tournamentGamesEnded.length; i++) {
        updateBracket(currentRound, currentMatch, participantAliasesMap.find(participant => participant.username === tournamentGamesEnded[i].winner_username).alias);
        currentMatch++;
        if (currentMatch > numberOfMatchesInCurrentRound) {
            currentRound++;
            numberOfMatchesInCurrentRound = Math.floor(numberOfMatchesInCurrentRound / 2);
            currentMatch = 1;
        }
    }
}


function createBracket(participants, participantAliasesMap) {
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
                        <div class="match-top team"><span class="name">${participantAliasesMap.find(participant => participant.username === currentRoundParticipants[i])?.alias || currentRoundParticipants[i]}</span></div>
                        <div class="match-bottom team"><span class="name">${participantAliasesMap.find(participant => participant.username === currentRoundParticipants[i + 1])?.alias || currentRoundParticipants[i + 1]}</span></div>
                        <div class="match-lines">
                            <div class="line one"></div>
                            <div class="line two"></div>
                        </div>
                        <div class="match-lines alt">
                            <div class="line one"></div>
                        </div>
                    `;
                nextRoundParticipants.push('');
            } else {
                if (round === 1) {
                    matchDiv.classList.add("winner-top");
                    matchDiv.innerHTML = `
                    <div class="team match-top"><span class="name">${participantAliasesMap.find(participant => participant.username === currentRoundParticipants[i])?.alias || currentRoundParticipants[i]}</span></div>
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
    if (matchDiv)
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
