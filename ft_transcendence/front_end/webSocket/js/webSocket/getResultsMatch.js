const { setup_game } = require("../game/setupGame");
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
    data.from.status = 'playing game';
    
    // match.timeStart = get_time();
    // match.dateStart = get_date();
    
    // const   websocket_token = process.env.WEBSOCKET_TOKEN;
    // console.log(websocket_token);

    update_match(data.from, match, 'update match');
    setup_game(data, match);
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
