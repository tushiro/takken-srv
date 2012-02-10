
var fcgiApp = require("./fcgi");
var http = require("http");

var takkenUtil = require("./lib/takken_util");
var categoryDB = require("./lib/category_db");
var subjectDB = require("./lib/subject_db");

var logger = takkenUtil.getLogger();


var myServer = http.createServer(function(req, res) {
	setTimeout(function() {
		
        try { 
    		var client = takkenUtil.getMySQLClient();
            var subjects = subjectDB.getAll(client);
            client.end();
        

            var s = "";
            for(var i = 0; i < subjects.length; i++) {
              s += subjects[i].subject;
            };
            
            res.writeHead(200, {"Content-type": "text/html"});
            res.end(s);
            console.log("Wrote response.");

        } catch (e) {
            logger.error(e.stack);
            res.writeHead(200, {"Content-type": "text/html"});
            res.end(e.stack);
            return;
        }
        
  
	}, 1000);
	//throw new Error("Bollocks.");
});


// Instead of this:
//myServer.listen(12345);

// You do this:
fcgiApp.handle(myServer);

