var async = require('async');

var TakkenUtil = require("./takken_util");
var logger = TakkenUtil.getLogger();

var CategoryDB = require("./category_db");
var SubjectDB = require("./subject_db");
var QuestionDB = require("./question_db");
var SentenceDB = require("./sentence_db");
var SecurityUtil = require('./security_util');

module.exports.execute = function execute(req, res) {
    
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
            SubjectDB.pushTo(client, cache, callback);
        },
        function (client, cache, callback) {
            CategoryDB.pushTo(client, cache, callback);
        },
        function (client, cache, callback) {
            QuestionDB.pushTo(client, cache, callback);
        },
        function (client, cache, callback) {
            SentenceDB.pushTo(client, cache, callback);
        },
        function (client, cache, callback) {

            client.end();
            
            var message = JSON.stringify(cache);
            var cryptText = SecurityUtil.encode(message);
            
            res.writeHead(200, {"Content-type": "application/json"});
            res.end(cryptText);
            
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