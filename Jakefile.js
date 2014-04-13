var Location = require("./location");
var Forecast = require("./forecast");

desc('import location data from forecast.io');
task('import', function() {
  Forecast.import();
});

