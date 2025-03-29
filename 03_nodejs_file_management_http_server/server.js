const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const EventEmitter = require('events');

// Event emitter instance
const eventEmitter = new EventEmitter();

// Define the folder path to store files
const directoryPath = path.join(__dirname, 'files');

// Ensure the directory exists
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}

// Function to log events
eventEmitter.on('fileCreated', (filename) => {
  console.log(`File created: ${filename}`);
});

eventEmitter.on('fileDeleted', (filename) => {
  console.log(`File deleted: ${filename}`);
});

// Create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle different routes
  if (pathname === '/create' && req.method === 'GET') {
    const filename = parsedUrl.query.filename;
    if (!filename) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing filename query parameter');
      return;
    }

    // Create the file
    const filePath = path.join(directoryPath, filename);
    fs.writeFile(filePath, '', (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error creating file');
        return;
      }
      eventEmitter.emit('fileCreated', filename);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`File ${filename} created`);
    });

  } else if (pathname === '/read' && req.method === 'GET') {
    const filename = parsedUrl.query.filename;
    if (!filename) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing filename query parameter');
      return;
    }

    // Read the file
    const filePath = path.join(directoryPath, filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    });

  } else if (pathname === '/delete' && req.method === 'DELETE') {
    const filename = parsedUrl.query.filename;
    if (!filename) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing filename query parameter');
      return;
    }

    // Delete the file
    const filePath = path.join(directoryPath, filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      eventEmitter.emit('fileDeleted', filename);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`File ${filename} deleted`);
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});