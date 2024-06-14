require('dotenv').config();

const config = {
  client_id: process.env.FOURTWO_CLIENT_ID,
  client_secret: process.env.FOURTWO_CLIENT_SECRET
};

const oauth2 = require('simple-oauth2').create(credentials);
//const tokenConfig = {};

export async function request42Login() {
	try {
		const response = await fetch(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.FOURTWO_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response}`, {
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

module.exports = {
    requestOauth2
};
*/