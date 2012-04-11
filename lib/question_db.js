/**
 * @author tushiro
 */
var takkenUtil = require('./takken_util');
var logger = takkenUtil.getLogger();
var SqlUtil = require('./sql_util');

var TABLE_NAME = 'QUESTION';

var COLUMNS = [
    'subject',
    'category',
    'test_term',
    'question_number',
    'question_sentence',
    'answer_number',
    'enabled'
];

var SELECT_HEADER = SQLUtil.toSelectHeader(COLUMNS) + TABLE_NAME;

var SELECT_ALL = SELECT_HEADER + 
' ORDER BY subject ASC, category ASC, test_term ASC, question_number ASC';
    
function create(result) {
    
    return {
        subject           : result["subject"],
        category          : result["category"],
        test_term         : result["test_term"],
        question_number   : result["question_number"],
        question_sentence : result["question_sentence"],
        answer_number     : result["answer_number"],
        enabled           : result["enabled"] == 1
    };
}

module.exports.pushTo = function pushTo(client, cache, callback) {
  
    client.query(SELECT_ALL,
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
              
            var questions = [];
          
            for(var i = 0; i < results.length; i++) {
                questions.push(create(results[i]));
            };
            
            
            var item = {item : {
                        name : 'QUESTION',
                        values : questions}};

            cache.push(item);
            
            callback(null, client, cache);
        }
    );
}

var SELECT_ARRAY = SELECT_HEADER +
    ' WHERE subject = ? ' +
    'ORDER BY category ASC, test_term ASC, question_number ASC';

module.exports.getArray = function getArray(client, cache, callback, subject) {

    client.query(SELECT_ARRAY, [subject],
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
            
            var questions = [];
            
            for (var i = 0; i < results.length; i++) {
                questions.push(create(results[i]));
            }
            
            cache.questions = questions;
            
            callback(null, client, cache, subject);
        }
    );
}