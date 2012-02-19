var takkenUtil = require("./takken_util");
var logger = takkenUtil.getLogger();

/**
 * @author tushiro
 */
function pushTo(client, cache, callback) {
  
    var sql =
        'SELECT subject, category, priority ' +
        'FROM CATEGORY ' +
        'ORDER BY subject ASC, priority ASC, category ASC';
    
    client.query(sql,
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
            
            cache.push({"CATEGORY" : categories});
            
            callback(null, client, cache);
        }
    );
}

module.exports = {
    pushTo: pushTo
};
