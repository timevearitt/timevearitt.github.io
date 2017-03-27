var quotes = [
  ['"Success isn\'t owned\, it\'s leased.  And rent is due every day"', '- J.J. Watt'], 
  ['"When in doubt, punt!','- John Heisman'],
  ['"Pressure is something you feel when you don\'t know what the hell you\'re doing."','- Peyton Manning'],
  ['"I like football. I find its an exciting strategic game. Its a great way to avoid conversation with your family at Thanksgiving."','- Craig Ferguson'],
  ['"The Enemy of the best is the good. If you\'re always settling with what\'s good, you\'ll never be the best."','- Jerry Rice'],
  ['"Football combines two of the worst things in American life. It is violence punctuated by committee meetings."','- George F. Will'],
  ['"You can\'t spell Citrus without U-T."','- Steve Spurrier'],
  ['"You know what FSU stands for, don\'t you? Free Shoes University."','- Steve Spurrier'],
  ['"There\'s nothing that cleanses your soul like getting the hell kicked out of you."','- Woody Hayes']
];

var quoteNum = setQuote();

function setQuote() {
  quoteNum = Math.floor(Math.random() * quotes.length);
  quote = quotes[quoteNum][0];
  author = quotes[quoteNum][1];
  twitterURL = 'https://twitter.com/intent/tweet?text='+quote+' Author: '+author+' @timevearitt'
}

$(document).ready(function() {
  setQuote();
  $("#quote").html(quote);
  $("#author").html(author);
  $(".twitter-share").attr('href',twitterURL);
  
  $("#btnQuote").click(function(){
    setQuote();
    $("#quote").html(quote);
    $("#author").html(author);
    $(".twitter-share").attr('href',twitterURL);
  }); 
});