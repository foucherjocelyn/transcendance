const axios = require("axios");
const { create_request } = require('./createRequest.js');
const cookie = require('cookie');

async function retrieveCodeCreateAccount(req, res) {
    var query = require("url").parse(req.url, true).query;
    const config_42 = {
        "grant_type": "authorization_code",
        "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
        "client_secret": process.env.FOURTWO_CLIENT_SECRET,
        "code": query.code,
        "redirect_uri": "https://127.0.0.1:5500/"
    };
    let token42 = await request42Token(config_42);
    let token42_obj = {
        "token42": token42
    };
    let info = await create_request("POST", "/api/v1/auth/login42", token42_obj);
    let token42_to_client = info.access;
    const params = new URLSearchParams(req.url.slice(1));
    params.delete("code");

    req.url = "https://127.0.0.1:5500/";
    console.log(req.url);
    res.writeHead(301, {
        'Location': req.url,
        'Set-Cookie': cookie.serialize('token', token42_to_client, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: false,
            secure: true,
            sameSite: 'strict'
        }),
        'Content-Type': "application/json"
    });
    res.end();
}

async function request42Token(config_42) {
    console.log("starting request42token-------------");
    let response_request = await axios.post('https://api.intra.42.fr/oauth/token', config_42,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (response.status === 200) {
                return (response.data.access_token);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    return (response_request);
}

module.exports = {
    retrieveCodeCreateAccount
};