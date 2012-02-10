/**
 * @author tushiro
 */
var categories = [];

function getAll(client) {
  
    var sql =
        'SELECT subject, category, priority ' +
        'FROM CATEGORY ' +
        'ORDER BY subject ASC, priority ASC, category ASC';
    
    client.query(sql,
        function (err, results, fields) {
    
            if (err) {
                throw err; 
            }
            console.log(results);
              
            for(var i = 0; i < results.length; i++) {
          
                var result = results[i];
                categories.push(
                        {subject  : result["subject"],
                         category : result["category"],
                         priority : result["priority"]}
                );
            };
        }
    );
      
    return categories;
}

module.exports = {
    getAll: getAll,
    categories: categories
};
