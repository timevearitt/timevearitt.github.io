$(document).ready(function() {
	var board = [
				["","",""],
				["","",""],
				["","",""]
			];

	var game = {
							isPlayerTurn: true,
							isGameOver: false,
							turnCount: 0,
							gameNum: 0,
							playerToken: "X",
							playerWins: 0,
							aiToken: "O",
							aiWins: 0
	};

	var myMatch;
	var matchInterval = 33;

	// UI EVENTS *********************************************
	
	// Hide Inactive Div's
	$("#info").hide();

	// Select to start the match as X
	$("#X").click(function(event){
		myMatch = setInterval(match, matchInterval);
		$("#selectToken").hide();
		$("#winner").hide();
	});

	// Select to start the match as o
	$("#O").click(function(event){
		game.player = "O";
		game.playerToken = "X";
		game.isPlayerTurn = false;
		myMatch = setInterval(match, matchInterval);
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
		if(game.isPlayerTurn && !game.isGameOver){
			// make player move
			$(".square").click(function(event){
				//BLOCK SCOPE
				{
					// parse click id into selected board row and col
					let sid = event.target.id;
					let row = sid.substring(0,1);
					let col = sid.substring(1,2);
					// is selection valid and game not over?
					if(board[row][col] === "" && game.isPlayerTurn && !game.isGameOver){
						board[row][col] = game.playerToken;
						game.isPlayerTurn = false;
						game.turnCount++;
						game.isGameOver = gameOver();
					}
				}
			});		
		}
		
		// AI TURN
		if(!game.isPlayerTurn && !game.isGameOver){
			hardAiTurn();
			game.isGameOver = gameOver();
		}

		// if game is over show the results
		if(game.isGameOver){
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

		game.turnCount = 0;
		game.gameNum++;

		// rotate first player
		if(game.playerToken === "X"){
			if(game.gameNum % 2 == 0){
				game.isPlayerTurn = true;
			}else{
				game.isPlayerTurn = false;
			}
		}else{
			if(game.gameNum % 2 == 0){
				game.isPlayerTurn = false;
			}else{
				game.isPlayerTurn = true;
			}
		}
		game.isGameOver = false;
		$("#winner").hide();
		$("#info").hide();
	}

		// AI GAME LOGIC******************************************************
	function aiTurn(){
		//BLOCK SCOPE
		{
			let row = Math.floor(Math.random() * 3);
			let col = Math.floor(Math.random() * 3);

			if(board[row][col] === ""){
				board[row][col] = game.aiToken;
				game.isPlayerTurn = true;
				game.turnCount++;
			}else{
				aiTurn();
			}
		}
	}

	function hardAiTurn(){
		//BLOCK SCOPE
		{
			let aiWinValue = aiWin();
			let aiBlockValue = aiBlock();
			let aiForkValue = aiFork(game.aiToken);
			let aiBlockForkValue = aiFork(game.playerToken);
			let aiOppCorner = aiPlayOppCorner();
			let aiCorner = aiPlayCorner();

			if(aiWinValue !== null){
				// Can I win?
				board[aiWinValue.substring(0, 1)][aiWinValue.substring(1, 2)] = game.aiToken;
				aiTurnOver()
			}else if(aiBlockValue !== null){
				// Do I need to block the player?
				board[aiBlockValue.substring(0, 1)][aiBlockValue.substring(1, 2)] = game.aiToken;
				aiTurnOver()
			}else if(aiForkValue !== null){
				// Can I fork?
				board[aiForkValue.substring(0, 1)][aiForkValue.substring(1, 2)] = game.aiToken;
				aiTurnOver()
			}else if(aiBlockForkValue !== null){
				// Do I need to block a fork?
				board[aiBlockForkValue.substring(0, 1)][aiBlockForkValue.substring(1, 2)] = game.aiToken;
				aiTurnOver()
			}else if(board[1][1] === ""){
				// Own the center tile
				board[1][1] = game.aiToken;
				aiTurnOver()
			}else if(aiOppCorner !== null){
				board[aiOppCorner.substring(0,1)][aiOppCorner.substring(1,2)] = game.aiToken;
				aiTurnOver();
			}else if(aiCorner !== null){
				// play an open corner
				board[aiCorner.substring(0,1)][aiCorner.substring(1,2)] = game.aiToken
				aiTurnOver();
			}else{
				// random but should only play the side
				aiTurn();
			}
		}
	}

	function aiTurnOver(){
		game.isPlayerTurn = true;
		game.turnCount++;
	}

	// AI Check for winning move
	function aiWin(){
		// BLOCK SCOPE
		{
			let i;
			let j;

			for(i=0; i<3; i++){
				for(j=0; j<3; j++){
					cloneBoard();
					if(testBoard[i][j] == ""){
						testBoard[i][j] = game.aiToken;
						testWin = winConditions(testBoard, game.turnCount);
						if(testWin === game.aiToken){
							return i + "" + j;
						}
					}
				}
			}
			return null;
		}
	}

		// AI Check to block winning move
	function aiBlock(){
		// BLOCK SCOPE
		{
			let i;
			let j;

			for(i=0; i<3; i++){
				for(j=0; j<3; j++){
					cloneBoard();
					if(testBoard[i][j] == ""){
						testBoard[i][j] = game.playerToken;
						testWin = winConditions(testBoard, game.turnCount);
						if(testWin === game.playerToken){
							return i + "" + j;
						}
					}
				}
			}
			return null;
		}
	}

		// AI play opposite corner
	function aiPlayOppCorner(){
		if(board[0][0] === game.playerToken && board[2][2] === ""){
			return "22";
		}
		if(board[0][2] === game.playerToken && board[2][0] === ""){
			return "20";
		}
		if(board[2][0] === game.playerToken && board[0][2] === ""){
			return "02";
		}
		if(board[2][2] === game.playerToken && board[0][0] === ""){
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
		//BLOCK SCOPE
		{
			let i;
			let j;

			for(i=0; i<3; i++){
				for(j=0; j<3; j++){
					cloneBoard();
					if(testBoard[i][j] == ""){
						testBoard[i][j] = this.token;
						if(isFork(this.token) > 1){
							return i + "" + j;
						}	
					}
				}
			}
			return null;
		}
	}

	// Possible Forks
	function isFork(token){
		return rowFork(this.token) + colFork(this.token) + diaFork(this.token);
	}

		// Check for unblocked rows where a second token can be place
	function rowFork(token){
		{
			let i;
			let j;

			let rfCount = 0;
			for(i=0; i<3; i++){
				if(testBoard[i][0] == testBoard[i][1] && testBoard[i][2] == "" && testBoard[i][1] == this.token){
					rfCount++;
				}

				if(testBoard[i][1] == testBoard[i][2] && testBoard[i][0] == "" && testBoard[i][1] == this.token){
					rfCount++;
				}

				if(testBoard[i][0] == testBoard[i][2] && testBoard[i][1] == "" && testBoard[i][0] == this.token){
					rfCount++;
				}
			}
			return rfCount;
		}
	}

		// check for unblocked columns where a second token can be placed
	function colFork(token){
		//BLOCK SCOPE
		{
			let i;
			let j;

			let cfCount = 0;
			for(i=0; i<3; i++){
				if(testBoard[0][i] == testBoard[1][i] && testBoard[2][i] == "" && testBoard[1][i] == this.token){
					cfCount++;
				}

				if(testBoard[1][i] == testBoard[2][i] && testBoard[0][i] == "" && testBoard[1][i] == this.token){
					cfCount++;
				}

				if(testBoard[0][i] == testBoard[2][i] && testBoard[1][i] == "" && testBoard[0][i] == this.token){
					cfCount++;
				}
			}
			return cfCount;
		}
	}

		// check for unblock diagonals where a second token can be placed.
	function diaFork(token){
		// BLOCK SCOPE
		{
			let dfCount = 0;
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
	}

		// Make a clone of the board for AI move test
	function cloneBoard(){
		testBoard = [
				["","",""],
				["","",""],
				["","",""]
			];

		//BLOCK SCOPE
		{
			let i;
			let j;

			for(i=0; i<3; i++){
				for(j=0; j<3; j++){
					testBoard[i][j] = board[i][j];
				}
			}
		}
	}

		// DRAW THE GAME BOARD ****************************************************
	function updateBoard(){

		//BLOCK SCOPE
		{
			let i;
			let j;

			for(i=0; i<3; i++){
				for(j=0; j<3; j++){
					$("#" + i + j).html(board[i][j]);
				}
			}
		}
	}

		// GAME OVER AND WINNING CONDITION LOGIC **********************************

	//checks for win or draw.  Increments score and updates winner div.
	function gameOver(){

		let wc = winConditions(board, game.turnCount);

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
		let winRow = checkRows(b);
		let winCol = checkCols(b)
		let winTD = checkTopDiagonal(b);
		let winBD = checkBotDiagonal(b);
		let winDraw = checkCat(tc);

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
		// BLOCK SCOPE
		{
			let i;
			let j;

			for(i=0; i<3; i++){
				if(b[i][0] === b[i][1] && b[i][0] === b[i][2] && b[i][0] != ""){
					return b[i][0];
				}
			}
			return null;
		}
	}

		// Columns win condition
	function checkCols(b){
		// BLOCK SCOPE
		{
			let j;

			for(j=0; j<3; j++){
				if(b[0][j] === b[1][j] && b[0][j] === b[2][j] && b[0][j] != ""){
					return b[0][j];
				}
			}
			return null;
		}
	}

	//check top left to bottom right
	function checkTopDiagonal(b){
		{
			if(b[0][0] === b[1][1] && b[0][0] === b[2][2] && b[0][0] != ""){
				return b[0][0];
			}
			return null;
		}
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
		if(str === game.playerToken){
			game.playerWins++;
		}else{
			game.aiWins++;
		}
		$("#playerScore").html("PLAYER</br>" + game.playerWins);
		$("#aiScore").html("CPU</br>" + game.aiWins);
	}

});