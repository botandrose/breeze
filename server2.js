var http = require('http');
var express = require('express');
var request = require('request');

var app = express();

var port = 9090;
var latLong = "45.5330,-122.6894";
var apiKey = "b29b1a2fe58b21195f270ab3d6dd1be8";
var url = 'https://api.forecast.io/forecast/';

url += apiKey + '/' + latLong;

app.use(express.bodyParser());

request(url, function (err, apiRes, body){
	var data = JSON.parse(body);
	//console.log(data);	
	formatData(data);
});

// %.getJSON(url).done(formatData)
// .fail(function() {
// 	$('#loading-message').text('Your data failed to load and its your fault');
// });
function WindInstance(windSpeed, windBearing, icon, time){
	this.windSpeed = windSpeed;
	this.windBearing = windBearing;
	this.icon = icon;
	this.time = time;
};


function formatData(data){
	var current = data.currently;

	var daily = data.daily.data;
	var hourly = data.hourly.data;	
	// console.log('CURRENT::::::::::::::');
	// console.log(current);
	// console.log('DAILY:::::::::::::::::');
	// console.log(daily.data);
	// console.log('HOURLY::::::::::::::::');
	// console.log(hourly.data);

	var currentWind = new WindInstance(
		current.windSpeed, current.windBearing, 
		current.icon, current.time);
	console.log("NEW CURRENT WINDINSTANCE:");
	console.log(currentWind.toString());

	var dailyWind = [];
	daily.forEach(function (day){
		dailyWind.push(new WindInstance(
			day.windSpeed, day.windBearing,
			day.icon, day.time));
	})
	console.log("NEW DAILY WINDINSTANCE:");
	console.log (dailyWind);

	//////////////

	var hourlyWind = [];
	hourly.forEach(function (hour){
		hourlyWind.push(new WindInstance(
			hour.windSpeed, hour.windBearing,
			hour.icon, hour.time));
	})
	console.log("NEW HOURLY WINDINSTANCE:");
	console.log (hourlyWind);

};

// function startServer(data){
// 	http.createServer(app, function (clientReq, myResp){
// 		var fresh = true;
// 	}

// }

// app.get(url, function(req, res) {
// 	res.end()
// }) 


