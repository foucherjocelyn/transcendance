const { webSocket } = require("../webSocket/webSocket");
const { update_match } = require("./updateMatch");

class formMatch
{
    constructor() {
        this.admin = undefined,
            this.id = undefined,
            this.mode = undefined,
            this.listUser = [],
            this.listPlayer = [],
            this.listInvite = [],
            this.result = [],
            this.timeStart = undefined,
            this.timeStop = undefined,
            this.dateStart = undefined,
            this.dateStop = undefined
    }
};

class   inforPlayer {
    constructor(id, name, avatar, level, type) {
        this.status = false,
        this.id = id,
        this.name = name,
        this.avatar = avatar,
        this.level = level,
        this.type = type,
        this.score = 0,
        this.paddle = undefined
    }
};

function    create_match_ID()
{
    const now = new Date();
    
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    const dateTimeStr = `${day}${month}${year}${hour}${minute}${second}`;
    return dateTimeStr;
}

function    define_user(socket)
{
    for (let i = 0; i < webSocket.listConnection.length; i++)
    {
        const   connection = webSocket.listConnection[i];
        if (connection.socket === socket)
            return connection.user;
    }
    return undefined;
}

function    create_match(user, mode)
{
    if (mode !== 'ranked' && mode !== 'with friends' && mode !== 'offline')
        return ;

    const   match = new formMatch();
    match.id = create_match_ID();
    match.mode = mode;
    match.admin = user;

    for (let i = 0; i < 4; i++)
    {
        const   player = (i === 0) ?
        new inforPlayer(user.id, user.username, user.avatarPath, user.level, 'player') :
        new inforPlayer('', '', "../../img/avatar/addPlayerButton.png", 42, 'none');

        match.listPlayer.push(player);
    }

    user.matchID = match.id;
    user.status = 'creating match';

    webSocket.listMatch.push(match);
    update_match(user);
}

module.exports = {
    create_match,
    define_user,
    inforPlayer
};
