var async = require('async');

var takkenUtil = require("./takken_util");
var logger = takkenUtil.getLogger();

var categoryDB = require("./category_db");
var subjectDB = require("./subject_db");
var questionDB = require("./question_db");
var sentenceDB = require("./sentence_db");

function execute(req, res) {
    
    var tasks = [
        function (callback) {
            
            try {
                var client = takkenUtil.getCoreClient();
                
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
            
            logger.info(message);
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
}

module.exports = {
    execute : execute  
};
