
var fcgiApp = require("./fcgi");
var http = require("http");

var takkenUtil = require("./lib/takken_util");
var categoryDB = require("./lib/category_db");
var subjectDB = require("./lib/subject_db");



var myServer = http.createServer(function(req, res) {
	setTimeout(function() {

		var logger;
		
		try { 
			
			var logger = takkenUtil.getLogger();
		
		} catch (e) {
		
			res.writeHead(200, {"Content-type": "text/html"});
            res.end(e.stack);
            return;
		}
        
		try { 
    		var client = takkenUtil.getMySQLClient();
            var subjects = subjectDB.getAll(client);
            
            console.log("start");
            for(var i = 0; i < subjects.length; i++) {
                console.log(subjects[i].subject + "\n");
            };
            console.log("stop");
        
            var s = "";
            for(var i = 0; i < subjects.length; i++) {
              s += subjects[i].subject + "\n";
            };
            
            res.writeHead(200, {"Content-type": "text/html"});
            res.end(Date.now() + " " + s);
            console.log(s);
            console.log("Wrote response.");
            logger.info("Hello World!");

            client.end();

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

