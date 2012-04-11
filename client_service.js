
var async = require('async');

var TakkenUtil = require('./lib/takken_util');
var logger = TakkenUtil.getLogger();

var UserDB = require('./lib/user_db');
var SubjectDB = require('./lib/subject_db');
var QuestionDB = require('./lib/question_db');
var CategoryDB = require('./lib/category_db');

module.exports.execute = function (req, res) {
    
    var res_error = function (mes) {
        res.render('index', {
            locals : { message : mes }
        });
    };

    var res_main = function () {
        res.render('main_menu', {
            locals : {
                "userid"   : userid
            }
        });
    };

    var userid = req.param('userid');
    var password = req.param('password');

    if (!userid) {
        res_error('not found "User ID"');
    }

    if (!password) {
        res_error('not found "password"');
    }
    
    var tasks = [
        function (callback) {
            
            try {
                var client = TakkenUtil.getCoreClient();
                
            } catch (e) {
                callback(e);
                return;                     
            }
         
            callback(null, client);
        },
        function (client, callback) {
            UserDB.get(client, userid, callback);
        },
        function (client, user, callback) {

            if (user != null &&
                user.id == userid &&
                user.password == password) {
    
                req.session.login = true;
                res_success('login success.');
    
            } else {
                res_error("UserID or passwrod is different.");
            }
        }
    ];

    var errorHandle = function (err) {
        logger.error(err);
        res_error(err);
    };
    
    async.waterfall(tasks, errorHandle);
}

module.exports.check = function check(req, res, page) {
    
    if (req.session.login) {
        return true;
    }
    
    res.render(page, {
        locals : {message : 'Dont login. Please login again.'}
    });
    
    return false;
}

module.exports.responseSubjects = function (req, res) {    

    if (!check(req, res, './index')) {
        return;
    }
    
    var doResponse = function (res, subjects) {
        res.render('subject_list', {
            locals : {subjects : subjects}
        });
    };
    
    var client = TakkenUtil.getMySQLClient();
    
    SubjectDB.getAll(client, res, doResponce);
}

module.exports.responseQuestions = function (req, res) {    

    if (!check(req, res, './index')) {
        return;
    }
    
    var doResponse = function (res, questions) {
        res.render('question_list', {
            locals : {questions : questions}
        });
    };
    
    var client = TakkenUtil.getMySQLClient();
    
    var subject = req.query.subject;
    
    var tasks = [
        function(callback) {

            try {
                var client = takkenUtil.getCoreClient();
                
            } catch (e) {
                callback(e);
                return;                     
            }
         
            var cache = {};
            
            callback(null, client, cache, subject);
        },
        function(callback, client, cache, subject) {
            CategoryDB.getArray(client, cache, callback, subject);   
        },
        function(callback, client, cache, subject) {
            QuestionDB.getArray(client, cache, callback, subject);   
        },
        function(callback, client, cache, subject) {
            
            client.end();
            
            res.render('question_list', {
                locals : {
                    subject    : subject,
                    categories : cache.categories,
                    questions  : cache.questions}
            });
        }
    ];
    
    var errorHandle = function (err) {

        if (client != null) {
            client.end();
        }

        logger.error(err);
    };
    
    async.waterfall(tasks, errorHandle);
}