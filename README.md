# Kitchen_Signage

Intended Use:
The kitchen tablet contacts a remote server for this webpage. The webpage displays a slideshow, time, date, weather, and one Blueiris 3 video feed. All of the work is done in Javascript (and jQuery). 

If you want to use it:
openweather.js
  - You will need to obtain your own API key
  - Find your city by http://openweathermap.org/ id
  
blueiris.js
  -In the opencam() function, you will need to define
    -camlabel
    -destination
    -The easiest thing to do is to visit your Blueiris's website, i.e. http://192.168.1.113, open the console and paste
      -box = document.getElementById('CamList');
      -Your camlabel = box.options[box.selectedIndex].innerHTML;
      -And destination = box.options[box.selectedIndex].value;

  -And modify the server's address
    -The placeholder address is http://192.168.1.113
