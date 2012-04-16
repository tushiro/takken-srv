/**
 * @author tushiro
 */
var logger = require("./takken_util").getLogger();

var SqlUtil = require('./sql_util');

var TABLE_NAME = 'TAK_USER';

var COLUMNS = [
    'user_id',
    'password'
];

var SELECT_HEADER = SQLUtil.toSelectHeader(TABLE_NAME, COLUMNS);

var SELECT_SQL = SELECT_HEADER + ' WHERE user_id = ?';

module.exports.get = function get(client, userId, callback) {

    var doPost = function(err, results, fields) {

        logger.debug(SELECT_SQL);

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
    };

    client.query(SELECT_SQL, [userId], doPost);
}

var INSERT_SQL = SqlUtil.toInsertSql(TABLE_NAME, COLUMNS);

module.exports.insert = function insert(client, user, callback) {

    var params = [user.id, user.password];

    var doPost = function(err, results, fields) {

        logger.debug(INSERT_SQL);

        if (err) {
            callback(err);
            return; 
        }
        
        callback(null, client, null);
    };

    client.query(INSERT_SQL, params, doPost);
}
