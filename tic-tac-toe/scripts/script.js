$(document).ready(function() {
	var board = [
				["","",""],
				["","",""],
				["","",""]
			];
	var isPlayerTurn = true;
	var isGameOver = false;
	var turnCount = 0;
	var gameNum = 0;
	var player = {token:"X", wins: 0};
	var ai = {token:"O", wins: 0};
	var myMatch;


	// UI EVENTS *********************************************
	// Hide Inactive Div's
	$("#info").hide();
	
	// Select to start the match as X
	$("#X").click(function(event){
		myMatch = setInterval(match, 100);
		$("#selectToken").hide();
		$("#winner").hide();
	});

	// Select to start the match as o
	$("#O").click(function(event){
		player.token = "O";
		ai.token = "X";
		isPlayerTurn = false;
		myMatch = setInterval(match, 100);
		$("#selectToken").hide();
		$("#winner").hide();
	});

	// Reinitialize game when rematch is clicked
	$("#rematch").click(function(event){
		initGame();
	});

	// MATCH LOOP *********************************************
	function match(){
		// PLAYER TURN
		if(isPlayerTurn && !isGameOver){
			// make player move
			$(".square").click(function(event){
				// parse click id into selected board row and col
				sid = event.target.id;
				row = sid.substring(0,1);
				col = sid.substring(1,2);
				// is selection valid and game not over?
				if(board[row][col] === "" && isPlayerTurn && !isGameOver){
					board[row][col] = player.token;
					isPlayerTurn = false;
					turnCount++;
					isGameOver = gameOver();
				}
			});		
		}
		
		// AI TURN
		if(!isPlayerTurn && !isGameOver){
			hardAiTurn();
			isGameOver = gameOver();
		}

		// if game is over show the results
		if(isGameOver){
			$("#info").show();
		}

		// redraw the game board
		updateBoard();
	}

	//Setup a new game
	function initGame(){
		board = [
				["","",""],
				["","",""],
				["","",""]
			];

		turnCount = 0;
		gameNum++;

		// rotate first player
		if(player.token === "X"){
			if(gameNum % 2 == 0){
				isPlayerTurn = true;
			}else{
				isPlayerTurn = false;
			}
		}else{
			if(gameNum % 2 == 0){
				isPlayerTurn = false;
			}else{
				isPlayerTurn = true;
			}
		}
		isGameOver = false;
		$("#winner").hide();
		$("#info").hide();
	}

	// AI GAME LOGIC******************************************************
	function aiTurn(){
		row = Math.floor(Math.random() * 3);
		col = Math.floor(Math.random() * 3);

		if(board[row][col] === ""){
			board[row][col] = ai.token;
			isPlayerTurn = true;
			turnCount++;
		}else{
			aiTurn();
		}
	}

	function hardAiTurn(){
		aiWinValue = aiWin();
		aiBlockValue = aiBlock();
		aiForkValue = aiFork(ai.token);
		aiBlockForkValue = aiFork(player.token);
		aiOppCorner = aiPlayOppCorner();
		aiCorner = aiPlayCorner();

		if(aiWinValue !== null){
			// Can I win?
			board[aiWinValue.substring(0, 1)][aiWinValue.substring(1, 2)] = ai.token;
			aiTurnOver()
		}else if(aiBlockValue !== null){
			// Do I need to block the player?
			board[aiBlockValue.substring(0, 1)][aiBlockValue.substring(1, 2)] = ai.token;
			aiTurnOver()
		}else if(aiForkValue !== null){
			// Can I fork?
			board[aiForkValue.substring(0, 1)][aiForkValue.substring(1, 2)] = ai.token;
			aiTurnOver()
		}else if(aiBlockForkValue !== null){
			// Do I need to block a fork?
			board[aiBlockForkValue.substring(0, 1)][aiBlockForkValue.substring(1, 2)] = ai.token;
			aiTurnOver()
		}else if(board[1][1] === ""){
			// Own the center tile
			board[1][1] = ai.token;
			aiTurnOver()
		}else if(aiOppCorner !== null){
			board[aiOppCorner.substring(0,1)][aiOppCorner.substring(1,2)] = ai.token;
			aiTurnOver();
		}else if(aiCorner !== null){
			// play an open corner
			board[aiCorner.substring(0,1)][aiCorner.substring(1,2)] = ai.token;
			aiTurnOver();
		}else{
			// random but should only play the side
			aiTurn();
		}
	}

	function aiTurnOver(){
		isPlayerTurn = true;
		turnCount++;
	}

	// AI Check for winning move
	function aiWin(){
		for(aiWini=0; aiWini<3; aiWini++){
			for(aiWinj=0; aiWinj<3; aiWinj++){
				cloneBoard();
				if(testBoard[aiWini][aiWinj] == ""){
					testBoard[aiWini][aiWinj] = ai.token;
					testWin = winConditions(testBoard, turnCount);
					if(testWin === ai.token){
						return aiWini + "" + aiWinj;
					}
				}
			}
		}
		return null;
	}

	// AI Check to block winning move
	function aiBlock(){
		for(abi=0; abi<3; abi++){
			for(abj=0; abj<3; abj++){
				cloneBoard();
				if(testBoard[abi][abj] == ""){
					testBoard[abi][abj] = player.token;
					testWin = winConditions(testBoard, turnCount);
					if(testWin === player.token){
						return abi + "" + abj;
					}
				}
			}
		}
		return null;
	}

	// AI play opposite corner
	function aiPlayOppCorner(){
		if(board[0][0] === player.token && board[2][2] === ""){
			return "22";
		}
		if(board[0][2] === player.token && board[2][0] === ""){
			return "20";
		}
		if(board[2][0] === player.token && board[0][2] === ""){
			return "02";
		}
		if(board[2][2] === player.token && board[0][0] === ""){
			return "00";
		}

		return null;
	}

	// AI check for open corners
	function aiPlayCorner(){
		if(board[0][0] === ""){
			return "00";
		}

		if(board[0][2] === ""){
			return "02";
		}

		if(board[2][0] === ""){
			return "20";
		}

		if(board[2][2] === ""){
			return "22";
		}

		return null;
	}

	// AI Check for fork to play or block
	function aiFork(token){
		for(afi=0; afi<3; afi++){
			for(afj=0; afj<3; afj++){
				cloneBoard();
				if(testBoard[afi][afj] == ""){
					testBoard[afi][afj] = this.token;
					if(isFork(this.token) > 1){
						return afi + "" + afj;
					}	
				}
			}
		}
		return null;
	}

	// Possible Forks
	function isFork(token){
		return rowFork(this.token) + colFork(this.token) + diaFork(this.token);
	}

	// Check for unblocked rows where a second token can be place
	function rowFork(token){
		rfCount = 0;
		for(rfi=0; rfi<3; rfi++){
			if(testBoard[rfi][0] == testBoard[rfi][1] && testBoard[rfi][2] == "" && testBoard[rfi][1] == this.token){
				rfCount++;
			}

			if(testBoard[rfi][1] == testBoard[rfi][2] && testBoard[rfi][0] == "" && testBoard[rfi][1] == this.token){
				rfCount++;
			}

			if(testBoard[rfi][0] == testBoard[rfi][2] && testBoard[rfi][1] == "" && testBoard[rfi][0] == this.token){
				rfCount++;
			}
		}
		return rfCount;
	}

	// check for unblocked columns where a second token can be placed
	function colFork(token){
		cfCount = 0;
		for(cfi=0; cfi<3; cfi++){
			if(testBoard[0][cfi] == testBoard[1][cfi] && testBoard[2][cfi] == "" && testBoard[1][cfi] == this.token){
				cfCount++;
			}

			if(testBoard[1][cfi] == testBoard[2][cfi] && testBoard[0][cfi] == "" && testBoard[1][cfi] == this.token){
				cfCount++;
			}

			if(testBoard[0][cfi] == testBoard[2][cfi] && testBoard[1][cfi] == "" && testBoard[0][cfi] == this.token){
				cfCount++;
			}
		}
		return cfCount;
	}

	// check for unblock diagonals where a second token can be placed.
	function diaFork(token){
		dfCount = 0;
		if(testBoard[0][0] == testBoard[1][1] && testBoard[2][2] == "" && testBoard[0][0] == this.token){
			dfCount++;
		}

		if(testBoard[1][1] == testBoard[2][2] && testBoard[0][0] == "" && testBoard[1][1] == this.token){
			dfCount++;
		}

		if(testBoard[0][0] == testBoard[2][2] && testBoard[1][1] == "" && testBoard[0][0] == this.token){
			dfCount++;
		}

		if(testBoard[2][0] == testBoard[1][1] && testBoard[0][2] == "" && testBoard[2][0] == this.token){
			dfCount++;
		}

		if(testBoard[0][2] == testBoard[1][1] && testBoard[2][0] == "" && testBoard[0][2] == this.token){
			dfCount++;
		}

		if(testBoard[0][2] == testBoard[2][2] && testBoard[1][1] == "" && testBoard[0][2] == this.token){
			dfCount++;
		}

		return dfCount;
	}

	// Make a clone of the board for AI move test
	function cloneBoard(){
		testBoard = [
				["","",""],
				["","",""],
				["","",""]
			];
		for(cbi=0; cbi<3; cbi++){
			for(cbj=0; cbj<3; cbj++){
				testBoard[cbi][cbj] = board[cbi][cbj];
			}
		}
	}

	// DRAW THE GAME BOARD ****************************************************
	function updateBoard(){
		for(ubi=0; ubi<3; ubi++){
			for(ubj=0; ubj<3; ubj++){
				$("#" + ubi + ubj).html(board[ubi][ubj]);
			}
		}
	}

	// GAME OVER AND WINNING CONDITION LOGIC **********************************

	//checks for win or draw.  Increments score and updates winner div.
	function gameOver(){

		wc = winConditions(board, turnCount);

		switch(wc){
			case null:
				return false;
				break;
			case "X":
			case "O":
				$("#winner").html(wc + " WINS!");
				$("#winner").show();
				incrementScore(wc);
				return true;
				break;
			case "D":
				$("#winner").html("The Cat WINS!");
				$("#winner").show();
				return true;
				break;
		}
	}

	//Checks and returns winner value for X, O, or Draw.  Otherwise returns a null value
	function winConditions(b, tc){
		winRow = checkRows(b);
		winCol = checkCols(b)
		winTD = checkTopDiagonal(b);
		winBD = checkBotDiagonal(b);
		winDraw = checkCat(tc);

		if(winRow !== null){
			return winRow;
		}

		if(winCol !== null){
			return winCol;
		}

		if(winTD !== null){
			return winTD;
		}

		if(winBD !== null){
			return winBD;
		}

		if(winDraw !== null){
			return winDraw;
		}

		return null;
	}

	// Rows win condition
	function checkRows(b){
		for(cri=0; cri<3; cri++){
			if(b[cri][0] === b[cri][1] && b[cri][0] === b[cri][2] && b[cri][0] != ""){
				return b[cri][0];
			}
		}
		return null
	}

	// Columns win condition
	function checkCols(b){
		for(ccj=0; ccj<3; ccj++){
			if(b[0][ccj] === b[1][ccj] && b[0][ccj] === b[2][ccj] && b[0][ccj] != ""){
				return b[0][ccj];
			}
		}
		return null;
	}

	//check top left to bottom right
	function checkTopDiagonal(b){
		if(b[0][0] === b[1][1] && b[0][0] === b[2][2] && b[0][0] != ""){
			return b[0][0];
		}
		return null;
	}

	//check bot left to top right
	function checkBotDiagonal(b){
		if(b[2][0] === b[1][1] && b[2][0] === b[0][2] && b[2][0] != ""){
			return b[2][0];
		}
		return null;
	}

	//check draw
	function checkCat(tc){
		if(tc === 9){
			return "D";
		}
		return null;
	}

	//update scoreboard
	function incrementScore(str){
		if(str === player.token){
			player.wins++;
		}else{
			ai.wins++;
		}
		$("#playerScore").html("PLAYER</br>" + player.wins);
		$("#aiScore").html("CPU</br>" + ai.wins);
	}
});