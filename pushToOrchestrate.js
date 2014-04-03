var db = require('orchestrate')('6975512f-cc93-4fc7-97f8-bdfed8ed8b56');

var pushToOrchestrate = function (arrayOfLocations){

  arrayOfLocations.forEach(function(item, index) {

    var data = JSON.parse(item);

    function WindInstance(name, windSpeed, windBearing, icon, time, windDirection){
      this.name = name;
      this.windSpeed = windSpeed;
      this.windBearing = windBearing;
      this.icon = icon;
      this.time = time;
      this.windDirection = windDirection;

    };

    function LocationInstance(currentInstance, dailyInstance, hourlyInstance){
      this.current = currentInstance;
      this.daily = dailyInstance;
      this.hourly = hourlyInstance;
    };

    function nameLocation (latitude) {
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
        case "696":
          return name = "Lyle Sand Bar";
        case "552":
          return name = "Rooster Rock";
        default:
           return name = "default";
      };
    };
    var current = data.currently; //current data
    var latitude = data.latitude.toString().slice(3,7); //our lat to ID with	
    var daily = data.daily.data; //daily forecast
    var hourly = data.hourly.data;  //hourly forecast

    var currentWind = new WindInstance(
      nameLocation(latitude),
      current.windSpeed, current.windBearing, 
      current.icon, current.time, 
      labelDirection(current.windBearing));
   
    db.put('current', currentWind.name, currentWind);

    var dailyWind = [];
    daily.forEach(function (day){
      dailyWind.push(new WindInstance(
      	nameLocation(latitude),
        day.windSpeed, day.windBearing,
        day.icon, day.time, 
        labelDirection(day.windBearing)));
    });


    var hourlyWind = [];
    hourly.forEach(function (hour){
      hourlyWind.push(new WindInstance(
      	nameLocation(latitude),
        hour.windSpeed, hour.windBearing,
        hour.icon, hour.time, 
        labelDirection(hour.windBearing)));
    });

    var locationInstance = new LocationInstance(currentWind, dailyWind, hourlyWind);

    db.put("Locations", currentWind.name, locationInstance);
  });
  

};

var labelDirection = function (windBearing){
    var directions = {0: 'N', 1: 'NNE', 2: 'NE', 3: 'ENE', 4: 'E', 5: 'ESE', 6: 'SE', 7: 'SSE', 8: 'S',
        9: 'SSW', 10: 'SW', 11: 'WSW', 12: 'W', 13: 'WNW', 14: 'NW', 15: 'NNW', 16: 'N' };
    var windDirection = directions[Math.floor((windBearing+11.25)/22.5)];
    return windDirection;
}


module.exports = pushToOrchestrate;