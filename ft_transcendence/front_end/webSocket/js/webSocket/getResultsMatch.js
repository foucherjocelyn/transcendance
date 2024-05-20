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

function    get_time()
{
    const   dataTime = new Date();
    const   currentTime = new pTime();

    currentTime.hour = dataTime.getHours();
    currentTime.minute = dataTime.getMinutes();
    currentTime.second = dataTime.getSeconds();

    return currentTime;
}

class   pDate {
    constructor() {
        this.day = undefined,
        this.month = undefined,
        this.year = undefined
    }
};

function    get_date()
{
    const   dataDate = new Date();
    const   currentDate = new pDate();

    currentDate.day = dataDate.getDate();
    currentDate.month = dataDate.getMonth() + 1;
    currentDate.year = dataDate.getFullYear();

    return currentDate;
}

function    informations_match_start(data, match)
{
    // match.timeStart = get_time();
    // match.dateStart = get_date();
    
    const   websocket_token = process.env.WEBSOCKET_TOKEN;
    console.log(websocket_token);

    // fetch('/api/v1/game', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${websocket_token}`
    //     },
    //     body: JSON.stringify({
    //         owner_username: string,
    //         visibility: "public";
    //         mode: "classic" | "ranked" | "tournament";// optional, default: 'classic'
    //         tournament_name: string;// optional
    //         maxScore: number;// optional
    //         status: "progressing" | "end";// optional
    //     })
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok ' + response.statusText);
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     console.log('Success:', data);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

    update_match(data.from, match, 'update match');
    if (match.mode !== 'rank' && match.mode !== 'tournament')
        send_data(data.title, data.content, data.from, match.listUser);
}

function    informations_match_end(user, inforMatch)
{
    let indexMatch = define_match(user);
    if (indexMatch === undefined)
        return false;

    webSocket.listMatch[indexMatch] = inforMatch;
    const   match = webSocket.listMatch[indexMatch];

    // match.timeStop = get_time();
    // match.dateStop = get_date();
    // console.table(match.result);
}

module.exports = {
    informations_match_start,
    informations_match_end
};
