var db = require('orchestrate')('6975512f-cc93-4fc7-97f8-bdfed8ed8b56');
//var db = require('orchestrate')('893352c5-f1bf-4a27-b61c-31f646586c30');//sean's test DB
var moment = require('moment');

var pushToOrchestrate = function (arrayOfLocations){

  arrayOfLocations.forEach(function(item, index) {

    var data = JSON.parse(item);

    function WindInstance(wind, data) {
      this.name = nameLocation(data.latitude.toString().slice(3,7));
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.temperature = wind.temperature;
      this.windSpeed = wind.windSpeed;
      this.windBearing = wind.windBearing;
      this.windDirection = labelDirection(wind.windBearing);
      this.icon = wind.icon;
      this.time = moment.unix(wind.time);
      this.day = moment.unix(wind.time).format("M/D ddd")
      this.hour = moment.unix(wind.time).format("ddd hA");

    };

    function LocationInstance(currentInstance, dailyInstance, hourlyInstance){
      this.current = currentInstance;
      this.daily = dailyInstance;
      this.hourly = hourlyInstance;
    };

    var current = data.currently; //current data
    //var latID = data.latitude.toString().slice(3,7); //our lat to ID with	
    var daily = data.daily.data; //daily forecast
    var hourly = data.hourly.data;  //hourly forecast

    var currentWind = new WindInstance(current, data);
   
    

    var dailyWind = [];
    daily.forEach(function (day){
      day.temperature = day.temperatureMax;
      dailyWind.push(new WindInstance(day, data));
    });


    var hourlyWind = [];
    hourly.forEach(function (hour){
      //hour.temperature = temperatureMax;
      hourlyWind.push(new WindInstance(hour, data));
    });

    var locationInstance = new LocationInstance(currentWind, dailyWind, hourlyWind);
    
    db.get('current', currentWind.name)
    .then(function (result) {

      var dbMintuteStamp = moment(currentWind.time).format("h.mm").slice(0,-1) + moment(currentWind.time).format("a");
      //console.log("puting to historic-today: ", dbMintuteStamp);
      db.put('historic-today', currentWind.name + dbMintuteStamp, result.body);
      db.put('current', currentWind.name, currentWind);
    })
    .fail(function (err) {
      console.error(err);
    })
    
    
    db.put("Locations", currentWind.name, locationInstance);
    //db.put("HistoricToday", , currentWind);
  });
  

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

var labelDirection = function (windBearing){
    var directions = {0: 'N', 1: 'NNE', 2: 'NE', 3: 'ENE', 4: 'E', 5: 'ESE', 6: 'SE', 7: 'SSE', 8: 'S',
        9: 'SSW', 10: 'SW', 11: 'WSW', 12: 'W', 13: 'WNW', 14: 'NW', 15: 'NNW', 16: 'N' };
    var windDirection = directions[Math.floor((windBearing+11.25)/22.5)];
    return windDirection;
}


module.exports = pushToOrchestrate;