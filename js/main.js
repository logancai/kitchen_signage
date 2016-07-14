function resize(){
  var webcam = $("#surveillance");
  if (webcam.width() <= $(window).width()*.3){
    webcam.width($(window).width());
  }
  else{
    webcam.width($(window).width()*.3);
  }
}
function updateClock (){
	var currentTime = new Date ( );
	var currentHours = currentTime.getHours ( );
	var currentMinutes = currentTime.getMinutes ( );
	// var currentSeconds = currentTime.getSeconds ( );
	var currentDate = currentTime.getDate(); //Returns the day of the month (from 1-31)
	var currentDay = currentTime.getDayName();
	var currentMonth = currentTime.getMonthName();
	// var currentYear = currentTime.getFullYear();

	// Pad the minutes and seconds with leading zeros, if required
	currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
	// currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

	// Choose either "AM" or "PM" as appropriate
	var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

	// Convert the hours component to 12-hour format if needed
	currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

	// Convert an hours component of "0" to "12"
	currentHours = ( currentHours == 0 ) ? 12 : currentHours;

	// Compose the string for display
	// var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;
	var currentTimeString = currentHours + ":" + currentMinutes + " " + timeOfDay;
	var currentDateString = currentDay+ " " + currentMonth + " " + currentDate;

	$("#time").html(currentTimeString); 	
	$("#date").html(currentDateString);
}
$(function(){
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };

	setInterval('updateClock()', 1000);
})