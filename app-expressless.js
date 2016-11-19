// Without Express (a layer on top of HTTP):
// Advantage: Pure node is more performant than Express (think for Tessel)

const http = require('http');
const server = http.createServer();
const products = require('/inventory');

// IMPORTANT: The way node servers work by default is if nothing is listening or running (e.g. `setInterval` the process closes immediately.)

server.on('request', function(req, res) {
    // request = input of the the HTTP message, stuff about it, url, method
    // response = a way to generate output; to send back a signal to this message
    // app.get('/')

    if (req.url === '/' && req.method === 'GET') {
        res.end('Hello!');
    }
});

server.listen(3001, function() { // Sort of serves as a callback -- don't use `80` -- administrative, and `5432` -- Postgres' port | can go anywhere after server is created
	console.log('Server is listening on port 3001'); // Keeps the process from completing; something is always running
})