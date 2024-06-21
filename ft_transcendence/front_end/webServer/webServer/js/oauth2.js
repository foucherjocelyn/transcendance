const axios = require("axios");
const { create_request } = require('./createRequest.js');
const { requestListener } = require("./webServer.js");

async function retrieveCodeCreateAccount(req, res) {
    var query = require("url").parse(req.url, true).query;
    const config_42 = {
        "grant_type": "authorization_code",
        "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
        "client_secret": process.env.FOURTWO_CLIENT_SECRET,
        "code": query.code,
        "redirect_uri": "https://127.0.0.1:5500/"
    };
    //console.log(config_42);
    let token42 = await request42Token(config_42);
    let token42_obj = {
        "token42": token42
    };
    //console.log("the retrieved token = ");
    //console.log(token42_obj);
    let info = await create_request("POST", "/api/v1/auth/login42", token42_obj);
    //console.log("here is the info");
    //console.log(info);
    let token42_to_client = info.access;
    //console.log(req);
    const params = new URLSearchParams(req.url.slice(1));
    //console.log(params);
    params.delete("code");
    //console.log(params);
    req.url = "/?token=" + token42_to_client;
    console.log(req.url);
    res.writeHead(301, {
        'Location': req.url,
        'Content-Type': "text/html"// Utilisez req.url pour spécifier la nouvelle URL
    });
    res.end();
    //requestListener(req, res);
    //changer l'url avec token42
    //const send_data = new dataToServer('connection_42', token42_to_client, 'socket server');
    //client.socket.send(JSON.stringify(send_data));
    //retrieveToken42(token42_to_client);
    /*
    response.writeHead(301, {
        Location: "https://google.com/"
      });
    */
    //app.get('/json', (req, res) => {
    //  res.json({ message: 'Hello, this is a JSON response!', status: 'success' });
    //});
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
            //console.log("then request42Token------");
            //console.log(response.status);
            if (response.status === 200) {
                //console.log("response is good, info here: ");
                //console.log(response);
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