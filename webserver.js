var http = require("http"); //Import http to server files
var fs = require("fs"); //Import tools for manipulating filesystem
var url = require("url"); //Parsing urls
var mime = require('mime'); //Parsing MIME-Types

function request(req, res) 
{
	var reqUrl = url.parse(req.url);
	var path = reqUrl.pathname;
	if(path == "/") path = "./index.html";
	else path = "." + path;
	fs.readFile(path, function(err, data)
	{
		if(err)
		{
			res.writeHead(404, {"Content-Type" : "text/html"});
			res.end("Not found");
			console.log(err);
		}
		else
		{
			res.writeHead(200, {"Content-Type" : mime.lookup(path)});
			res.end(data);
		}
	});
}

module.exports = 
{
	start : function(port) 
	{
		var httpserver = http.createServer(request);
		httpserver.listen(port);
	}
};
