var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var mongo = require('mongoskin').db(process.env.MONGOLAB_URI);
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.enable('trust proxy');
app.use(express.static(path.join(__dirname, 'public')));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());       // to support JSON-encoded bodies

app.get('/', routes.home);
app.get('/market', routes.market)
app.get('/admin', routes.admin)
app.get('/myaccount', routes.myaccount)
app.get('/signup', routes.signup)
app.post('/genLog', function(req, res){
    mongo.collection('testData').insert({ 
        _id: req.body._id, 
        time: req.body.time, 
        date: req.body.date}, 
        function (err, result) {
            if (err) res.status(500).send(req.body);
            if (result) res.status(200).send('OK');
    });
});
app.post('/userLog', function(req, res){
    mongo.collection('testUsers').insert({ 
        _id : req.body._id,
        uid : req.body.user,
        ip  : req.ip, 
        time: req.body.time, 
        date: req.body.date}, 
        function (err, result) {
            if (err) res.status(500).send(req.body);
            if (result) res.status(200).send('OK');
    });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
