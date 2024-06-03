const { create_request } = require("./createRequest");

function    createPostData(admin, modeMatch)
{
    const   postData = JSON.stringify(
    {
        owner_username: `${admin}`,
        visibility: "public",
        mode: `${modeMatch}`,
        maxScore: 5,
        status: "progressing"
    });
    return postData;
}

function    createPostData2(userName)
{
    const   postData = JSON.stringify(
    {
        username: userName
    });
    return postData;
}

function    createPostData3(userName, userScore)
{
    const   postData = JSON.stringify(
    {
        username: userName,
	    score: userScore,
    });
    return postData;
}

function    send_to_DB(path, match, player)
{
    const   modeMatch = (match.mode === 'offline' || match.mode === 'with friends') ? 'classic' : match.mode;
    
    if (path === '/api/v1/game') // create game + add player
    {
        console.table('------> create match: ' + match.admin.name);
        let postData = createPostData(match.admin.name, modeMatch);
        create_request(path, postData);

        path = `/api/v1/game/${match.id}/player/add`;
        match.listPlayer.forEach(check => {
            if (check.type !== 'none')
            {
                console.table('------> add player: ' + check.name);
                postData = createPostData2(check.name);
                create_request(path, postData);
            }
        })
    }
    else if (path === `/api/v1/game/${match.id}/score`) // add score
    {
        console.table('------> add score: ' + player.name + ' score: ' + player.score);
        const   postData = createPostData3(player.name, player.score);
        create_request(path, postData);
    }
    else if (path === `/api/v1/game/${match.id}/player/remove`) // remove player
    {
        console.table('------> remove player: ' + player.name);
        const   postData = createPostData2(player.name);
        create_request(path, postData);
    }
    else {
        console.table('------> winner: ' + player.name);
        create_request(path, ''); // end game
        create_request(`/api/v1/game/${match.id}/winner`, ''); // update winner
        create_request(path, `/api/v1/game/${match.id}/winner/levelup`); // level up winner
    }
}

module.exports = {
    send_to_DB
};
