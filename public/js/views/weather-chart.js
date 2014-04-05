define(function (require) {
  var Thorax = require('thorax');
  var weatherTemplate = require('hbs!templates/all-weather');
  var d3 = require('d3');
  var _ = require ('underscore');

  var AllWeatherView= Thorax.View.extend({
    el: '#canvas',
    initialize: function () {
      
      this.render();
      var x = d3.scale.linear();
    },

    template: weatherTemplate

  });
  return AllWeatherView;
});