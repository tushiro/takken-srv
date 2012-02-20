function EventLog(time, index, level, text) {
    this.time = time;
    this.index = index;
    this.level = level;
    this.text = text;
}

function insert(client, eventLog, callback) {
        
    var sql =
        'INSERT INTO EVENT_LOG (event_time, event_index, level, event_text) ' +
        'VALUES (?, ?, ?, ?)';
    
    var params = [
          eventLog.time,
          eventLog.index,
          eventLog.level,
          eventLog.text];
    
    client.query(sql, params,
        function (err, results, fields) {
            
        	if(err) {
                callback(err);
                return;
            }
            
            callback(null, client);
        }
    );
}

module.exports = {
    insert: insert,
    EventLog: EventLog
};
