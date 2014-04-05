define(function (require) {
  var $ = require('jquery');
  var Thorax = require('thorax');
  var AllWeatherView = require('views/all-weather');
  var WeatherCollection = require('collections/all-weather')  

  var ChartView = require('views/weather-chart');   

  var app = {};

  $.getJSON('/data')
   .done(startup)
   .fail(function () {
      $('#loading').html('The data failed to load :(');
   });
  
  function startup (data) {
    //Output to the data to make sure it is sent from the server to the browser
    console.log(data);
    $('#loading').html('');

    app.data = data;

    //Create a new collection based on the weather model
    var weatherCollection = new WeatherCollection(data);

    //Create a new view based on the weatherCollection
    var allWeatherView = new AllWeatherView({collection: weatherCollection});

    //Output the collection to test
    console.log(weatherCollection);

    app.collection = weatherCollection;



    //***D3 chart test we might want to make a JSON file
    var chartWeatherView = new ChartView({collection: weatherCollection});

    //Instantiate a new instance of a router to display the view
    var router = new (Backbone.Router.extend({
      
      routes: {
        '': allWeatherView
      },
      start: function () {
        Backbone.history.start({pushState: true});
      }
    }));

    router.start()



  }

  window.app = app;

});
