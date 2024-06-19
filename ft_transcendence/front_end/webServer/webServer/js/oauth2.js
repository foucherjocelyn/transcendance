const config = {
    "grant_type": "authorization_code",
    "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
    "client_secret": process.env.FOURTWO_CLIENT_SECRET,
    "code": "",
    "redirect_uri": "https://127.0.0.1:5500/"
};

async function retrieveCodeCreateAccount(req) {
    console.log("retrieveCodeCreateAccount code and token exec");
        var query = require("url").parse(req.url, true).query;
        config.code = query.code;
        //console.log("code = " + config.code);
        let token42 = await request42Token()
        let token42_obj = {
            "token42": token42.access_token
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
    var request = require('request');

    //console.log(config);
    console.log("starting request42token-------------");
    request.post(
        //First parameter API to make post request
        'https://api.intra.42.fr/oauth/token',

        //Second parameter DATA which has to be sent to API
        //JSON.stringify(config),
        { json: config },

        //Third parameter Callback function  
        function (error, response, body) {
            console.log("request42Token status code =");
            console.log(response.statusCode);
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
            console.log("request42Token result ==================");
            console.log(body);
            return (response.data);
        }
    );
}

function	createAccount42Api(token42)
{
    console.log(createAccount42Api);
    var request = require('request');

    //console.log(config);

    request.post(
        //First parameter API to make post request
        'https://localhost:8000/api/v1/auth/login42',

        //Second parameter DATA which has to be sent to API
        //JSON.stringify(config),
        { json: token42 },

        //Third parameter Callback function  
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
            console.log(body);
            //console.log(response.statusCode);
            //return (response.data);
        }
    );
    /*
	console.log("-Creating account with 42 token");
	try {
		const response = await fetch("https://localhost:8000/api/v1/auth/login42", {
			method: "POST",
			body: JSON.stringify(token42),
			headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
			}
		});
		if (!response.ok) {
//			document.cookie = `token=; SameSite=Strict`;
			console.log("createAccount42Api: Client or Server error");
			throw new Error("fetch POST createAccount42Api");
		}
		const data = await response.json();
		console.log("createAccount42Api data = ");
		console.log(data);
		//console.log("New token generated:\n" + data.access);
		//document.cookie = `token=; SameSite=Strict`;
		//document.cookie = `token=${data.access}; SameSite=Strict`;
	} catch (error) {
		console.error("createAccount42Api: ", error);
	}
        */
}

module.exports = {
    retrieveCodeCreateAccount,
    config,
    request42Token,
    createAccount42Api
};