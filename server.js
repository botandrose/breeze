

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
var db = require('orchestrate')('6975512f-cc93-4fc7-97f8-bdfed8ed8b56');
var moment = require('moment-timezone');
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
var locationNames= 
  ["The Hatchery", "Hood River Event Site", "Rock Creek", "Doug's Beach", "Rufus", 
  "Roosevelt", "Viento", "Stevenson", "Lyle Sand Bar", "Rooster Rock"];

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



function getGraphData48hr (location){
  db.get('current', 'hourlyGraph')
  .then(function(result){
    var graphData = result.body[location];
    //Arcy use your graph data here an array called graphData
    console.log(graphData);    
  })
  .fail(function(err){
    console.error(err);
  })
};

getGraphData48hr("The Hatchery");
//Arcy make calls for our data here, with location name

//We will probably push to Orchestrate
function output () {

  locationNames.forEach( function(item, index) {
    var currentConditions;
    db.get("current", item)
    .then(function (result) {
      var data = result.body;
      //console.log("data: ", data);
      currentConditions = { "location" : data.name,
                              "icon" : data.icon,
                              //"latitude" : data.latitude,
                              //"longitude" : data.longitude,
                              "time" : data.currentTime,
                              "windSpeed" : data.windSpeed,
                              "windDirection": data.windDirection,
                              "windBearing" : data.windBearing,
                              "temperature" : data.temperature,
                              "summary" : data.summary };
      JSON.stringify(currentConditions);

      //Might need comma's between JSON objects

      //console.log('CURRENT: ', currentConditions);

      newOutputArray.push(currentConditions);
    })
    .fail(function (err) {
      console.error(err);
    }) 
  });
}


//***Launch app by sending index.html to the browser ***
app.get('/', function(req, res){
  res.sendfile('./index.html');
});


//***Send data from the server to browser
app.get('/data', function(req, res){
  res.json(newOutputArray);
});



//***Standard Express Server Call
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



// app.get('/data', function (req, res) {
//   db.get((ourKey), function (err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(data);
//       res.json(data);
//     }
//   });
// });

