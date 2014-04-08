var db = require('orchestrate')('6975512f-cc93-4fc7-97f8-bdfed8ed8b56');
//var db = require('orchestrate')('893352c5-f1bf-4a27-b61c-31f646586c30');//sean's test DB
var moment = require('moment-timezone');
//moment().tz("

var pushToOrchestrate = function (arrayOfLocations){

  var graphHourlyObject = {};
  arrayOfLocations.forEach(function(item, index) {

    var data = JSON.parse(item);

    function WindInstance(wind, data) {
    //all the data we are interested in formatted for easy use
      this.name = nameLocation(data.latitude.toString().slice(3,7));
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.temperature = wind.temperature;
      this.windSpeed = wind.windSpeed;
      this.windBearing = wind.windBearing;
      this.windDirection = labelDirection(wind.windBearing);
      this.icon = makeIconPath(wind.icon);
      this.summary = wind.summary;
      this.currentTime = moment.unix(wind.time).tz("America/Los_Angeles").format('M/D hA mm');
      this.day = moment.unix(wind.time).format("M/D ddd")
      this.hour = moment.unix(wind.time).format("ddd hA");
      //different time formats for ease of use

    };

    function HistoricInstance(instance) {
    //reduced amount of data for an instance to store in out history
      this.temperature = instance.temperature;
      this.windSpeed = instance.windSpeed;
      this.windDirection = instance.windDirection;
      this.time = instance.hour;
    };

    function LocationInstance(currentInstance, dailyInstance, hourlyInstance){
    //Everything we need for one location  
      this.current = currentInstance;
      this.daily = dailyInstance;
      this.hourly = hourlyInstance;
    };

    function ForecastGraphData(wind){
      this.time = moment.unix(wind.time).format("ddd hA");
      this.temperature = wind.temperature;
      this.windSpeed = wind.windSpeed;
      this.windBearing = wind.windBearing;
    }

   //  var windForecast = [];

   // for ( var i = 0; i < 47; i++) {
   //  var forecastTime = new Date(data.hourly.data[i].time * 1000);
   //  var forecastConditions = {  "time": forecastTime.toString(),
   //                              "temperature" : data.hourly.data[i].temperature,
   //                              "windSpeed" : data.hourly.data[i].windSpeed,
   //                              "windBearing" : data.hourly.data[i].windBearing };

   //  windForecast.push(forecastConditions);
   //  console.log(forecastConditions);
   // }

    var current = data.currently; //current data
    var daily = data.daily.data; //daily forecast
    var hourly = data.hourly.data;  //hourly forecast

    var currentWind = new WindInstance(current, data);
    //new wind instance of the current wind for location
   
    var dailyWind = [];
    //building an array of seven days for location
    daily.forEach(function (day){
      day.temperature = ((day.temperatureMax+day.temperatureMin)/2).toFixed(1);
      dailyWind.push(new WindInstance(day, data));
    });


    var hourlyWind = [];
    //building an array of 48 hrs for location

    var graphHourlyArray = [];
    //and data need for graph
    hourly.forEach(function (hour){
      graphHourlyArray.push(new ForecastGraphData(hour));
      hourlyWind.push(new WindInstance(hour, data));
    });
    
    graphHourlyObject[currentWind.name] = graphHourlyArray;

    var locationInstance = new LocationInstance(currentWind, dailyWind, hourlyWind);
    //one instance of location containing all current and future info
    
    db.get('current', currentWind.name)
    .then(function (result) {
    //getting 15min old data to store as historic, before being overwritten

      var dbTimeStamp = moment(currentWind.time).format("h.mm").slice(0,-1) + moment(currentWind.time).format("a");
      //creating a timestamp to add to key. All keys in historic data will be location names
      //plus the hour.first digit of minute with am or pm
      //Ex. 4:32 pm at the 'Rufus' will have key of Rufus4.3pm

      var historicInstance = new HistoricInstance(result.body);
      //reducing the current data to the data only relevant to our historical needs

      db.put('historic-today', currentWind.name + dbTimeStamp, historicInstance);
      //building history for the day as the day goes on in collection 'historic-today'

      db.put('current', currentWind.name, currentWind);
      //once we have added our historic date, we over write the 'current' with update info
    })
    .fail(function (err) {
      console.error(err);
    })
    
    db.put("locations", currentWind.name, locationInstance);
    //pushing entire location instance of current and forecast for location
  });
  db.put("current", "hourlyGraph", graphHourlyObject);

};

function nameLocation (latitude) {
//arcy's function that takes the last few digits in latitude to label the location with name
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
//this function converts windBearing to a wind direction string such as 'NNE'
    var directions = {0: 'N', 1: 'NNE', 2: 'NE', 3: 'ENE', 4: 'E', 5: 'ESE', 6: 'SE', 7: 'SSE', 8: 'S',
        9: 'SSW', 10: 'SW', 11: 'WSW', 12: 'W', 13: 'WNW', 14: 'NW', 15: 'NNW', 16: 'N' };
    var windDirection = directions[Math.floor((windBearing+11.25)/22.5)];
    return windDirection;
}

var makeIconPath = function(icon){
  icon += ".png'";
  var iconSize = " height='64' width='64' align='left'>";
  return  "<img src = 'js/images/" + icon + iconSize;
}


module.exports = pushToOrchestrate;