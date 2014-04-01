define(function (require) {
  var $ = require('jquery');
  var Thorax = require('thorax');
  var AllScoresView = require('views/all-scores');
  var ScoresCollect = require('collections/all-scores')     

  var app = {};

  $.getJSON('/users')
   .done(startup)
   .fail(function () {
      $('#loading').html('Your data failed to load :(');
   });
  
  function startup (data) {
    console.log(data);
    $('#loading').html('');

    var scoresCollect = new ScoresCollect(data);
    var allScoresView = new AllScoresView({collection: scoresCollect});

    var router = new (Backbone.Router.extend({
      
      routes: {
        '': allScoresView
      },
      start: function () {
        Backbone.history.start({pushState: true});
      }
    }));

    router.start()

    app.collection = scoresCollect;

  }

  window.app = app;

});