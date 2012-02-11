
function EventLog(time, index, level, text) {
	this.time  = time;
	this.index = index;
	this.level = level;
	this.text  = text;
}

function insert(client, eventLog) {
        
    var sql =
        'INSERT INTO EVENT_LOG (event_time, event_index, level, event_text) ' +
        'VALUES (?, ?, ?, ?)';
    
//    var params = {
//          eventLog.time,
//          eventLog.index,
//          eventLog.level,
//          eventLog.text};
    
    var params = [
          0,
          0,
          6,
          "Hello Hello!"];

    client.query(sql, params,
        function (err, results, fields) {
        }
    );
}

module.exports = {
    insert: insert,
    EventLog: EventLog
};
