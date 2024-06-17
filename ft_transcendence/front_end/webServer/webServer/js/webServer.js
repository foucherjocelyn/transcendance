const https = require("https");
const fs = require('fs').promises;
const path = require('path');

const getContentType = (filePath) => {
    const ext = path.extname(filePath);
    switch (ext) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
};

const config = {
    "grant_type": "authorization_code",
    "client_id": "u-s4t2ud-5a9d7a791c31267b140be75dcb88368fd21ecc552a388ba8a2a2e5320d82015d",
    "client_secret": process.env.FOURTWO_CLIENT_SECRET,
    "code": "",
    "redirect_uri": "https://127.0.0.1:5500/"
};

function request42Token() {
    var request = require('request');

    console.log(config);

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

// Request listener function for the HTTPS server
const requestListener = async function (req, res) {
    let filePath = '';
    let contentType = '';

    // where to use node
    __dirname = './';
    // console.log(req.url);
    // console.log('-----------------');

    if (req.url === '/') {
        filePath = path.join(__dirname, "./web/index.html");
    }
    else if (req.url.startsWith('/node_modules/')) {
        filePath = path.join(__dirname, req.url);
    }
    else if (req.url.startsWith('/?code')) {
        filePath = path.join(__dirname, "./web/index.html");
        console.log("requestListener code and token exec");
        var query = require("url").parse(req.url, true).query;
        config.code = query.code;
        console.log("code = " + config.code);
        request42Token();

        //const token = request42Token();
        //  let newdata = new dataToClient("connection_42", token, 'server');
        //newdata = JSON.stringify(newdata);
        //socket.send(newdata);
    }
    else {
        filePath = path.join(__dirname, `./web/${req.url}`);
    }

    contentType = getContentType(filePath);

    try {
        const contents = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(contents, 'utf8');
    } catch (err) {
        console.error(`Could not read file: ${filePath}`);
        res.writeHead(404);
        res.end('Not Found 404');
    }
};

// Load SSL certificates asynchronously
async function loadCertificates() {
    const key = await fs.readFile('./webServer/ssl/private.key');
    const cert = await fs.readFile('./webServer/ssl/certificate.crt');
    return { key, cert };
}

// Create the HTTPS server
async function startServer() {
    const options = await loadCertificates();
    const server = https.createServer(options, requestListener);

    // Specify the port for the server to listen on
    const PORT = process.env.PORT || 5500;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();