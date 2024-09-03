const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

// Create a proxy server object
const proxy = httpProxy.createProxyServer({});

// Define the log file path
const logFilePath = path.join(__dirname, 'access.log');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Log each request
  logRequest(req);

  // Handle proxy errors
  proxy.web(req, res, { target: req.url }, (err) => {
    handleProxyError(err, req, res);
  });
});

// Function to log request details
function logRequest(req) {
  const logEntry = `${new Date().toISOString()} - ${req.connection.remoteAddress} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

// Function to handle proxy errors
function handleProxyError(err, req, res) {
  console.error('Proxy error:', err);

  // Log the error
  const errorEntry = `${new Date().toISOString()} - ERROR - ${err.message} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, errorEntry, (err) => {
    if (err) {
      console.error('Failed to write error to log file:', err);
    }
  });

  // Send a custom error response based on the error type
  if (err.code === 'ECONNREFUSED') {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: The target server refused the connection.');
  } else if (err.code === 'ENOTFOUND') {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway: The target server could not be found.');
  } else if (err.code === 'ETIMEDOUT') {
    res.writeHead(504, { 'Content-Type': 'text/plain' });
    res.end('Gateway Timeout: The target server took too long to respond.');
  } else {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error: Something went wrong.');
  }
}

// Handle errors from the proxy server itself
proxy.on('error', (err, req, res) => {
  handleProxyError(err, req, res);
});

// Listen on port 9080 for all IP addresses
server.listen(9090, '0.0.0.0', () => {
  console.log('Proxy server is running on port 9090');
});
