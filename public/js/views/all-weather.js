define(function (require) {
  var Thorax = require('thorax');
  var weatherTemplate = require('hbs!templates/all-weather');

  var AllWeatherView= Thorax.View.extend({
    el: '#canvas',
    initialize: function () {
      
      this.render();
    },

    template: weatherTemplate

  });
  return AllWeatherView;
});