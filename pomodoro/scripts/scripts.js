$(document).ready(function() {
	var startWorkTime = 1500;
	var workTime = startWorkTime;
	var startBreakTime = 300;
	var breakTime = startBreakTime;
	var isBreak = false;
	var workInterval;
	// stores sounds
	var airhorn = $("#airhorn")[0];

	$("#stop").hide();
	
	// Display the default time in minutes and seconds.  returnSeconds accounts for adding 0 to time when seconds between 0-9.
	displayWorkTime();
	displayBreakTime()

	$("#addWorkTime").click(function() {
		workTime += 60;
		startWorkTime = workTime;
		displayWorkTime();
	});

	$("#subWorkTime").click(function() {
		if(workTime > 60){
			workTime -= 60;
			startWorkTime = workTime;
			displayWorkTime();
		}
	});

	$("#addBreak").click(function() {
		breakTime += 60;
		startBreakTime = breakTime;
		displayBreakTime()
	});

	$("#subBreak").click(function() {
		if(breakTime > 60){
			breakTime -= 60;
			startBreakTime = breakTime;
			displayBreakTime()
		}
	});

	//Triggers work timer when start is clicked
	$("#start").click(function() {
		$("#stop").show();
		$("#start").hide();
		if(!isBreak){
			workInterval = setInterval(function(){ setWorkTime() }, 1000);
		}else{
			breakInterval = setInterval(function(){ setBreakTime() }, 1000);
		}	
	});
	// Pauses time when stop is clicked
	$("#stop").click(function() {
		$("#start").show();
		$("#stop").hide();
		clearInterval(workInterval);
		clearInterval(breakInterval);
	});

	$("#reset").click(function() {
		$("#start").show();
		$("#stop").hide();
		isBreak = false;
		startWorkTime = 1500;
		workTime = startWorkTime;
		startBreakTime = 300;
		breakTime = startBreakTime;
		displayWorkTime();
		displayBreakTime()
		clearInterval(workInterval);
		clearInterval(breakInterval);
	});

	//Work time logic
	function setWorkTime(){
		workTime--;
		displayWorkTime();
		if(workTime === 0 ){
			airhorn.play();
			clearInterval(workInterval);
			breakTime = startBreakTime;
			breakInterval = setInterval(function(){ setBreakTime() }, 1000);
			isBreak = true;
		}
	}

	//Break time logic
	function setBreakTime(){
		breakTime--;
		displayBreakTime()
		if(breakTime === 0){
			airhorn.play();
			clearInterval(breakInterval);
			workTime = startWorkTime;
			workInterval = setInterval(function(){ setWorkTime() }, 1000);
			isBreak = false;
		}
	}

	function displayWorkTime(){
		$("#workTimer").html(returnMinutes(workTime) + ":" + returnSeconds(workTime));
	}

	function displayBreakTime(){
		$("#breakTimer").html(returnMinutes(breakTime) + ":" + returnSeconds(breakTime));
	}
	
	//Format time to string
	function returnSeconds(num){
		if(num % 60 < 10){
			return "0" + num%60
		}else{
			return num % 60;
		}
	}

	function returnMinutes(num){
		if(num / 60 < 10){
			return "0" + Math.floor(num / 60);
		}else{
			return Math.floor(num / 60);
		}
	}
			
});