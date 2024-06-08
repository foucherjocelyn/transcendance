const { create_request } = require("./createRequest");

function    createPostData(admin, modeMatch)
{
    const   postData = {
        owner_username: `${admin}`,
        visibility: "public",
        mode: `${modeMatch}`,
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
    const modeMatch = (match.mode === 'offline' || match.mode === 'with friends') ? 'classic' : match.mode;

    if (path === '/api/v1/game')
    {
        // create game
        console.table('------> create match: ' + match.admin.name);
        const   postData = createPostData(match.admin.name, modeMatch);
        const   responseDB = JSON.parse(await create_request('POST', path, postData));
        match.id = responseDB.id;
    }
    else if (path === `/api/v1/game/${match.id}/player/add`)
    {
        // add player
        console.table('------> add player: ' + player.name);
        const   postData = createPostData2(player.name);
        await create_request('POST', path, postData);
    }
    else if (path === `/api/v1/game/${match.id}/score`)
    {
        // add score
        console.table('------> add score: ' + player.name + ' score: ' + player.score);
        const postData = createPostData3(player.name, player.score);
        await create_request('POST', path, postData);
    }
    else
    {
        // end game
        console.table('------> winner: ' + player.name);
        await create_request('POST', path, '');
        await create_request('POST', `/api/v1/game/${match.id}/winner`, '');
        await create_request('POST', `/api/v1/game/${match.id}/winner/levelup`, '');
    }
}

module.exports = {
    request_game_DB
};
