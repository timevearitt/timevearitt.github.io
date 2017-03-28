$(document).ready(function() {
  
  $(".searchVal").keyup(function(event){
    if(event.keyCode == 13){
        $("#search").click();
    }
  });
  
  $('#search').click(function() {
  var search = $('.searchVal').val();
  var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search + "&format=json&callback=?";
    
    displayResults(url);
  
  });
  
  function displayResults(url){
    $.ajax({
    type: "GET",
    url: url,
    async: false,
    dataType: "json",
    success: function(data){
      $("#results").empty();
      for(var i=1; i < data[1].length; i++){
        console.log(data);
        $("#results").append($("<a href='" + data[3][i] + "' target='_blank'><li><h3>" +  data[1][i] + "</h2></br><p>" + data[2][i] + "</p></li></a>"));
      }
    },
    error: function(errorMsg){ 
    }    
  });
  }
  
});