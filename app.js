var fcgiApp = require('./fcgi');
var express = require('express');
// var routes = require('./routes');

var ClientService = require('./client_service');

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

var respondAllData = function (req, res) {
    ClientService.respondAllData(req, res);  
};

app.all('/', respondAllData);
app.all('/download', respondAllData);

app.all('/index', function (req, res) {
    res.render('index');
});

app.all('/login', function (req, res) {
    ClientService.login(req, res);
});
app.all('/logout', function (req, res) {
    ClientService.logout(req, res);
});

app.all('/subject_list', function (req, res) {
    ClientService.respondSubjects(req, res);
});

app.all('/question_list', function (req, res) {
    ClientService.respondQuestions(req, res);
});
app.all('/question', function (req, res) {
    ClientService.respondQuestion(req, res);
});
app.all('/question_update', function (req, res) {
    ClientService.updateQuestion(req, res);
});

// Instead of this:
app.listen(12345);

// You do this:
//fcgiApp.handle(app);

