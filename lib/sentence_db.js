/**
 * @author tushiro
 */
var takkenUtil = require('./takken_util');
var logger = takkenUtil.getLogger();
var SqlUtil = require('./sql_util');

var TABLE_NAME = 'SENTENCE';

var COLUMNS = [
    'subject', 
    'category',
    'test_term',
    'question_number',
    'sentence_index',
    'sentence_type',
    'sentence',
    'correct',
    'yesno_question',
    'description',
    'description_font',
    'description_time',
    'description_user'
];

function create(result) {
    
    return {
        subject   :  result["subject"],
        category  :  result["category"],
        term      :  result["test_term"],
        number    :  result["question_number"],
        index     :  result["sentence_index"], 
        type      :  result["sentence_type"], 
        sentence  :  result["sentence"], 
        correct   : (result["correct"] == 1), 
        yesno     : (result["yesno_question"] == 1), 
        desc      :  result["description"], 
        desc_font :  result["description_font"], 
        desc_time :  result["description_time"],  
        desc_user :  result["description_user"]
    };
}

var SELECT_HEADER = SQLUtil.toSelectHeader(COLUMNS) + TABLE_NAME;

var SELECT_ALL = SELECT_HEADER + ' ' +
        'ORDER BY ' +
            'subject ASC, ' +
            'category ASC, ' + 
            'test_term ASC, ' +
            'question_number ASC, ' +
            'sentence_index ASC';

function pushTo(client, cache, callback) {
  
    client.query(SELECT_ALL,
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
              
            var sentences = [];
          
            for(var i = 0; i < results.length; i++) {
                sentences.push(create(results[i]));
            };
            
            var item = {item : {
                        name : 'SENTENCE',
                        values : sentences}};

            cache.push(item);

            callback(null, client, cache);
        }
    );
}

var SELECT_ARRAY = SELECT_HEADER + ' ' +
        'WHERE subject = ? ' +
        'AND category = ? ' +
        'AND test_term = ? '
        'AND question_number = ? ' +
        'ORDER BY sentence_index ASC';

function pushTo(
    client,
    callback, 
    subject, 
    category, 
    term, 
    number, 
    cache) {
  
    var params = [subject, category, term, number];

    client.query(SELECT_ARRAY, params,
        function (err, results, fields) {
    
            logger.debug(sql);

            if (err) {
                callback(err);
                return; 
            }
              
            var sentences = [];
          
            for(var i = 0; i < results.length; i++) {
                sentences.push(create(results[i]));
            };
            
            cache.sentences = sentences;

            callback(null, client, cache);
        }
    );
}

module.exports = {
    pushTo: pushTo
};
