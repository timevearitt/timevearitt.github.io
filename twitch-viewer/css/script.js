var users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];

$(document).ready(function() {
  for(var i = 0; i < users.length; i++){
   callTwitchApi(i);
  }  // End for loop
  
  function callTwitchApi(i){
    $.getJSON('https://wind-bow.gomix.me/twitch-api/users/' + users[i] + '?callback=?', function(user) {
      console.log(user);
      $.getJSON('https://wind-bow.gomix.me/twitch-api/streams/' + users[i] + '?callback=?', function(stream) {
        logo = user.logo;
        userName = user.name;
        
        if(logo == null){
          //PLACEHOLDER LOGO FOR NOW
          logo = "https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg";
        }
        
        console.log(stream);
        if(stream.stream == null){
          game = "OFFLINE";
        }else{
          game = stream.stream.game;
        }
        
        if(userName == null){
          $("#results").append("<li class='warning'>" + users[i] + " doesn't exist.</li>");
        }else if(game == "OFFLINE"){
          $("#results").append("<a href='http://www.twitch.tv/" + users[i] + "' target='_blank'><li class='offline'><img src='" + logo + "' class='logo'>" + userName + " is OFFLINE.</li></a>");
        }else{
          $("#results").append("<a href='http://www.twitch.tv/" + users[i] + "' target='_blank'><li class='online'><img src='" + logo + "' class='logo'> " + userName + " is streaming " + game.toUpperCase() + ".</li></a>");
        }   
      });// END JSON STREAM CALL
    }); //End JSON USER CALL
     
  } // END callTwitchApi
  
  $("#online").click(function(){
    $(".offline").hide();
    $(".warning").hide();
    $(".online").show();
  });
  
  $("#offline").click(function(){
    $(".online").hide();
    $(".warning").hide();
    $(".offline").show();
  });
  
  $("#all").click(function(){
    $(".online").show();
    $(".warning").show();
    $(".offline").show();
  });
  
}); // End Doc Ready

