/*
 *	Auszuführen mit Node.js 
 */

var http = require("http"); //Import http to server files
var fs = require("fs"); //Import tools for manipulating filesystem

var index = fs.readFileSync("html/index.html");

function request(req, res) {
	res.writeHead(200, {"Content-Type" : "text/html"});
	res.end(index);
}

var httpserver = http.createServer(request);
httpserver.listen(8080);
