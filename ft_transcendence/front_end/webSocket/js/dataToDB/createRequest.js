const https = require("https");

function    createRequestOptions(websocket_token, method, path)
{
    return {
        method: method,
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

function sendRequest(options, postData)
{
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let chunks = [];

            res.on("data", (chunk) => {
                chunks.push(chunk);
            });

            res.on("end", () => {
                const responseDB = Buffer.concat(chunks).toString();
                resolve(responseDB);
            });

            res.on("error", (error) => {
                console.error(error);
                reject(error);
            });
        });

        req.on("error", (error) => {
            console.error(`Problem with request: ${error.message}`);
            reject(error);
        });

        if (postData !== '') {
            req.write(postData);
        }

        req.end();
    });
}

async function  create_request(method, path, postData)
{
    const   websocket_token = process.env.WEBSOCKET_TOKEN;
    const   options = createRequestOptions(websocket_token, method, path);

    const   responseDB = await sendRequest(options, postData);
    console.table(responseDB);
    return responseDB;
}

module.exports = {
    create_request
};
