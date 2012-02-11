/**
 * @author tushiro
 */
var subjects = [];

function getAll(client) {
  
    var sql =
        'SELECT subject, priority ' +
        'FROM SUBJECT ' +
        'ORDER BY subject ASC, priority ASC';
    
    client.query(sql,
        function (err, results, fields) {
    
            if (err) {
                throw err; 
            }
            console.log(results);
              
            for(var i = 0; i < results.length; i++) {
          
                var result = results[i];
                subjects.push(
                        {subject  : result["subject"],
                         priority : result["priority"]}
                );
            };
        }
    );
      
    return subjects;
}

module.exports = {
    getAll: getAll
};
