/**
 * @author tushiro
 */
var takkenUtil = require("./takken_util");
var logger = takkenUtil.getLogger();

function pushTo(client, cache, callback) {

	var sql =
        'SELECT subject, priority ' +
        'FROM SUBJECT ' +
        'ORDER BY subject ASC, priority ASC';
    
    client.query(sql,
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
            
            var subjects = [];
            
            for(var i = 0; i < results.length; i++) {
          
                var result = results[i];
                
                subjects.push({
                		subject  : result["subject"],
                		priority : result["priority"]}
                );
            };
            
            cache.push({"SUBJECT" : subjects});
            
            callback(null, client, cache);
        }
    );
}

module.exports = {
    pushTo: pushTo
};
