let debug = false;

let board = !debug? [
	new Array(3),
	new Array(3),
	new Array(3)
] : [
	['X',,,],
	['O','O',,],
	new Array(3)
];


//the width for each block
let w;

//letter for human and AI
let human = 'O';
let AI = human == 'O' ? 'X' : 'O';

let turn = human;

let winner;

function setup() {
	//initialize stuff
	let m = Math.min(windowWidth, windowHeight);
	createCanvas(m/2, m/2);
	w = (width - 1) / 3;
	textSize(w / 2);
	textAlign(CENTER, CENTER);
}

function draw() {
	background(255);

	//draw the board
	for (let i = 0; i < 3; ++i) {
		for (let j = 0; j < 3; ++j) {
			noFill();
			rect(j * w, i * w, w, w);
			fill(0);
			if (board[i][j] == 'X') text('X', j * w + w / 2, i * w + w / 2);
			else if (board[i][j] == 'O') text('O', j * w + w / 2, i * w + w / 2);
		}
	}

	// //the AI plays based on minimax score
	if (!debug && turn == AI && winner == undefined) {
		let bestScore, bestI, bestJ;
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				if (board[i][j] == undefined) {
					let score = minimax(board, i, j, false);
					if (bestScore == undefined || score > bestScore) {
						bestScore = score;
						bestI = i;
						bestJ = j;
					}
				}
			}
		}
		board[bestI][bestJ] = AI;
		turn = human;

		//check if any winner update is upon us
		winner = getWinner(board);
		if (winner != undefined) {
			createP(`${winner} won`);
		}
	}
}

function mousePressed() {
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && winner == undefined && turn == human) {
		//find the block underneath the mouse
		const i = Math.floor(mouseY / w);
		const j = Math.floor(mouseX / w);

		//if the selected block is empty
		if (board[i][j] == undefined) {
			board[i][j] = human;

			turn = AI;

			//check if any winner update is upon us
			winner = getWinner(board);
			if (winner != undefined) {
				createP(`${winner} won`);
			}
		}
	}
}



function getWinner(board) {
	//check rows
	for (let i = 0; i < 3; ++i) {
		if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
			if (board[i][0] == 'X') return 'X';
			else if (board[i][0] == 'O') return 'O';
		}
	}

	//check cols
	for (let j = 0; j < 3; ++j) {
		if (board[0][j] == board[1][j] && board[1][j] == board[2][j]) {
			if (board[0][j] == 'X') return 'X';
			else if (board[0][j] == 'O') return 'O';
		}
	}

	//check diagonals
	if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
		if (board[0][0] == 'X') return 'X';
		else if (board[0][0] == 'O') return 'O';
	}
	if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
		if (board[0][2] == 'X') return 'X';
		else if (board[0][2] == 'O') return 'O';
	}

	//huh! no one won
	return undefined;
}

//The minimax algorithm for the AI
function minimax(board, posI, posJ, maximizing) {
	//console.log(`At ${posI}, ${posJ} for ${maximizing? AI : human}\n**************`);
	const b = clone(board);
	b[posI][posJ] = maximizing? human : AI;
	const currentWinner = getWinner(b);

	//showBoard(b);
	//console.log(winner);

	//Assign sores based on winner
	if (currentWinner == AI) return 1;
	else if (currentWinner == human) return -1;
	else if (allFull(b)) return 0;

	//The game is not over yet!
	else {
		let bestScore;
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 3; ++j) {
				if (b[i][j] == undefined) {
					let score = minimax(b, i, j, !maximizing);
					//console.log(`score at ${i}, ${j} : ${score}`);
					if (bestScore == undefined || (maximizing && score > bestScore) || (!maximizing && score < bestScore)) bestScore = score;
				}
			}
		}
		return bestScore;
	}
}


function allFull(board) {
	for (let i = 0; i < 3; ++i) {
		for (let j = 0; j < 3; ++j) {
			if (board[i][j] == undefined) return false;
		}
	}
	return true;
}



function clone(arr2d) {
	const arr = [];
	for (let i = 0; i < arr2d.length; ++i) arr.push(arr2d[i].slice());
	return arr;
}


function minStat() {
	for (let i = 0; i < 3; ++i) {
		for (let j = 0; j < 3; ++j) {
			if (board[i][j] == undefined) console.log(`At ${i},${j} : ${minimax(board,  i, j, false)}`);
		}
	}
}


function showBoard(board) {
	for (let i = 0; i < 3; ++i) {
		let str = '';
		for (let j = 0; j < 3; ++j) {
			if (board[i][j] != undefined) str += board[i][j] + '|';
			else str += '_|';
		}
		console.log(str);
	}
}
