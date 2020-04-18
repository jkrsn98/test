const words = new URLSearchParams(window.location.search);
var loc = words.get('location'), cords;
var currentUnixTime = Math.round(Date.now() / 1000), targetDate = new Date();
var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60;
var localDate, offsets;
var formattedAd;
var day, temp, rain, windy, cloudy;
var locLower = loc.toLowerCase();
console.log(locLower);
window.onload = function(){
  document.getElementById('locationName').innerHTML = locLower; //'formattedAd' to display formal location;
  document.getElementsByClassName("content")[0].innerHTML = temp;
  displayLogic();
};

function displayLogic(){
  if(day && !cloudy){
    setBackgroundImage('bgday1.jpg');
    setWeatherBoxOpacity('25%');
    setWeatherBoxBackground('day.gif');
    if(windy){
      if(temp<60){
        setMessage("Grab a jacket.");
        setWeatherBoxOpacity('35%');
        setWeatherBoxBackground('windy2.gif');
      }else{
        setMessage("It's wonderful out.");
        setBackgroundImage('bgday2.jpg');
        setWeatherBoxOpacity('35%');
        setWeatherBoxBackground('windy1.gif');
      }
    }else
      if(temp>60 && temp<75)setMessage("It's wonderful out.");
      else setMessage("Enjoy your day.");
  }

  if(day && cloudy){
    setBackgroundImage('bgovercast.jpg');
    setWeatherBoxOpacity('20%');
    if (rain){
      setMessage("Take an umbrella.");
      setWeatherBoxBackground('rainday.gif');
    }
    else if(windy){
      setWeatherBoxOpacity('20%');
      setMessage("Enjoy your day.");
      setWeatherBoxBackground('windy3.gif');
    }else{
      setMessage("Enjoy your day.");
    }
  }

  if(!day){
    setBackgroundImage('bgnight1.jpg');
    setWeatherBoxOpacity('35%');
    setMessage("The night is calm.");
    if(rain){
      setWeatherBoxOpacity('20%');
      setWeatherBoxBackground('rainnight.gif');
      setMessage("It's a rainy night.");

    }
    else if(windy){
      setBackgroundImage('bgnight2.jpg');
      setWeatherBoxBackground('windy3.gif');
      setMessage("It's a windy night.");

    }else{
      setBackgroundImage('bgnight2.jpg');
      document.getElementsByClassName("content")[0].style.color= "grey";
      setWeatherBoxOpacity('20%');
      setWeatherBoxBackground('moon.gif');
    }
  }
}

function setBackgroundImage(s){
  console.log("setting background to " + s);
  //s = "imgs/"+s;  (if using local imgs)
  s = "https://res.cloudinary.com/jkrsn98/image/upload/v1586562326/weather/"+s;
  document.getElementById("weatherBody").style.backgroundImage= "url("+'\''+s+'\''+")";
}

function setWeatherBoxOpacity(s){
  console.log("setting weatherbox opacity to " + s);
  document.getElementsByClassName("weatherBox")[0].style.opacity= s;
}

function setWeatherBoxBackground(s){
  console.log("setting weatherbox background to " + s);
  //s = "imgs/"+s;  (if using local imgs)
  s = "https://res.cloudinary.com/jkrsn98/image/upload/v1586562326/weather/"+s;
  document.getElementsByClassName("weatherBox")[0].style.backgroundImage= "url("+'\''+s+'\''+")";
}

function setMessage(s){
  document.getElementsByClassName("msg")[0].innerHTML = s;
}

/*
------------------------------------------------------------------------------
Connecting to the APIs and getting the required data:
------------------------------------------------------------------------------
*/

//Gets coordinates from user inputted location
var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + loc +
 "&key=AIzaSyBICDS3opgWm-qTJPBthMe0DU4gX58pJCE";

$.ajax({
  async:false,
  url: googleURL,
  success: function(data){
    console.log(data);
    cords = data.results[0].geometry.location.lat+","+data.results[0].geometry.location.lng;
    formattedAd = data.results[0].formatted_address;
  }
});

//Gets local user time
var googleURL2 ="https://maps.googleapis.com/maps/api/timezone/json?location="+
 cords + "&timestamp=" + currentUnixTime +
  "&key=AIzaSyBICDS3opgWm-qTJPBthMe0DU4gX58pJCE";

$.ajax({
  async:false,
  url: googleURL2,
  success: function(data){
    console.log(data);
    offsets = data.dstOffset*1000+data.rawOffset*1000;
    localDate = new Date(timestamp * 1000 + offsets);
    day = (localDate.getHours() > 6 && localDate.getHours() < 20)?true:false;
    console.log("is day?" + day);
  }
});
console.log("local date : " + localDate);
console.log(cords);

//Gets weather data. Requires a proxy for some reason (using "herokuapp")...
var darkSkyURL =
"https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/0640ebe06d6b9791120ae72443eef475/" +
 cords + ","+ currentUnixTime + "?exclude=minutely,hourly,daily,alerts,flags";

$.ajax({
  async:false,
  url: darkSkyURL,
  success: function(data){
    console.log(data);
    temp= Math.floor(data.currently.temperature);
    windy = Math.floor(data.currently.windSpeed)>9?true:false;
    rain = (data.currently.precipProbability)>.5?true:false;
    cloudy = (data.currently.cloudCover)>0.45?true:false;
    console.log("windy?" + windy);
    console.log("cloudy?" + cloudy);
    console.log("rain: " + rain);
    console.log("temp: " + temp);
  }
});
