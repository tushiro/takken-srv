/**
 * @author tushiro
 */
var takkenUtil = require("./takken_util");
var logger = takkenUtil.getLogger();

function pushTo(client, cache, callback) {
  
    var sql =
        'SELECT ' +
        'subject, ' +
        'category, ' +
        'test_term, ' +
        'question_number, ' +
        'question_sentence, ' +
        'answer_number, ' +
        'enabled ' +
        'FROM QUESTION ' +
        'ORDER BY  ' +
        'subject ASC, category ASC, test_term ASC, question_number ASC';
    
    client.query(sql,
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
              
            var questions = [];
          
            for(var i = 0; i < results.length; i++) {
          
                var result = results[i];
                
                questions.push(
                        {subject           : result["subject"],
                         category          : result["category"],
                         test_term         : result["test_term"],
                         question_number   : result["question_number"],
                         question_sentence : result["question_sentence"],
                         answer_number     : result["answer_number"],
                         enabled           : result["enabled"] == 1}
                );
            };
            
            
            var item = {item : {
                        name : 'QUESTION',
                        values : questions}};

            cache.push(item);
            
            callback(null, client, cache);
        }
    );
}

module.exports = {
    pushTo: pushTo
};
