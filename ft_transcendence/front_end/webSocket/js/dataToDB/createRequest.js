const https = require("https");

function    createRequestOptions(websocket_token, path)
{
    return {
        method: "POST",
        hostname: "backend",
        port: 8000,
        path: `${path}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${websocket_token}`
        },
        maxRedirects: 20,
        agent: new https.Agent({
            rejectUnauthorized: false,
        }),
    };
}

function    sendRequest(options, postData)
{
    const req = https.request(options, function (res) {
        let chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    req.on("error", function (error) {
        console.error(`Problem with request: ${error.message}`);
    });

    if (postData !== '') {
        req.write(postData);
    }
    
    req.end();
}

function    create_request(path, postData)
{
    const   websocket_token = process.env.WEBSOCKET_TOKEN;
    const   options = createRequestOptions(websocket_token, path);
    
    sendRequest(options, postData);
}

module.exports = {
    create_request
};
