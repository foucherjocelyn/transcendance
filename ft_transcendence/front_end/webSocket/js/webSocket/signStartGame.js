const { matchmaking } = require("../matchmaking/matchmaking");
const { leave_match } = require("./acceptInvitationPlay");
const { send_data } = require("./dataToClient");
const { update_match, define_match } = require("./updateMatch");
const { webSocket } = require("./webSocket");

class   pTime {
    constructor() {
        this.hour = undefined,
        this.minute = undefined,
        this.second = undefined
    }
};

class   pDate {
    constructor() {
        this.day = undefined,
        this.month = undefined,
        this.year = undefined
    }
};

function    get_time()
{
    const   dataTime = new Date();
    const   currentTime = new pTime();

    currentTime.hour = dataTime.getHours();
    currentTime.minute = dataTime.getMinutes();
    currentTime.second = dataTime.getSeconds();

    return currentTime;
}

function    get_date()
{
    const   dataDate = new Date();
    const   currentDate = new pDate();

    currentDate.day = dataDate.getDate();
    currentDate.month = dataDate.getMonth() + 1;
    currentDate.year = dataDate.getFullYear();

    return currentDate;
}

function    informations_match_in_web_socket(match)
{
    console.log('--> match admin: ' + match.admin.id);
    console.log('--> match mode: ' + match.mode);

    console.log('--> match list User:');
    match.listUser.forEach(user => {
        console.log('[ ' + user.id + ' ]');
    });

    console.log('--> match list Players:');
    match.listPlayer.forEach(player => {
        console.log('[ ' + player.type + ' ]');
    });

    console.log('--> match time start: ' + match.timeStart.hour + ':' + match.timeStart.minute + ':' + match.timeStart.second);
    // console.log('--> match time end: ');
    
    console.log('--> match date start: ' + match.dateStart.day + '/' + match.dateStart.month + '/' + match.dateStart.year);
    
    // console.log('--> match : ');
    // this.lostPoint = false,
    // this.gameOver = false
}

function    arrange_player_positions(match)
{
    const   listPlayer = [];
    for (let i = 0; i < match.listPlayer.length; i++)
    {
        for (let j = 0; j < match.listPlayer.length; j++)
        {
            const   player = match.listPlayer[j];
            if (i === 0 && player.type === 'player')
                listPlayer.push(player);
            else if (i === 1 && player.type === 'AI')
                listPlayer.push(player);
            else if (i === 2 && player.type === 'none')
                listPlayer.push(player);
        }
    }
    match.listPlayer = listPlayer;
}

function    setup_time_to_match(data, match)
{
    match.timeStart = get_time();
    match.dateStart = get_date();

    update_match(data.from, match, 'update match');
    send_data(data.title, data.content, data.from, match.listUser);
    // informations_match_in_web_socket(match);
}

function    sign_start_game(data)
{
    let indexMatch = define_match(data.from);
    if (indexMatch === undefined)
        return;

    const   match = webSocket.listMatch[indexMatch];
    arrange_player_positions(match);
    
    if (match.mode !== 'rank')
    {
        setup_time_to_match(data, match);
    }
    else
    {
        matchmaking(match, (result) => {
            if (!result)
                return ;
            
            for (let i = 1; i < match.listPlayer.length; i++)
            {
                const   player = match.listPlayer[i];
                if (player.type === 'player')
                    leave_match(player);
            }
            setup_time_to_match(data, match);
        })
    }
}

module.exports = {
    sign_start_game
};
