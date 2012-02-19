
var fcgiApp = require("./fcgi");
var http = require("http");
var async = require('async');

var takkenUtil = require("./lib/takken_util");
var logger = takkenUtil.getLogger();

var categoryDB = require("./lib/category_db");
var subjectDB = require("./lib/subject_db");
var questionDB = require("./lib/question_db");
var sentenceDB = require("./lib/sentence_db");


var myServer = http.createServer(function(req, res) {
	setTimeout(function() {

		try {
            
            var tasks = [
                function (callback) {
                    
                    try {
                        var client = takkenUtil.getMySQLClient();
                        
                    } catch (e) {
                        callback(e);
                        return;                     
                    }
                 
                    var cache = [];
                    
                    callback(null, client, cache);
                },
                function (client, cache, callback) {
                    subjectDB.pushTo(client, cache, callback);
                },
                function (client, cache, callback) {
                    categoryDB.pushTo(client, cache, callback);
                },
                function (client, cache, callback) {
                    questionDB.pushTo(client, cache, callback);
                },
                function (client, cache, callback) {
                    sentenceDB.pushTo(client, cache, callback);
                },
                function (client, cache, callback) {

                    client.end();
                    
                    var message = JSON.stringify(cache);
                    
                    res.writeHead(200, {"Content-type": "application/json"});
                    res.end(message);
                    
                    logger.info("send json data");
                }
            ];            
            
            var errorHandle = function (err) {
    
                if (client != null) {
                    client.end();
                }

                logger.error(err);
            };
            
            async.waterfall(tasks, errorHandle);
            
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

