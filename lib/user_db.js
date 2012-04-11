/**
 * @author tushiro
 */
var takkenUtil = require("./takken_util");
var logger = takkenUtil.getLogger();

function get(client, userId, callback) {

	var sql =
        'SELECT user_id, password ' +
        'FROM TAK_USER WHERE user_id = ?';
    
    client.query(sql, [userId], function(err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
            
            var user;
            
            if (results.length == 0) {
                user = null;
            } else {
                var result = results[i];
                user = {
                    id : result["user_id"],
                    password : result["password"]};
            }
            
            callback(null, client, user);
        }
    );
}

function insert(client, user, callback) {

    var sql = 'INSERT INTO TAK_USER (user_id, password) VALUES (?, ?)';
    
    var params = [user.id, user.password];
    
    client.query(sql, params,
        function(err, results, fields) {

            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
            
            callback(null, client, null);
        }
    );
}

module.exports = {
    get: get,
    insert: insert
};
