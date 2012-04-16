/**
 * @author tushiro
 */
var logger = require('./takken_util').getLogger();
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

var SELECT_HEADER = SQLUtil.toSelectHeader(TABLE_NAME, COLUMNS);

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

var SELECT_ALL = SELECT_HEADER + ' ' +
    'ORDER BY subject ASC, category ASC, test_term ASC, question_number ASC';
    
module.exports.pushTo = function pushTo(client, cache, callback) {

    var doPost = function (err, results, fields) {

        logger.debug(SELECT_ALL);

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
    };
  
    client.query(SELECT_ALL, doPost);
}

var SELECT_ARRAY = SELECT_HEADER + ' ' +
    'WHERE subject = ? ' +
    'ORDER BY category ASC, test_term ASC, question_number ASC';

module.exports.pushTo = function pushTo(client, callback, subject, cache) {

    var doPost = function (err, results, fields) {

        logger.debug(SELECT_ARRAY);

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
    };

    client.query(SELECT_ARRAY, [subject], doPost);
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

    var params = [subject, category, term, number];

    var doPost = function (err, results, fields) {

        logger.debug(SELECT_SQL);

        if (err) {
            callback(err);
            return; 
        }
        
        cache.question = results.lenngth = 0 ? null : create(results[0]);
        
        callback(null, client, cache);
    }

    client.query(SELECT_SQL, params, doPost);
}

var UPDATE_SQL = SqlUtil.toUpdateHeader(TABLE_NAME) + ' ' +
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

    var doPost = function(err, results, fields) {
        
        logger.debug(UPDATE_SQL);
        
        callback(null, client);
    }

    client.query(UPDATE_SQL, params, doPost);
}