var takkenUtil = require("./takken_util");
var logger = takkenUtil.getLogger();

var SqlUtil = require('./sql_util');

var TABLE_NAME = 'CATEGORY';

var COLUMNS = [
    'subject',
    'category',
    'priority'
];

var SELECT_HEADER = SQLUtil.toSelectHeader(COLUMNS) + TABLE_NAME;

var SELECT_ALL = SELECT_HEADER + ' ORDER BY subject ASC, priority ASC, category ASC';

function create(result) {
    
    return {
        subject  : result["subject"],
        category : result["category"],
        priority : result["priority"]
    };
}

/**
 * @author tushiro
 */
module.exports.pushTo = function pushTo(client, cache, callback) {
  
    client.query(SELECT_ALL,
        function (err, results, fields) {
    
            logger.debug(sql);
    
            if (err) {
                callback(err);
                return; 
            }
              
            var categories = [];
          
            for(var i = 0; i < results.length; i++) {
          
                var result = results[i];
                
                categories.push(
                        {subject  : result["subject"],
                         category : result["category"],
                         priority : result["priority"]}
                );
            };

            var item = {item : {
                        name : 'CATEGORY',
                        values : categories}};

            cache.push(item);
            
            callback(null, client, cache);
        }
    );
}

var SELECT_ARRAY = SELECT_HEADER + ' ORDER BY priority ASC, category ASC';

module.exports.getArray = function (client, cache, callback, subject) {

    client.query(SELECT_ARRAY, [subject],
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
            
            var categories = [];
            
            for (var i = 0; i < results.length; i++) {
                categories.push(create(results[i]));
            }
            
            cache.categories = categories;
            
            callback(null, client, cache, subject);
        }
    );
}
