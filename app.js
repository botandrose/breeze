var express = require('express');
var path = require('path');

var Location = require('./location');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//***Launch app by sending index.html to the browser ***
app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

//***Send current conditions data from the server to browser
app.get('/data', function(req, res){
  Location.all(function(locations) {
    res.json(locations);
  });
});

module.exports = app;

