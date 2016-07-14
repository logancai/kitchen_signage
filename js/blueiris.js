var campath = "";
var camname = "";
var timerID = null;
var timerRunning = false;
var basetime;
var showalerts = 0;
var autorefresh = false;

var mediaWidth = 640;
var mediaHeight = 480;
var daysago = 0;
var inptz = 0;
var refreshmsec = 50;

  window.onload = function(){
    opencam();
    // onWindowResize();
  }
  
  window.onresize = function(){
      // onWindowResize();
  }
  
function startTimer(){
  timerID = window.setTimeout( "loadImage()",refreshmsec );
  timerRunning = true;
}

function loadImage(){
  var tmp = new Date(); 

  var iLen = String(campath).length;
    if( String(campath).toLowerCase().substring(iLen-3) != "jpg" )
    {
    document.images.webcam.onload = startTimer;
    document.images.webcam.onerror = startTimer;
  }
  else
  {
    document.images.webcam.onload = null;
    document.images.webcam.onerror = null;
  }

  document.images.webcam.src = campath + "?time=" + (tmp.getTime()-basetime);
}

  function openfile( dest, w, h ){
  document.all["rowptz"].style.display = 'none';
  
  box = document.getElementById('CamList');
  box.selectedIndex = -1;

  mediaWidth = w;
  mediaHeight = h;
  
  parts = dest.split("/");

  campath = "/file";
  
  for(i = 3; i < parts.length; i++) {
    campath += "/";
    campath += parts[i];
  }
  
  var tmp = new Date(); 
  basetime = tmp.getTime();
    
  refreshmsec = 50;               

  loadImage();
  onWindowResize();
  }
  
  function onWindowResize(){
      var isIE = Number(navigator.appName.indexOf('Internet Explorer')) != -1;
      var content_offset_w = 324 + 24; 
      var content_offset_h = 42 + 24; // + (isIE ? 3:0);
      
  if( document.all["rowptz"].style.display != 'none' )
    content_offset_h += 30;

  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  
  var winWidth = myWidth;
  var winHeight = myHeight;
  
      if( myWidth>content_offset_w && myHeight>content_offset_h )
      {
        myWidth -= content_offset_w;
        myHeight -= content_offset_h;
       
//      if( mediaWidth>=640 && mediaHeight <=288 )  // eg, single field 640x240
//        mediaHeight *= 2;

    var r = mediaWidth/mediaHeight;

    if( myHeight*r < myWidth )
    {
      myWidth = myHeight*r;
    }
    else
    {
      myHeight = myWidth /r;
    }

//      document.images.webcam.width = myWidth;
    document.images.webcam.height = myHeight;
  }
  
  I1.onWindowResize();
  }
  
function changeLinkHref(id,newHref){
    if( document.getElementById)
    {
    document.getElementById(id).href = newHref;
    }
    else if( document.all )
    {
    document.all[id].href = newHref;
    }
    else if( document.links.length > 0)
  {
//      var index = findLinkByHref(oldHref);
//      if (index > -1)
//        document.links[index].href = newHref;
  }
}

function opencam(){
  // I ran this script below and got the DOM element
  // box = document.getElementById('CamList');
  
  // commented out
  // if( box.selectedIndex < 0 )
  //   return;
    
  // camlabel = box.options[box.selectedIndex].innerHTML;
  camlabel = "Front";
  // destination = box.options[box.selectedIndex].value;
  destination = "jpg;1920;1080;http://192.168.1.113/Cam1;no;2"
  
  if( !destination || destination=="off" )
  {
    mediaWidth = 640;
    mediaHeight = 480;
    
    try
    {
      document.images.webcam.src = "img/nothumb.jpg";
    }
    catch(er)
    {
      alert( "Error " + er );
    }
  }
  else 
  {
    parts = destination.split(";");
    
    if( parts[0]=="wmv" )
    {
      mediaWidth = Number(parts[1]);
      mediaHeight = Number(parts[2]);
      
    }
    else
    if( parts[0]=="jpg" )
    {
      mediaWidth = Number(parts[1]);
      mediaHeight = Number(parts[2]);
      
      bits = parts[5];
      pieces = parts[3].split("/");
      camname = pieces[3];
      // Commented out because we need to specify the path of server
      // campath = "/image/" + camname;
      campath = "http://192.168.1.113"+"/image/" + camname;
      
//        changeLinkHref( "preset1", "/cam/" + pieces[3] + "/pos=8" );
//        changeLinkHref( "preset2", "/cam/" + pieces[3] + "/pos=9" );
//        changeLinkHref( "preset3", "/cam/" + pieces[3] + "/pos=10" );
//        changeLinkHref( "preset4", "/cam/" + pieces[3] + "/pos=11" );
//        changeLinkHref( "preset5", "/cam/" + pieces[3] + "/pos=12" );
      
      // Commented out
      // if( bits & 2 )
      //   document.all["rowptz"].style.display = '';
      // else
      //   document.all["rowptz"].style.display = 'none';
        
      var tmp = new Date(); 
      basetime = tmp.getTime();
      
      // Commented out because we don't need to see clips
      // I1.location = "./cliplist.htm?cam=" + camname + "&alerts=" + showalerts;
              
      if( camlabel.substring(0,1)=='+' )
         refreshmsec = 150;
      else refreshmsec = 50;                
              
      loadImage();
    }   
  }
  
  // Commented out
  // onWindowResize();

//    I1.document.getElementById('ClipList').selectedIndex = -1;
}

function OnPTZ( pos, down ){
// event.SrcElement.id  could be used instead of passing the pos ...

  if( down ) {
    inptz= 1;
    new Image().src = "/cam/" + camname + "/pos=" + pos +"?updown=1&" + new Date().getTime();
  }
  else
  if(inptz>0) {
    inptz= 0;     
    new Image().src = "/cam/" + camname + "/pos=" + pos +"?updown=2&" + new Date().getTime();
  }
}

function OnPTZPreset( pos ){
// event.SrcElement.id  could be used instead of passing the pos ...

  new Image().src = "/cam/" + camname + "/pos=" + pos + "?" + new Date().getTime();
}

