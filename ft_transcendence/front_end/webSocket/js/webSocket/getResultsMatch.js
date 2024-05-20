const { send_data } = require("./dataToClient");
const { update_match } = require("./updateMatch");

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
    match.timeStart = get_time();
    match.dateStart = get_date();

    update_match(data.from, match, 'update match');
    if (match.mode !== 'rank' && match.mode !== 'tournament')
        send_data(data.title, data.content, data.from, match.listUser);
}

module.exports = {
    informations_match_start
};
