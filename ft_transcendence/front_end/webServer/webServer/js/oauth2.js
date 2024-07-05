const axios = require("axios");
const { create_request } = require('./createRequest.js');
const cookie = require('cookie');

async function retrieveCodeCreateAccount(req, res) {
    var query = require("url").parse(req.url, true).query;
    console.log("voici le nom de domaine: " + req.headers.host);
    const connect_ip = process.env.WEBSERVER_IP + ":5500";
    const config_42 = {
        "grant_type": "authorization_code",
        "client_id": process.env.FOURTWO_CLIENT_ID,
        "client_secret": process.env.FOURTWO_CLIENT_SECRET,
        "code": query.code,
        "redirect_uri": `https://${connect_ip}/`
    };
    let token42 = await request42Token(config_42);
    let token42_obj = {
        "token42": token42
    };
    let info = await create_request("POST", "/api/v1/auth/login42", token42_obj);
    let token42_to_client = info.access;
    const params = new URLSearchParams(req.url.slice(1));
    params.delete("code");

    req.url = `https://${connect_ip}/`;
    console.log(req.url);
    res.writeHead(301, {
        'Location': req.url,
        'Set-Cookie': cookie.serialize('token', token42_to_client, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: false,
            secure: true,
            sameSite: 'Lax'
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