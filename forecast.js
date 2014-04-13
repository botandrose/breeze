var https = require('https');
var pushToOrchestrate = require('./pushToOrchestrate');

var Forecast = {
  import: function() {
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

    //Forecast.io URL and login information
    var apiKey = "0d6f859a9a370c9ca1e274fe79d23d8e"; //Current key
    var forecastURL ='https://api.forecast.io/forecast/';

    var counter = 0;      //Might be replaced by promises
    var asyncArray = [];  //Might be replaced by promises

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
            pushToOrchestrate(asyncArray);
          }
        });
      });
    }
  }
}

module.exports = Forecast;

