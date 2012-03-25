
var fcgiApp = require("./fcgi");
var http = require("http");

var TakkenUtil = require("./lib/takken_util");
var logger = TakkenUtil.getLogger();

var responseJson = require("./lib/response_json");

var myServer = http.createServer(function(req, res) {

	setTimeout(function() {

        try {
            
            responseJson.execute(req, res);
            
        } catch (e) {
            logger.error(e.stack);
            res.writeHead(200, {"Content-type": "text/html"});
            res.end(e.stack);
        }
  
	}, 1000);
	//throw new Error("Bollocks.");
});

// Instead of this:
myServer.listen(12345);

// You do this:
//fcgiApp.handle(myServer);

