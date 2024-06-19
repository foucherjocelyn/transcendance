const config = {
    "grant_type": "authorization_code",
    "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
    "client_secret": process.env.FOURTWO_CLIENT_SECRET,
    "code": "",
    "redirect_uri": "https://127.0.0.1:5500/"
};

function request42Token() {
    var request = require('request');

    //console.log(config);

    request.post(
        //First parameter API to make post request
        'https://api.intra.42.fr/oauth/token',

        //Second parameter DATA which has to be sent to API
        //JSON.stringify(config),
        { json: config},

        //Third parameter Callback function  
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
            console.log(body);
            console.log(response.statusCode);
            return (response.data);
        }
    );
}

module.exports = {
    config,
    request42Token
};