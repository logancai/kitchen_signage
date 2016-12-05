$(function(){
	var stage = $("#photo");
	variables = new Photos(stage);
	setup(variables);
	//End
	//Don't call any other functions here because they are not guarteeed to have all the variables ready
});

function Photos(stage){
	this.displayed_array = []; //Variables currently on display
	this.add_array = [];
	this.json = null;
	this.stage = stage;
}
function setup (variables){
	//If random, request for a random array
	//The server will return JSON a excerpt list of photos, total number of pictures it was able to query and a seed, and MD5 of the PHP file
	//When requesting for the next batch of photos, we just send the index (which should be the same index on the server), and the seed
	$.getJSON("http://logancai.com/kitchen/getphotos.php", function(data){
		variables.json = data;
		add_to_dom(variables);
		var mySwiper = new Swiper ('.swiper-container', {
		  // Optional parameters
		  direction: 'horizontal',
		  autoHeight: true,
		  loop: true,
		  autoplay: 1000*5,
		  autoplayDisableOnInteraction: false,
		  keyboardControl: true,
		  lazyLoading: true
		});
	});
}
function add_to_dom(variables){
	for(var i =0; i<variables.json.entry.length;i++){
		var parent = $('<div></div>').appendTo($('#photo-wrapper')).addClass('swiper-slide');
		var child = $('<img />').appendTo(parent).attr('src', variables.json.entry[i]).addClass('swiper-lazy');
	}
	
}