$(document).ready(function() {
  $.get("http://ipinfo.io", function(response) {
    ipAdd = response.ip;  //get ip address
    
    var geoApi = 'http://freegeoip.net/json/' + ipAdd;
    // Find Lat and Lon based on IP via API
    $.getJSON(geoApi, function(geo){
      lat = geo.latitude;
      lon = geo.longitude;
      
    //Call Open Weather with lat and lon info  
    var api='http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&APPID=e9f08d947860b6c732d46cd2f4b23cbc';
    $.getJSON(api, function(data){
      temp = Math.round(data.main.temp);
      local = data.name;
      conditions = data.weather[0].main;
      group = data.weather[0].id;
      $("#location").html(local);
      $("#temp").html(temp + "&#8457; " + conditions + "</br> <img src='http://openweathermap.org/img/w/" + data.weather[0].icon +".png' style='width:125px;'>");
      
      //Set background image
    if(group >= 200 && group < 300){
      // Thunder
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483822358/lightning-501922_ysgfhq.jpg)");
      updateBody();
    }else if(group >= 300 && group < 400){
      // Drizzle
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483991953/island-234057_hatuzc.jpg)");
      updateBody();
    }else if(group >= 500 && group < 600){
      // Rain
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483994100/water-815271_osyfbo.jpg)");
      updateBody();
    }else if(group >= 600 && group < 700){
      // Snow
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483994257/runners-head-69657_er20pu.jpg)");
      updateBody();
    }else if(group >= 700 && group < 800){
      // Atmosphere
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483994560/beach-1868170_qoahob.jpg)");
      updateBody();
    }else if(group == 800){
      // Clear
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483994783/normandy-1271840_tngg5e.jpg)");
      updateBody();
    }else if(group > 800 && group < 900){
      // Clouds
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483994889/clouds-194840_mky4yy.jpg)");
      updateBody();
    }else if(group >= 900){
      // Extreme
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483995049/tornado-565330_pfppg8.jpg)");
      updateBody();
    }else{
      $('body').css("background-image", "url(http://res.cloudinary.com/dyo5s2fnz/image/upload/v1483995049/tornado-565330_pfppg8.jpg)");
      updateBody();
    }
      
     $("#toggle").click(function(){
       var x = document.getElementById("toggle").getAttribute("value");
       var b = document.getElementById("toggle").value;
       var btn = document.getElementById("toggle");
       if(x == "C"){
        tempC = Math.round((temp - 32) * 5/9);
        $("#temp").html(tempC + "&#8451; " + conditions + "</br> <img src='http://openweathermap.org/img/w/" + data.weather[0].icon +".png' style='width:125px;'>");
        document.getElementById("toggle").value = "F";
        btn.firstChild.data = "Fahrenheit";        
       }else if(x == "F"){
        $("#temp").html(temp + "&#8457; " + conditions + "</br> <img src='http://openweathermap.org/img/w/" + data.weather[0].icon +".png' style='width:125px;'>");
        document.getElementById("toggle").value = "C";
        btn.firstChild.data = "Celsius";
       }
     });

     function updateBody(){
       $('body').css("background-size" , "cover");
       $('body').css("background-repeat" , "no-repeat");
     }
      
    });   
  });
    
  }, "jsonp");
  
});

