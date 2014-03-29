/**
* Module dependencies.
*/

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var https = require('https');
var path = require('path');
var moment = require('moment');
//var request = require('request');
//var level = require('level');

var app = express();
//var db = level('./dData', { valueEncoding: 'json'});

//Forecast.io URL and login information
var latLong = "45.5118,-122.6756";
var apiKey = "a75c248d7b83806b66b281dd33e96e36";
//var apiKey = "0d6f859a9a370c9ca1e274fe79d23d8e"; //Current key
var url ='https://api.forecast.io/forecast/';

url += apiKey + '/'+ latLong;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
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

app.get('/', routes.index);
app.get('/users', user.list);


//****This text to terminal from Forecast.io
//request(url).pipe(process.stdout);

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
//****End

//***Outputs a JSON object from Forecast.io to the terminal
// request(url, function (err, resp, body) {

//   http.createServer(app).listen(app.get('port'), function(req, resp){
//     console.log('Express server listening on port ' + app.get('port'));

//      var data = JSON.parse(body);

//      console.log(data);
//   });
// });
//****End



//****Test for multiple locations
// var locations = ["45.722,-121.561",
//                  "45.716,-121.512",
//                  "45.687,-121.404" ];

// //var locations = ["45.5118,-122.6756"];

// var forecastURL ='https://api.forecast.io/forecast/';

// locations.forEach( function (item, index) {

//   newUrl = forecastURL + apiKey + '/'+ item;

//   request(newUrl, function (err, resp, body) {

//       http.createServer(app).listen(app.get('port'), function(req, resp){
//         console.log('Express server listening on port ' + app.get('port'));

//          var data = JSON.parse(body);

//          //console.log(data);
//          console.log(index);

//         //Turn off the server at the end loop
//         process.exit();

//         //Async data
//         //It only prints out the current server call rather than all of them?

//       });
//   });
 
// });
//***End Test for multiple locations






//****LearnYouNode Async example lesson 9 might fix closure issue
//For multiple location requests
var counter = 0;
var asyncArray = [];
// var locations = ["45.722,-121.561",
//                  "45.716,-121.512",
//                  "45.687,-121.404" ];

var locations = ["45.722,-121.561",
                "45.716,-121.512",
                "45.687,-121.404",
                "45.676,-121.235",
                "45.694,-120.755",
                "45.729,-120.226",
                "45.701,-121.668",
                "45.693,-121.878",
                "45.552,-122.226",
                 ];
var locationsLength = locations.length + 1;

var forecastURL ='https://api.forecast.io/forecast/';

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
       if (counter === 9) {
         output();
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
   //var currentTime = data.currently.time;

   var latLoc = data.latitude.toString();

   //console.log(data.currently);
   //console.log(data.currently.windSpeed);
   //console.log(data.longitude);
   console.log("Name: " + location(latLoc.slice(3,7)) + "\n" +
               "Latitude: " + data.latitude + " degrees" + "\n" +
               "Longitude: " + data.longitude + " degrees" + "\n" +
               "Time: " + currentTime.toString() + "\n" +  
               "Wind Speed: " + data.currently.windSpeed + " mph" + "\n" +
               "Wind Bearing: " + data.currently.windBearing + " degrees" + "\n" +
               "Temperature: " + data.currently.temperature + " degrees" + "\n" +
               "Summary: " + data.currently.summary + "\n");

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
     case "552":
       return name = "Rooster Rock";
     default:
        return name = "default";
   }   
 }
}

//****End Example

//Revised Locations with all 9 values
// var locations = ["45.722,-121.561",
//                  "45.716,-121.512",
//                  "45.687,-121.404",
//                  "45.676,-121.235",
//                  "45.694,-120.755",
//                  "45.729,-120.226",
//                  "45.700,-121.668",
//                  "45.693,-121.878",
//                  "45.552,-122.226"
//                   ];

//***Standard Express Server Call
// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });


//express projectName
//remove html from layout.jade
//npm install
//npm install level
//npm install request