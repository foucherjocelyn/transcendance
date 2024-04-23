const http = require("http");
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

// Request listener function for the HTTP server
const requestListener = async function (req, res) {
    let filePath = '';
    let contentType = '';

    // where to use node
    __dirname = './';
    // console.log(req.url);
    // console.log('-----------------');

    if (req.url === '/') {
        filePath = path.join(__dirname, "./src/index.html");
    } else if (req.url.startsWith('/node_modules/')) {
        filePath = path.join(__dirname, req.url);
    } else {
        filePath = path.join(__dirname, `./src/${req.url}`);
    }

    contentType = getContentType(filePath);

    try {
        const contents = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(contents, 'utf8');
    } catch (err) {
        console.error(`Could not read file: ${filePath}`);
        res.writeHead(404);
        res.end('Not Found');
    }
};

// Create the HTTP server
const server = http.createServer(requestListener);

// Specify the port for the server to listen on
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
