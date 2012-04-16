
var async = require('async');

var TakkenUtil = require('./lib/takken_util');
var logger = TakkenUtil.getLogger();
var SecurityUtil = require('./lib/security_util');

var JsonResponder = require('./lib/response_json');

var UserDB = require('./lib/user_db');
var SubjectDB = require('./lib/subject_db');
var CategoryDB = require('./lib/category_db');
var QuestionDB = require('./lib/question_db');
var SentenceDB = require('./lib/sentence_db');

module.exports.login = function (req, res) {
    
    var res_error = function (mes) {
        res.render('index', {
            locals : { message : mes }
        });
    };

    var userId = req.param('user_id');
    var password = req.param('password');

    if (!userId) {
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
                req.session.userId = user.id;
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

module.exports.logout = function (req, res) {

    if (req.session.login) {
        delete req.session.login;
        delete req.session.userId;
    }
 
    res.render('index', {
        locals : {message : 'Dont login. Please login again.'}
    });
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

    if (!check(req, res, 'index')) {
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

var JsonResponder = require('./lib/response_json');

module.exports.respondAllData = function respondAllData(req, res) {
    
    var command = SecurityUtil.encode(req.query.message);

    if (command != 'requestData') {
        return;
    }

    doResponder = function() {

        try {
            
            JsonResponder.execute(req, res);
            
        } catch (e) {
            logger.error(e.stack);
            res.writeHead(200, {"Content-type": "text/html"});
            res.end(e.stack);
        }
    };

    setTimeout(doResponder, 1000);
}

module.exports.respondQuestions = function (req, res) {    

    if (!check(req, res, './index')) {
        return;
    }
    
    var client;
    
    var subject = req.query.subject;
    
    var tasks = [
        function(callback) {

            try {
                client = takkenUtil.getCoreClient();
                
            } catch (e) {
                callback(e);
                return;                     
            }
         
            var cache = {};
            
            callback(null, client, cache, subject);
        },
        function(callback, client, cache, subject) {
            CategoryDB.pushTo(client, callback, subject, cache);   
        },
        function(callback, client, cache, subject) {
            QuestionDB.pushTo(client, callback, subject, cache);   
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

module.exports.respondQuestion = function (req, res) {    

    if (!check(req, res, 'index')) {
        return;
    }
    
    var subject = req.query.subject;
    var category = req.query.category;
    var term = req.query.term;
    var number = req.number;

    var client;

    var cache = {};
    
    var tasks = [
        function(callback) {

            try {
                client = takkenUtil.getCoreClient();
                
            } catch (e) {
                callback(e);
                return;                     
            }
            
            callback(null, client, cache);
        },
        function(callback, client, cache) {
            QuestionDB.pushTo(client, callback, subject, category, term, number, cache);   
        },
        function(callback, client, cache) {
            SentenceDB.pushTo(client, callback, subject, category, term, number, cache);   
        },
        function(callback, client, cache) {
            
            client.end();
            
            res.render('question', {
                locals : {
                    message   : "",
                    question  : cache.question,
                    sentences : cache.sentences}
            });
        },
    ];
    
    var errorHandle = function (err) {

        if (client != null) {
            client.end();
        }

        logger.error(err);
    };
    
    async.waterfall(tasks, errorHandle);
}

module.exports.updateQuestion = function (req, res) {    

    if (!check(req, res, 'index')) {
        return;
    }
    
    var number;
    number = req.param("question.number1") ? 1 : 0;
    number = req.param("question.number2") ? 2 : number;
    number = req.param("question.number3") ? 3 : number;
    number = req.param("question.number4") ? 4 : number;
    
    var question = {
        subject    : req.param("question.subject"),
        category   : req.param("question.category"),
        term       : req.param("question.term"),
        number     : req.param("question.number"),
        sentence   : req.param("question.sentence"),
        answer     : number,
        enabled    : req.param("question.enabled")
    };
    
    var sentences = [];
    
    var length = req.param("sentences.length");
    for (var i = 0; i < length; i++) {

        var c = req.param("sentence_" + i + ".correct_yes") ? true : false;
        
        var sentence = {
            subject   : req.param("question.subject"),
            category  : req.param("question.category"),
            term      : req.param("question.term"),
            number    : req.param("question.number"),
            index     : i,
            type      : req.param("sentence_" + i + ".type"),
            sentence  : req.param("sentence_" + i + ".sentence"),
            correct   : req.param("sentence_" + i + ".correct_yes") ? true : false,
            yesno     : req.param("sentence_" + i + ".yesno"),
            desc      : req.param("sentence_" + i + ".desc"),
            desc_font : "",
            desc_time : new Date(),
            desc_user : req.session.user
        };
        
        sentences.push(sentence);
    }

    var client;

    var cache = {};
    
    var tasks = [
        function(callback) {

            try {
                client = takkenUtil.getCoreClient();
                
                client.startTrans();
                
            } catch (e) {
                callback(e);
                return;                     
            }
            
            callback(null, client);
        },
        function(callback, client) {
            QuestionDB.update(client, callback, question);   
        },
        function(callback, client) {
            
            for (var i = 0; i < sentences.length; i++) {
                SentenceDB.update(client, callback, sentences[i]);
            }   
        },
        function(callback, client) {
            
            client.commit();
            
            callback(null, client);  
        },
        function(callback, client) {
            
            client.end();
            
            res.render('question', {
                locals : {
                    message   : "Update Completed!",
                    question  : question,
                    sentences : sentences}
            });
        }
    ];
    
    var errorHandle = function (err) {

        client.rollback();

        if (client != null) {
            client.end();
        }

        logger.error(err);
    };
    
    async.waterfall(tasks, errorHandle);
}