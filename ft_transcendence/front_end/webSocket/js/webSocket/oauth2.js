// need to get token from code and send to backend

function getAuthCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const auth_code = params.get('code');
	console.log("the generated code is : " + auth_code);
	return(auth_code);
}

const config = {
    "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
    "client_secret": process.env.FOURTWO_CLIENT_SECRET,
    "code": "",
    "redirect_uri": "https://127.0.0.1:5500/#homepage"
};

async function request42Token() {
    const query = new URLSearchParams(config).toString();
    try {
        const response = await fetch(`https://api.intra.42.fr/oauth/token`, {
            method: "POST",
            body: JSON.stringify(config),
            headers: {
				"Accept": "application/json",
				"Content-type": "application/json; charset=UTF-8",
			}
        })
		console.log("request42Login status =");
		console.log(response.status);
        if (!response.ok) {
            console.log("request42Login: Client/Server error");
            return;
        }
        const data = await response.json();
        //console.log("request42Login:");
        //console.log(data);
        //return (data);
    } catch (error) {
        console.error("request42Login: ", error);
    }
}


/*
const config = {
    "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
    "redirect_uri": "https://localhost:5500/#homepage",
    "response_type": "token",
    "scope": "",
    "state": "pass-through-value"
};

async function request42Login() {
    const query = new URLSearchParams(config).toString();
    try {
        //const response = await fetch(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.FOURTWO_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response}`, {
        const response = await fetch(`https://api.intra.42.fr/oauth/authorize?${query}`, {
            method: "GET"
        })
        if (!response.ok) {
            console.log("request42Login: Client/Server error");
            return;
        }
        const data = await response.json();
        //console.log("request42Login:");
        //console.log(data);
        //return (data);
    } catch (error) {
        console.error("request42Login: ", error);
    }
}
*/
/*
const credentials = {
    client: {
        id: '',
        secret: '',
    },
    auth: {
        tokenHost: 'https://api.intra.42.fr/oauth/token'
    }
};

function requestOauth2() {
    //oauth2.create(credentials);
    oauth2.clientCredentials.getToken(tokenConfig, (error, result) => {
      if (error) {
        return console.log('Access Token Error', error.message);
      }
     
      const token = oauth2.accessToken.create(result);
    });
}
*/

/*
// Authorization oauth2 URI
const authorizationUri = oauth2.authorizationCode.authorizeURL({
 redirect_uri: 'http://localhost:5500/callback',
 scope: '<scope>',
 state: '<state>'
});
 
// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
res.redirect(authorizationUri);
 
// Get the access token object (the authorization code is given from the previous step).
const tokenConfig = {
 code: '<code>',
 redirect_uri: 'http://localhost:3000/callback'
};
 
// Callbacks
// Save the access token
oauth2.authorizationCode.getToken(tokenConfig, (error, result) => {
 if (error) {
   return console.log('Access Token Error', error.message);
 }
 
 const token = oauth2.accessToken.create(result);
});
 
// Promises
// Save the access token
oauth2.authorizationCode.getToken(tokenConfig)
.then((result) => {
 const token = oauth2.accessToken.create(result);
})
.catch((error) => {
 console.log('Access Token Error', error.message);
});

*/


module.exports = {
    request42Token
};