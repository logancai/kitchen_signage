$(function(){

    /* Configuration */

    var DEG = 'f';  // c for celsius, f for fahrenheit
    var API_key = 'YOUR_API_KEY';
    var id = '5391959'; //actually, it's a city ID

    var weatherDiv = $('#weather'),
        weatherIcon = $("#weather-icon"),
        weatherText = $("#weather-text");

	locationSuccess("5391959");
	var interval = 1000*60*5;//Every 5 minutes refresh
	setInterval (function(){locationSuccess("5391959");}, interval);

    function locationSuccess(position) {

        try{

            // Retrive the cache
            if(localStorage.weatherCache === undefined){
            	var cache = null;
            }
            else{
            	var cache = JSON.parse(localStorage.weatherCache);
            }
            var d = new Date();

            // If the cache is newer than 30 minutes, use the cache
            if((cache && cache.timestamp) && (cache.timestamp > (d.getTime() - 30*60*1000))){
            	var string = "";
            	string = string + convertTemperature(cache.data.main.temp) + '&#176;F ' + cache.data.weather[0].main;
            	if ((cache.data.weather[0].id > 200 && cache.data.weather[0].id < 700) || (cache.data.weather[0].id > 900)){
            		string = string + " " + cache.data.weather[0].description;
            	}
            	weatherText.html(string);
            	weatherIcon.attr('src','img/weather/'+ cache.data.weather[0].icon +'.svg');
            }

            else{

                // If the cache is old or nonexistent, issue a new AJAX request
                //5391959
                // var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?zip='+zipcode+',us&APPID='+API_key;
                var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?id='+position+'&APPID='+API_key;

                $.getJSON(weatherAPI, function(response){
                    // Store the cache
                    localStorage.weatherCache = JSON.stringify({
                        timestamp:(new Date()).getTime(),   // getTime() returns milliseconds
                        data: response
                    });

                    // Call the function again
                    locationSuccess(position);
                });
            }

        }
        catch(e){
            // showError("We can't find information about your city!");
            // window.console && console.error(e);
        }
    }

    function convertTemperature(kelvin){
        // Convert the temperature to either Celsius or Fahrenheit:
        return Math.round(DEG == 'c' ? (kelvin - 273.15) : (kelvin*9/5 - 459.67));
    }

    function showError(msg){
        weatherDiv.addClass('error').html(msg);
    }

});