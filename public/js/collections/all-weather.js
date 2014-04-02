define(function (require) {
  var Thorax = require('thorax');
  var Weather = require('models/weather');

  var AllWeather = Thorax.Collection.extend({
    model: Weather
  });

  return AllWeather;

});