var logger = require("./takken_util").getLogger();

var SqlUtil = require('./sql_util');

var TABLE_NAME = 'CATEGORY';

var COLUMNS = [
    'subject',
    'category',
    'priority'
];

var SELECT_HEADER = SQLUtil.toSelectHeader(TABLE_NAME, COLUMNS);

function create(result) {
    
    return {
        subject  : result["subject"],
        category : result["category"],
        priority : result["priority"]
    };
}

var SELECT_ALL = SELECT_HEADER + ' ' +
    'ORDER BY subject ASC, priority ASC, category ASC';

module.exports.pushTo = function pushTo(client, cache, callback) {
    
    var doPost = function (err, results, fields) {
    
        logger.debug(SELECT_ALL);

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
    };
  
    client.query(SELECT_ALL, doPost);
}

var SELECT_ARRAY = SELECT_HEADER + ' ORDER BY priority ASC, category ASC';

module.exports.pushTo = function pushTo(client, callback, subject, cache) {

    var doPost = function (err, results, fields) {
    
        logger.debug(SELECT_ARRAY);

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
    };

    client.query(SELECT_ARRAY, [subject], doPost);
}
