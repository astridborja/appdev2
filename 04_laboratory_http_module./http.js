const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/greet') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, welcome to Node.js!');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

server.listen(3000, 'localhost', () => {
    console.log('Server is running at http://localhost:3000/');
});