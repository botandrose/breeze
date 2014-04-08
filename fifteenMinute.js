// var express = require('express');
// var routes = require('./routes');
//var user = require('./routes/user');
// var http = require('http');
var https = require('https');
var path = require('path');
var pushToOrchestrate = require('./pushToOrchestrate');

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

var newOutputArray;
var counter = 0;      //Might be replaced by promises
var asyncArray = [];  //Might be replaced by promises

var fifteenMinutes = function () {

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

              pushToOrchestrate(asyncArray);

            }
          });
      });
    }



    console.log('When running Jake, if this file prints, Jake is referencing fifteenMinute.js');

}

fifteenMinutes();

module.exports = fifteenMinutes;


