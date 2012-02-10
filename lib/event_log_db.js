
function insert(client, eventLog) {
        
    var sql =
        'INSERT INTO EVENT_LOG (event_time, event_index, level, event_text) ' +
        'VALUES (?, ?, ?, ?)';
    
    var params = {
          eventLog.time,
          eventLog.index,
          eventLog.level,
          eventLog.text};

    client.query(sql, params
        function (err, results, fields) {
        }
    );
      
    return eventLogs;
}

module.exports = {
    insert: insert
};