var fcgiApp = require('./fcgi');
var express = require('express');
// var routes = require('./routes');

var TakkenUtil = require("./lib/takken_util");
var logger = TakkenUtil.getLogger();
var SecurityUtil = require('./lib/security_util');

var responseJson = require("./lib/response_json");
var clientService = require('./client_service');

var app = express.createServer();

app.configure(function() {
    app.set('view options', {layout : false});
    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'your secret',
        cookie: { maxAge: 3 * 60 * 60 * 1000,
                  httpOnly: false
                }
    }));
    app.use(app.router);
    app.use(express.static('./public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

var doDownload = function (req, res) {
    
    var command = SecurityUtil.encode(req.query.message);

    if (command != 'requestData') {
        return;
    }

    setTimeout(function() {

        try {
            
            responseJson.execute(req, res);
            
        } catch (e) {
            logger.error(e.stack);
            res.writeHead(200, {"Content-type": "text/html"});
            res.end(e.stack);
        }
  
    }, 1000);
    //throw new Error("Bollocks.");
};

app.all('/', doDownload());
app.all('/download', doDownload());

app.get('/index', function (req, res) {
    res.render('index');
});

app.get('/login', function (req, res) {
    clientService.login(req, res);
});
app.get('/logout', function (req, res) {
    clientService.logout(req, res);
});

app.get('/subject_list', function (req, res) {
    clientService.responseSubjects(req, res);
});

app.get('/question_list', function (req, res) {
    clientService.responseQuestions(req, res);
});

// Instead of this:
app.listen(12345);

// You do this:
//fcgiApp.handle(app);

