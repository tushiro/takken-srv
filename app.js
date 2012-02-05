var fcgiApp = require("./fcgi");
var http = require("http");
//var takkenUtil = require("./lib/takken_util");
//var categoryDB = require("./lib/category_db");
//var logger = takkenUtil.getLogger();
//var fs = require("fs");
	
var myServer = http.createServer(function(req, res) {
	setTimeout(function() {
		
//		var client = takkenUtil.getMySQLClient();
//        var categories = categoryDB.getAll(client);
//        client.end();
        
        var s = 'Hello World!';
//        logger.info(s);
    
//        var str = "";
//        for(var i = 0; i < categories.length; i++) {
//          str += categories[i].category;
//        };
    
        res.writeHead(200, {"Content-type": "text/html"});
        res.end(s);
        console.log("Wrote response.");
  
	}, 1000);
	//throw new Error("Bollocks.");
});


// Instead of this:
//myServer.listen(12345);

// You do this:
fcgiApp.handle(myServer);

