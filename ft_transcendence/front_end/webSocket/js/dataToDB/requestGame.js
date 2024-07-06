const { define_user_by_ID } = require("../webSocket/webSocket");
const { create_request } = require("./createRequest");

function    createPostData(admin, modeMatch, tournamentName)
{
    const   postData = {
        owner_username: `${admin}`,
        visibility: "public",
        mode: `${modeMatch}`,
        tournament_name: tournamentName,
        maxScore: 5,
        status: "progressing"
    };
    return postData;
}

function    createPostData2(userName)
{
    const   postData = {
        username: `${userName}`
    };
    return postData;
}

function    createPostData3(userName, userScore)
{
    const   postData = {
        username: `${userName}`,
	    score: `${userScore}`,
    };
    return postData;
}

async function  request_game_DB(path, match, player)
{
    if (match.mode === 'offline' || player === undefined) {
        return ;
    }

    const   user = define_user_by_ID(player.id);
    const   modeMatch = (match.mode === 'with friends') ? 'classic' : match.mode;
    let responseDB;

    if (path === '/api/v1/game')
    {
        // create game
        // console.table('------> create match: ' + match.admin.name);
        const   admin = define_user_by_ID(match.listUser[0].id);
        const   postData = createPostData(admin.username, modeMatch, match.tournamentName);
        responseDB = await create_request('POST', path, postData);
        // if (!responseDB) {
        //     return ;
        //}
        match.id = responseDB.id;
    }
    else if (path === `/api/v1/game/${match.id}/player/add`)
    {
        // add player
        // console.table('------> add player: ' + user.username);
        const   postData = createPostData2(user.username);
        responseDB = await create_request('POST', path, postData);
        // if (!responseDB)
        //     return ;
    }
    else if (path === `/api/v1/game/${match.id}/score`)
    {
        // add score
        // console.table('------> add score: ' + user.username + ' score: ' + player.score);
        const postData = createPostData3(user.username, player.score);
        let responseDB = await create_request('POST', path, postData);
        // if (!responseDB)
        //     return ;
    }
    else
    {
        // end game
        // console.table('------> winner: ' + user.username);
        responseDB = await create_request('POST', path, '');
        // if (!responseDB)
        //     return ;
        responseDB = await create_request('POST', `/api/v1/game/${match.id}/winner`, { winner_username: match.winner.username });
        // if (!responseDB)
        //     return ;
        responseDB = await create_request('POST', `/api/v1/game/${match.id}/winner/levelup`, '');
        // if (!responseDB)
        //     return ;
    }
}

module.exports = {
    request_game_DB
};
