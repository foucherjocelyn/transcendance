const axios = require("axios");
const https = require("https");

function configureRequest(method, path, data)//, websocket_token)
{
    let config = {
        method: method,
        url: `https://backend:8000${path}`,
        headers: {
            "Content-Type": "application/json"//,
           // Authorization: `Bearer ${websocket_token}`,
        },
        data: JSON.stringify(data),
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };
    return config;
}

function sendRequest(config)
{
    return new Promise((resolve, reject) => {
        axios.request(config)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function create_request(method, path, postData)
{
    //const websocket_token = process.env.WEBSOCKET_TOKEN;
    let config = configureRequest(method, path, postData);//, websocket_token);

    try {
        const responseDB = await sendRequest(config);
        // console.table(responseDB);
        return responseDB;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    create_request
};
