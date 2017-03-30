$(document).ready(function() {
	var playerXO = "X";
	var AIXO = "O";
	var isXTurn = true;
	var isPlayerTurn = true;
	var isGameOver = false;
	var turnCount = 0;
	var playerWins = 0;
	var AIWins = 0;
	var gamesPlayed = 0;
	var board = [
				["","",""],
				["","",""],
				["","",""]
			];

	$("#X").click(function() {
		$("#xoro").hide();
	});

	$("#O").click(function() {
		playerXO = "O";
		AIXO = "X";
		isPlayerTurn = false;
		$("#xoro").hide();
	});

	$(".square").click(function(event){
		sid = event.target.id;
		text = $("#" + sid).text();
		if(text === null || text===""){
			$("#" + sid).html(isXTurn ? "X" : "O");
			updateBoard(sid.substring(0,1), sid.substring(1,2));
			gameOver();
			changeTurn();
			//console.log(isXTurn);
		}
	});

	function changeTurn(){
		isXTurn = !isXTurn;
		isPlayerTurn = !isPlayerTurn;
		turnCount++;
		console.log(turnCount);
		if(!isPlayerTurn){
			AIMove();
		}
	}

	function reset(){
		$(".square").html("");

		board = [
				["","",""],
				["","",""],
				["","",""]
			];

		turnCount = 0;
		gamesPlayed++;
		if(gamesPlayed % 2 === 0){
			isXTurn = false;
		}else{
			isXTurn = true;
		}
	}

	function updateBoard(x, y){
		board[x][y] = isXTurn ? "X" : "O";
	}

	function gameOver(){
		//check rows for win
		for(i=0; i<3; i++){
			if(board[i][0] === board[i][1] && board[i][0] === board[i][2] && board[i][0] != ""){
				console.log(board[i][0] + " WINS!");
				alert(board[i][0] + " WINS!");
				incrementScore(board[i][0]);
				reset();
				break;
			}
		}
		//check column for win
		for(j=0; j<3; j++){
			if(board[0][j] === board[1][j] && board[0][j] === board[2][j] && board[0][j] != ""){
				console.log(board[0][j] + " WINS!");
				alert(board[0][j] + " WINS!");
				incrementScore(board[0][j]);
				reset();
				break;
			}
		}

		//check top left to bottom right
		if(board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] != ""){
			console.log(board[0][0] + " WINS!");
			alert(board[0][0] + " WINS!");
			incrementScore(board[0][0]);
			reset();
		}

		//check top right to bottom left
		if(board[2][0] === board[1][1] && board[2][0] === board[0][2] && board[2][0] != ""){
			console.log(board[2][0] + " WINS!");
			alert(board[2][0] + " WINS!");
			incrementScore(board[2][0]);
			reset();
		}

		if(turnCount === 9){
			alert("Cat Wins!");
			reset();
		}
	}

	function incrementScore(str){
		if(str === playerXO){
			playerWins++;
		}else{
			AIWins++;
		}
		$("#score").html("PLAYER " + playerWins + " - AI: " + AIWins);
	}

	function AIMove(){
		var AIX = Math.floor(Math.random() * 3);
		var AIY = Math.floor(Math.random() * 3);

		console.log("AIX" + AIX);

		if(board[AIX][AIY] == ""){
			AIMove();
		}else{
			$("#" + AIX + AIY).trigger("click");
			console.log(board)
			changeTurn();
		}
	}




});