let credentials = {
    client: {
        uid: "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
        secret: "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"
    },
    auth: {
        tokenHost: "https://api.intra.42.fr/oauth/token"
    }
};

const oauth2 = require('simple-oauth2').create(credentials);
const tokenConfig = {};

export function requestOauth2() {
    console.log("entered requestOauth2 successfuly");
    oauth2.clientCredentials.getToken(tokenConfig)
        .then((result) => {
            const token = oauth2.accessToken.create(result);
            return (token);
        })
        .catch((error) => {
            console.log('Access Token error', error.message);
        });
}