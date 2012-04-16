var SqlUtil = require('./sql_util');

var TABLE_NAME = 'EVENT_LOG';

var COLUMNS = [
    'event_time',
    'event_index',
    'level',
    'event_text'
];

module.exports.EventLog = function EventLog(time, index, level, text) {
    this.time = time;
    this.index = index;
    this.level = level;
    this.text = text;
}

var INSERT_SQL = SqlUtil.toInsertSql(TABLE_NAME, COLUMNS);

module.exports.insert = function insert(client, eventLog, callback) {
        
    var params = [
          eventLog.time,
          eventLog.index,
          eventLog.level,
          eventLog.text];
    
    var doPost = function (err, results, fields) {
        
        if(err) {
            callback(err);
            return;
        }
        
        callback(null, client);
    };
    
    client.query(INSERT_SQL, params, doPost);
}
