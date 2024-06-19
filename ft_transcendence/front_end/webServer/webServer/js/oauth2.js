var request = require('request');

const config = {
    "grant_type": "authorization_code",
    "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
    "client_secret": process.env.FOURTWO_CLIENT_SECRET,
    "code": "",
    "redirect_uri": "https://127.0.0.1:5500/"
};

async function retrieveCodeCreateAccount(req) {
 //   console.log("retrieveCodeCreateAccount code and token exec");
        var query = require("url").parse(req.url, true).query;
        config.code = query.code;
        //console.log("code = " + config.code);
        let token42 = await request42Token()
        let token42_obj = {
          "token42": token42
        };
        console.log("the retrieved token = ");
        console.log(token42_obj);
        createAccount42Api(token42_obj);

        //const token = request42Token();
        //  let newdata = new dataToClient("connection_42", token, 'server');
        //newdata = JSON.stringify(newdata);
        //socket.send(newdata);
}

function request42Token() {
    return new Promise((resolve, reject) => {
        //console.log("starting request42token-------------");
        request.post(
            'https://api.intra.42.fr/oauth/token',
            { json: config },
            function (error, response, body) {
                //console.log("request42Token status code >>>>>>>>>>>>>>>>>>>>>>>>>>>");
                if (error) {
                    return reject(error);
                }
                if (response.statusCode === 200) {
                    //console.log(body);
                    resolve(body.access_token);
                } else {
                    reject(new Error(`Unexpected status code: ${response.statusCode}`));
                }
            }
        );
    });
}

function	createAccount42Api(token42_obj)
{
    console.log("createAccount42Api");
    request.post(
        //First parameter API to make post request
        'https://127.0.0.1:8000/api/v1/auth/login42',

        //Second parameter DATA which has to be sent to API
        { json: token42_obj },

        //Third parameter Callback function  
        function (error, response, body) {
            console.log("createAccount42Api status code >>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log(response);
            if (!error && response.statusCode == 200) {
                console.log("SUCCESS-------");
                console.log(body);
            }
            //console.log(response.statusCode);
            //return (response.data);
        }
    );  
}

module.exports = {
    retrieveCodeCreateAccount,
    config,
    request42Token,
    createAccount42Api
};