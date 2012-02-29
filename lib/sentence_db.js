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
            'sentence_index, ' +
            'sentence_type, ' +
            'sentence, ' +
            'correct, ' +
            'yesno_question, ' +
            'description, ' +
            'description_font, ' +
            'description_time, ' +
            'description_user ' +
        'FROM SENTENCE ' +
        'ORDER BY ' +
            'subject ASC, ' +
            'category ASC, ' + 
            'test_term ASC, ' +
            'question_number ASC, ' +
            'sentence_index ASC';
    
    client.query(sql,
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
              
            var sentences = [];
          
            for(var i = 0; i < results.length; i++) {
          
                var result = results[i];
                
                sentences.push(
                        {subject             :  result["subject"],
                         category            :  result["category"],
                         test_term           :  result["test_term"],
                         question_number     :  result["question_number"],
                         sentence_index      :  result["sentence_index"], 
                         sentence_type       :  result["sentence_type"], 
                         sentence            :  result["sentence"], 
                         correct             : (result["correct"] == 1), 
                         yesno_question      : (result["yesno_question"] == 1), 
                         description         :  result["description"], 
                         description_font    :  result["description_font"], 
                         description_time    :  result["description_time"], 
                         description_user    :  result["description_user"]}
                );
            };
            
            var item = {item : {
                        name : 'SENTENCE',
                        values : sentences}};

            cache.push(item);

            callback(null, client, cache);
        }
    );
}

module.exports = {
    pushTo: pushTo
};
