const https = require("https");
const fs = require('fs').promises;
const path = require('path');
const { retrieveCodeCreateAccount } = require("./oauth2.js");
const { URLSearchParams } = require("url");

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
        await retrieveCodeCreateAccount(req, res);
    }
    else if (req.url.startsWith('/?login42')) {
        filePath = path.join(__dirname, "./web/index.html");
    }
    else if (req.url.startsWith('/?')) {
        filePath = path.join(__dirname, "./web/index.html");
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

module.exports = {
    requestListener
};