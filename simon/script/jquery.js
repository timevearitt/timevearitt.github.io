$(document).ready(function() {
	var simonSeq = [];
	var playerSeq = [];
	var colors = ["green", "red", "yellow", "blue"];
	var round = 0;
	var state = "off";
	var index = 0;
	var strict = false;
	var difficulty = 1000;
	var lightSpeed = 600;
	var greenSound = $("#greenSound")[0];
	var redSound = $("#redSound")[0];
	var yellowSound = $("#yellowSound")[0];
	var blueSound = $("#blueSound")[0];
	var game;

	// GAME LOOP *************************************************************
	// Runs simon seq and display logic.  Player moves are outside of the loop
	// in the jQuery click functions
	function play(){
		if(state === "simon"){
			simonState();
		}

		if(state === "replay"){
			replaySeq();
		}

		if(state === "off"){
			round = 0;
		}
	}

	// PLAYER LOGIC AND CLICK EVENT*******************************************
	// run player logic for each quad color clicked
	$("#green").click(function(event){
		if(state === "player"){
			playerSeq.push("green");
			checkPlayerInput();
			lightOn("green", "fast");
		}	
	});

	$("#red").click(function(event){
		if(state === "player"){
			playerSeq.push("red");
			checkPlayerInput();
			lightOn("red", "fast");
		}
	});

	$("#yellow").click(function(event){
		if(state === "player"){
			playerSeq.push("yellow");
			checkPlayerInput();
			lightOn("yellow", "fast");
		}
	});

	$("#blue").click(function(event){
		if(state === "player"){
			playerSeq.push("blue");
			checkPlayerInput();
			lightOn("blue", "fast");
		}
	});

	// UI CLICK EVENTS ******************************************************
	// click the start button
	$("#start").click(function(event){
		if(state !== "off"){
			clearInterval(game);
			initializeGame();
		}
		state = "simon";
		game = setInterval(play, 33);
	});

	// toggle strict mode.  If player makes a mistake the game will reset
	// and auto restart
	$("#btnStrict").click(function(event){
		if(state != "off"){
			strict = !strict;
			if(strict){
				$("#strictLight").css("background-color", "red");
			}else{
				$("#strictLight").css("background-color", "#560000");
			}
		}
	});
	
	// Game State toggle on/off
	$("#powerBtn").click(function(event){
		if(state === "off"){
			state = "on";
			displayRound();
			$("#power").css("color", "green");
		}else{
			state = "off";
			$("#power").css("color", "black");
			$("#strictLight").css("background-color", "#560000");
			$("#round").html("");
			strict = false;
		}
	});

	// SIMON STATE ***********************************************************
	// generates sequence, displays seq to player, difficulty setting based
	// on round, updates state back to player and gives win conditions
	function simonState(){
		if(simonSeq.length <= 19){
			addToSeq();
			displayRound();
			checkDifficulty();
			setTimeout(displaySeq, 1000);
			state = "display";
		}else{
			win();
			state = "gameOver";
		}
	}

	// DISPLAY BOARD *********************************************************
	// Replay Seq if user enter incorrect seq and not strict mode
	function replaySeq(){
			state = "display";
			setTimeout(displaySeq, 1000);
	}

	// updates the value in the round/count UI box
	function displayRound(){
		if(round < 10){
			$("#round").html("0" + round);
		}else{
			$("#round").html(round);
		}
	}

	// if player enters incorrect quad, displays error in the round/count UI
	function displayError(){
		$("#round").html("!!");
		setTimeout(displayRound, 2000);
		playerSeq = [];
	}

	// adds a color to the simon sequence array and displays the seq to user
	function addToSeq(){
		if(round < 20){
			simonSeq.push(colors[Math.floor(Math.random() * colors.length)]);
			round++;
			displayRound();
		}
	}

	// displays the sequence to the user in intervals
	function displaySeq(){
		index = 0;
		var	lightInterval = setInterval(function() {
			lightOn(simonSeq[index], lightSpeed);
			index++;
			if(index >= round){
				state = "player";
				clearInterval(lightInterval);
			}
		}, difficulty);	
	}

	// animates the UI quads and play sound
	function lightOn(color, speed){
		if(state !== "off"){
			lightDiv = "#" + color;
			playSound(color);
			$(lightDiv).animate({opacity: '1'}, speed);
			$(lightDiv).animate({opacity: '.3'}, "fast");	
		}	
	}

	// plays sound based on color provided by lightOn
	function playSound(color){
		switch(color){
			case "green":
				greenSound.play();
				break;
			case "red":
				redSound.play();
				break;
			case "yellow":
				yellowSound.play();
				break;
			case "blue":
				blueSound.play();
				break;
		}
	}

	// resets the game
	function initializeGame(){
		playerSeq = [];
		simonSeq = [];
		round = 0;
		index = 0;
		
		if(state !== "on"){
			state = "simon";
		}
	}

	// increases light speed
	function checkDifficulty(){
		if(round < 6){
			lightSpeed = 600;
			difficulty = 1000;
		}else if(round < 14){
			lightSpeed = 400;
			difficulty = 800;
		}else{
			lightSpeed = 200;
			difficulty = 600;
		}
	}

	// UI display if user reaches round 20
	function win(){
		lightDiv = "#" + simonSeq[19];
		for(i=0; i<7; i++){
			$(lightDiv).animate({opacity: '1'}, "fast");
			$(lightDiv).animate({opacity: '.3'}, "fast");
		}

		initializeGame();	
	}

	// PLAYER LOGIC **************************************************************
	// confirms player entry, displays error if incorrrect, resets game if in 
	// strict mode.
	function checkPlayerInput(){
		for(var i=0; i<playerSeq.length; i++){
			if(playerSeq[i] !== simonSeq[i]){
				displayError();
				if(strict){
					setTimeout(initializeGame, 1750);
					break;
				}else{
					state = "replay";
					break;
				}
			}
		}

		if(playerSeq.length == simonSeq.length){
			state = "simon";
			playerSeq = [];
		}
	}

});