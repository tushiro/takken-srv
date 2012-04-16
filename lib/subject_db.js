/**
 * @author tushiro
 */
var logger = require("./takken_util").getLogger();

var SqlUtil = require('./sql_util');

var TABLE_NAME = 'SUBJECT';

var COLUMNS = [
    'subject',
    'priority',
    'description'
];

function create(result) {
    
    return {
        subject     : result["subject"],
        priority    : result["priority"],
        desc        : result["description"]
    };
}

var SELECT_HEADER = SQLUtil.toSelectHeader(TABLE_NAME, COLUMNS);

var SELECT_ALL = SELECT_HEADER + ' ORDER BY priority ASC, subject ASC';

module.exports.pushTo = function pushTo(client, cache, callback) {
    
    var doPost = function (err, results, fields) {

        logger.debug(SELECT_ALL);

        if (err) {
            callback(err);
            return; 
        }
        
        var subjects = [];
        
        for (var i = 0; i < results.length; i++) {
            subjects.push(create(results[i]));
        }
        
        var item = {item : {
                    name : 'SUBJECT',
                    values : subjects}};

        cache.push(item);
        
        callback(null, client, cache);
    };

    client.query(SELECT_ALL, doPost);
}

module.exports.getAll = function getAll(client, res, callback) {
    
    var doPost = function (err, results, fields) {
    
        logger.debug(SELECT_ALL);

        if (err) {
            callback(err);
            return; 
        }
        
        var subjects = [];
        
        for (var i = 0; i < results.length; i++) {
            subjects.push(create(results[i]));
        }
        
        callback(res, subjects);
    };

    client.query(SELECT_ALL, doPost);
}
