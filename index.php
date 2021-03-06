<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Home Signage</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <link href="css/swiper.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="" id="main">
    	<div class="swiper-container" id="photo">
	    	<div class="swiper-wrapper" id="photo-wrapper">
            	<!--Javascript will put pictures in here and automatically remove them-->
                <!--<div class="swiper-slide">
                	<img src="img/DSC_5715-1.jpg"/>
                </div>-->
            </div>
	    </div>
	    <div class="" id="info">
	    	<div class="" id="datetime">
	    		<h1 id="time"></h1>
	    		<h2 id="date"></h2>
	    	</div>
	    	<div class="" id="weather">
	    		<img src="" id="weather-icon"/><h3 id="weather-text"></h3>
	    	</div>
	    	<div class="" id="photo-info" style="display:none;">
	    		<p>6/21/2016</p>
	    		<p>Album Name</p>
	    	</div>
	    </div>
	    <div class="img-thumbnail" id="surveillance">
	    <img class="webcam" src="" border="0" name="webcam" onclick="resize(); document.documentElement.webkitRequestFullScreen(); loadImage();">
	    </div>
    </div>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="js/blueiris.js" type="text/javascript"></script>
    <script src="js/main.js" type="text/javascript"></script>
    <script src="js/openweather.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min.js"></script>
    <script src="js/googlephoto.js" type="text/javascript"></script>
    <script src="js/swiper.jquery.min.js" type="text/javascript"></script>
    <script>
	
    
    </script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>