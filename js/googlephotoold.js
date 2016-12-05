//Variables
var random_slides = true;
var userid = '112309056616006446013';
var albumids = ['6264542791645891777', '6306923423357956593'];
var url = 'http://picasaweb.google.com/data/feed/api/user/'+userid;
var stage_limit = 50;
var add_remove_limit = 13;
function Global_Variables(){
	this.stage_array = []; //Variables currently on display
	this.add_array = [];
	this.bucket_of_accessor = []; //range from 0 through sum of photos. Can be empited
	this.sum_of_photos = 0; //remember when accessing the photos, it's -1
	this.range_to_cache = []; //last_valid_accessor, cache that contains info
	this.cache = null;
}
$(function(){
	//Init call
	getphotos();
	var mySwiper = null;
	
	var interval = 1000*5*add_remove_limit;//Every 65 seconds
	setInterval (function(){
		next_batch_of_photos (variables);
		var mySwiper = new Swiper ('.swiper-container', {
		  // Optional parameters
		  direction: 'horizontal',
		  autoHeight: true,
		  loop: true,
		  autoplay: 1000*5,
		  keyboardControl: true,
		  lazyLoading: true
		});
	}, interval);
	
	var mySwiper = new Swiper ('.swiper-container', {
	  // Optional parameters
	  direction: 'horizontal',
	  autoHeight: true,
	  loop: true,
	  autoplay: 1000*5,
	  keyboardControl: true,
	  lazyLoading: true
	});
    
	//Functions
    function getphotos(){
		console.log('getphotos called');
        //Ultimatly the requesting URL for the XML is 
        //http://picasaweb.google.com/data/feed/api/user/112309056616006446013/albumid/6264542791645891777
        //The server will convert the XML to JSON
        //Picasa services will only return 1000 items per album
		//var i = albumids.length - 1; i >= 0; i--
		variables = new Global_Variables();
        for (var i = 0; i<albumids.length; i++) {
            var album = albumids[i];
            // Retrive the cache
            if(localStorage.getItem(album) === undefined){
                cache = null;
            }
            else{
                cache = JSON.parse(localStorage.getItem(album));
            }
            var d = new Date();
            
            // If the cache is newer than 30 minutes, use the cache
            if((cache && cache.timestamp) && (cache.timestamp > (d.getTime() - 30*60*1000))){
                //Do nothing
            }
            else{
				prepare_storage(album, i, variables);
                
            }
        }
		cache = null;
		prepare_slides(variables);
    }
	function prepare_storage(album, i, variables){
		console.log('prepare_storage called');
		$.getJSON("http://logancai.com/kitchen/getphotos.php?albumid="+album, function(data){
			// Store the cache
			var JSONString = JSON.stringify({
				timestamp:(new Date()).getTime(),   // getTime() returns milliseconds
				data: data
			});
			if (data != 'false'){
				localStorage.setItem(album, JSONString);
				
			}
		});
	}
	function prepare_slides(variables){
		console.log('prepare_slides_called');
		for (var i = 0; i<albumids.length; i++) {
            var album = albumids[i];
            // Retrive the cache
            if(localStorage.getItem(album) === undefined){
                cache = null;
            }
            else{
                cache = JSON.parse(localStorage.getItem(album));
            }
            var d = new Date();
            
            // If the cache is newer than 30 minutes, use the cache
            if((cache && cache.timestamp) && (cache.timestamp > (d.getTime() - 30*60*1000))){
				var length = 0;
				if(cache.data.entry.length === undefined){
					length = 1;
				}
				else{
					length = cache.data.entry.length;
				}
				variables.sum_of_photos = variables.sum_of_photos + length;
				variables.range_to_cache.push([variables.sum_of_photos, i]);
            }
            else{
				getphotos();
            }
        }
		var a = 1;
		while (a <= variables.sum_of_photos){
			variables.bucket_of_accessor.push(a);
			a = a + 1;
		}
		next_batch_of_photos (variables);
	}
	function next_batch_of_photos (variables){
		console.log('next_batch_of_photos called');
		//Setup stage of photos
		//We also need to remove old photos from the DOM, but I haven't done that yet
		//can find current active slide by calling $(".swiper-slide-active")
		var newcall = true;
		if(variables.stage_array.length > 0){ //false
			newcall = false;
		}
		if(newcall == false){
			//Go through DOM and remove old elements
			var stage = $("#photo-wrapper");
			for(var i = 0; i<add_remove_limit; i++){
				stage.children()[0].remove();
				variables.stage_array.shift();
				/*if($(".swiper-slide-active")[0] == stage.children()[0]){
					//Skip that please, we're looking at it right now
				}
				else{
					
				}*/
			}
		}
		if(random_slides == true){
			for (var i = variables.stage_array.length; i<stage_limit; i++){
				if(variables.bucket_of_accessor.length > 1){
					var randomIndex = Math.floor(Math.random()*variables.bucket_of_accessor.length);
					variables.bucket_of_accessor.splice(randomIndex, 1)[0];
					if(newcall){
						variables.stage_array.push(randomIndex);
					}
					else{
						variables.add_array.push(randomIndex);
					}
				}
				else{
					prepare_slides();
					break;
				}
			}
		}
		else{
			if(!newcall){
				//Old, find out where we are currently at
				var add_limit = add_remove_limit;
				var last_element = variables.stage_array[stage_array.length - 1];
				var the_rest = variables.bucket_of_accessor.slice(last_element+1);
				if (the_rest.length < add_limit){
					variables.add_array = the_rest;
					//We should get more to fill up the queue
				}
				else{
					variables.add_array = variables.bucket_of_accessor.slice(last_element+1, last_element+1+add_limit);
				}
			}
			else{
				//Brand new, 
				var possible_length = 0;
				if (variables.bucket_of_accessor.length > stage_limit){
					possible_length = stage_limit;
				}
				else{
					possible_length = variables.bucket_of_accessor.length;
				}
				variables.stage_array = variables.bucket_of_accessor.slice(0, possible_length);
			}
		}
		if(newcall){
			display_stage(variables.stage_array,variables);
		}
		else{
			display_stage(variables.add_array,variables);
		}
	}
	function convert_index_to_albums_index(accessor, variables){
		for(var i = 0; i<variables.range_to_cache.length; i++){
			if(accessor <= variables.range_to_cache[i][0]){
				return i;
			}
		}
		return -1; //Something went wrong
	}
	function convert_index_to_local_album_index(accessor, albums_index, variables){
		var previous = null;
		if(albums_index == 0){
			previous = 0;
		}
		else{
			previous = variables.range_to_cache[albums_index-1][0];
		}
		return accessor-previous-1;
	}
	function display_stage(stage_array,variables){
		console.log('display_stage called');
		var stage = $("#photo");
		var memory = [];
		//Load cache into memory
		for (var i = 0; i<albumids.length; i++){
			memory.push(JSON.parse(localStorage.getItem(albumids[i])));
		}
		for (var i = 0; i<stage_array.length; i++){
			var albumsid_index = convert_index_to_albums_index(stage_array[i], variables);
			var memory_entry_index = convert_index_to_local_album_index(stage_array[i], albumsid_index, variables);
			var url = memory[albumsid_index].data.entry[memory_entry_index].content['@attributes'].src;
			var parent_url = url.substring(0,url.lastIndexOf('/')+1);;
			var filename = url.substring(url.lastIndexOf('/')+1);
			var requesting_url = parent_url + 's1024/' + filename;
			var parent = $('<div></div>').appendTo($('#photo-wrapper')).addClass('swiper-slide');
			var child = $('<img />').appendTo(parent).attr('src', requesting_url);
		}
	}
});