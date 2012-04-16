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
        subject  : result["subject"],
        category : result["category"],
        term     : result["test_term"],
        number   : result["question_number"],
        sentence : result["question_sentence"],
        answer   : result["answer_number"],
        enabled  : result["enabled"] == 1
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

module.exports.pushTo = function pushTo(client, callback, subject, cache) {

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

var SELECT_SQL = SELECT_HEADER + ' ' +
    'WHERE subject = ? ' +
    'AND category = ? ' + 
    'AND test_term = ? ' + 
    'AND question_number = ?';

module.exports.pushTo = function pushTo(
    client,
    callback,
    subject,
    category,
    term,
    number,
    cache) {

    client.query(SELECT_SQL, [subject, category, term, number],
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
            
            cache.question = results.lenngth = 0 ? null : create(results[0]);
            
            callback(null, client, cache);
        }
    );
}

var UPDATE_SQL = 'UPDATE ' + TABLE_NAME + ' SET ' +
    'question_sentence = ?, ' +
    'answer_number = ?, ' +
    'enabled = ? ' +
    'WHERE subject = ? ' +
    'AND category = ? ' + 
    'AND test_term = ? ' + 
    'AND question_number = ?';

module.exports.update = function udpate(
    client,
    callback,
    question) {

    var params = [
        question.sentence,
        question.number,
        question.enabled ? 1 : 0,
        question.subject,
        question.category,
        question.test_term,
        question.question_number
    ];

    client.query(UPDATE_SQL, params);
    
    callback(null, client);
}