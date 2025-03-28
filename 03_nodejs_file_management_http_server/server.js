const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const PORT = 3000;
const fileManager = new EventEmitter();

// Create a new HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  // Set headers for the response
  res.setHeader('Content-Type', 'application/json');

  if (method === 'GET') {
    switch (parsedUrl.pathname) {
      case '/create':
        createFile(parsedUrl.query.filename, res);
        break;
      case '/read':
        readFile(parsedUrl.query.filename, res);
        break;
      case '/update':
        updateFile(parsedUrl.query.filename, parsedUrl.query.content, res);
        break;
      case '/delete':
        deleteFile(parsedUrl.query.filename, res);
        break;
      default:
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ message: 'Method not allowed' }));
  }
});

// File operations with fs module
function createFile(filename, res) {
  const filePath = path.join(__dirname, filename);

  fs.writeFile(filePath, '', (err) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Error creating file', error: err }));
    } else {
      fileManager.emit('fileCreated', filename);
      res.statusCode = 201;
      res.end(JSON.stringify({ message: 'File created successfully' }));
    }
  });
}

function readFile(filename, res) {
  const filePath = path.join(__dirname, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Error reading file', error: err }));
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify({ filename, content: data }));
    }
  });
}

function updateFile(filename, content, res) {
  const filePath = path.join(__dirname, filename);

  fs.appendFile(filePath, content, (err) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Error updating file', error: err }));
    } else {
      fileManager.emit('fileUpdated', filename);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'File updated successfully' }));
    }
  });
}

function deleteFile(filename, res) {
  const filePath = path.join(__dirname, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Error deleting file', error: err }));
    } else {
      fileManager.emit('fileDeleted', filename);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'File deleted successfully' }));
    }
  });
}

// Event listeners
fileManager.on('fileCreated', (filename) => {
  console.log(`File created: ${filename}`);
});

fileManager.on('fileUpdated', (filename) => {
  console.log(`File updated: ${filename}`);
});

fileManager.on('fileDeleted', (filename) => {
  console.log(`File deleted: ${filename}`);
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
