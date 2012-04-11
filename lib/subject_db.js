/**
 * @author tushiro
 */
var takkenUtil = require("./takken_util");
var logger = takkenUtil.getLogger();

var SqlUtil = require('./sql_util');

var TABLE_NAME = 'SUBJECT';

var COLUMNS = [
    'subject',
    'priority',
    'description'
];

var SELECT_HEADER = SQLUtil.toSelectHeader(COLUMNS) + TABLE_NAME;

var SELECT_ALL = SELECT_HEADER + ' ORDER BY priority ASC, subject ASC';

function create(result) {
    
    return {
        subject     : result["subject"],
        priority    : result["priority"],
        description : result["description"]
    };
}

module.exports.pushTo = function pushTo(client, cache, callback) {

    
    client.query(SELECT_ALL,
         function (err, results, fields) {
    
            logger.debug(sql);

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
        }
    );
}

module.exports.getAll = function getAll(client, res, callback) {

    client.query(SELECT_ALL,
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
            
            var subjects = [];
            
            for (var i = 0; i < results.length; i++) {
                subjects.push(create(results[i]));
            }
            
            callback(res, subjects);
        }
    );
}
