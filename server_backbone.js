

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var https = require('https');
var path = require('path');
var pushToOrchestrate = require('./pushToOrchestrate');
//var request = require('request');
//var level = require('level');

var app = express();
//var db = level('./dData', { valueEncoding: 'json'});

//Forecast.io URL and login information
var latLong = "45.5118,-122.6756";
var apiKey = "a75c248d7b83806b66b281dd33e96e36";
//var apiKey = "0d6f859a9a370c9ca1e274fe79d23d8e"; //Current key

var locations = ["45.722,-121.561",
                 "45.716,-121.512",
                 "45.687,-121.404",
                 "45.676,-121.235",
                 "45.694,-120.755",
                 "45.729,-120.226",
                 "45.701,-121.668",
                 "45.693,-121.878",
                 "45.696,-121.296",
                 "45.552,-122.226"];

var locationsLength = locations.length + 1;
var forecastURL ='https://api.forecast.io/forecast/';

var newOutputArray = [];
var counter = 0;      //Might be replaced by promises
var asyncArray = [];  //Might be replaced by promises

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);



//Async file transfer for the calls to different locations
for (var i = 0; i < locations.length; i++){
  var location = locations[i];
  var urlToFetch = forecastURL + apiKey + '/'+ location;
  httpFunction(urlToFetch, i);
}

function httpFunction (urlToFetch, index) {

  https.get(urlToFetch, function (resp) {
      //One way to work with the stream is with event handlers: data, error, end
      var body = '';

      //When the stream emits a data event
      resp.on('data', function (chunk) {
        //console.log(chunk.toString());
        body += chunk;
      });

      resp.on('error', function (err){
        console.error(err);
      });

      resp.on('end', function () {
        counter += 1;
        asyncArray[index] = body;
        if (counter === locations.length) {
          output();
          pushToOrchestrate(asyncArray);
        }
      });
  });
}

//We will probably push to Orchestrate
function output () {
  asyncArray.forEach( function(item, index) {
    //console.log(JSON.parse(item));
    
    //Send the data as a separate JSON object
    var data = JSON.parse(item);
    var currentTime = new Date(data.currently.time * 1000);
    var latLoc = data.latitude.toString();
  


    var currentConditions = { "location" : location(latLoc.slice(3,7)),
                              "latitude" : data.latitude,
                              "longitude" : data.longitude,
                              "time" : currentTime.toString(),
                              "windSpeed" : Math.round(data.currently.windSpeed),
                              "windBearing" : Math.round(data.currently.windBearing),
                              "temperature" : Math.round(data.currently.temperature),
                              "summary" : data.currently.summary };

    JSON.stringify(currentConditions);

    //Might need comma's between JSON objects

    console.log(currentConditions);

    newOutputArray.push(currentConditions);


  });

  function location (latitude) {
    var name = "";

    switch(latitude) {
      case "722":
         return name = "The Hatchery";
      case "716":
         return name = "Hood River Event Site";
      case "687":
        return name = "Rock Creek";
      case "676":
         return name = "Doug's Beach";
      case "694":
        return name = "Rufus";
      case "729":
         return name = "Roosevelt";
      case "701":
        return name = "Viento";
      case "693":
        return name = "Stevenson";
      case "696":
        return name = "Lyle Sand Bar";
      case "552":
        return name = "Rooster Rock";
      default:
         return name = "default";
    }   
  }

  //***Standard Express Server Call
  if(!module.parent) {
      http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  }
}

//***Launch app by sending index.html to the browser ***
app.get('/', function(req, res){
  res.sendfile('./index.html');
});

//***Send data from the server to browser
app.get('/data', function(req, res){
  res.json(newOutputArray);
});

module.exports = app;
