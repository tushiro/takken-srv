function insert(client, eventLog) {
        
    var sql =
        'INSERT INTO EVENT_LOG (event_time, event_index, level, event_text) ' +
        'VALUES (?, ?, ?, ?)';
    
	console.log("insert:" + eventLog);

    var params = {
          eventLog.time,
          eventLog.index,
          eventLog.level,
          eventLog.text};
    
//    var params = [
//          0,
//          0,
//          6,
//          "Hello Hello!"];

    client.query(sql, params,
        function (err, results, fields) {
            if(err) {
                throw err;
            }
        }
    );
}

module.exports = {
    insert: insert
};
