//Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var comments = [];

var server = http.createServer(function (req, res) {
    //Parse the url
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if (pathname === '/') {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (pathname === '/comment') {
        //Check the request method
        if (req.method === 'POST') {
            //Get the data
            var data = '';
            req.on('data', function (chunk) {
                data += chunk;
            });
            req.on('end', function () {
                var comment = querystring.parse(data);
                comment.time = new Date();
                comments.push(comment);
                res.statusCode = 302;
                res.setHeader('Location', '/');
                res.end();
            });
        } else if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comments));
        }
    } else {
        fs.readFile('.' + pathname, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.end(data);
            }
        });
    }
});

server.listen(3000, function () {
    console.log('Server is running...');
});