var db = require('orchestrate')('6975512f-cc93-4fc7-97f8-bdfed8ed8b56');
var Q = require('q');

Location = {
  all: function(callback) {
    var locations = 
      ["The Hatchery", "Hood River Event Site", "Rock Creek", "Doug's Beach", "Rufus", 
      "Roosevelt", "Viento", "Stevenson", "Lyle Sand Bar", "Rooster Rock"];

    var promises = locations.map(function(item) {
      return db.get("current", item).then(function(result) {
        var data = result.body;
        return {
          "location" : data.name,
          "icon" : data.icon,
          "time" : data.hour,
          "windSpeed" : data.windSpeed,
          "windDirection": data.windDirection,
          "windBearing" : data.windBearing,
          "temperature" : data.temperature,
          "summary" : data.summary
        };
      });
    });

    Q.all(promises).done(callback);
  }
}

module.exports = Location;

