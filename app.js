var referenceGrid = new Array();
var countMoves = 0;
var timer;
var difficulty = "normal";
var userName;

console.log(localStorage.getItem('highScoreValue'));
console.log(localStorage.getItem('highScorePlayer'));

getNameBanner();

function getNameBanner(){
	//getName pop up box
	var getName = document.createElement('div');
	getName.id = 'game-end';

	body = document.querySelector('body');
	
	//form
	var form = document.createElement('form');

	//title: Enter your name
	var enterName = document.createElement('div');
	enterName.classList.add('you-win');
	enterName.textContent = "Enter your name: ";
	enterName.style.fontSize = "2em";
	
	//input: name
	var nameInput = document.createElement('input');
	nameInput.type = "text";
	nameInput.classList.add("text-input");
	
	//submit button
	submitButton = document.createElement('input');
	submitButton.type = "submit";
	submitButton.classList.add('reset');
	submitButton.value = "Submit";
	submitButton.style.marginTop = "-1em";
	submitButton.style.backgroundColor = "darkgreen";
	submitButton.style.border
	submitButton.addEventListener('click', function(e) {
		e.preventDefault();
		if(nameInput.value === "")
		alert("Name must be filled out");
		else {
			userName = nameInput.value;
			submitButton = null;
			form.removeChild(getName);
			selectDifficulty();
		}
	});
	
	//add title, input and submit button to body
	getName.appendChild(enterName);
	getName.appendChild(nameInput);
	getName.appendChild(submitButton);
	form.appendChild(getName);
	body.appendChild(form);
	
}

function selectDifficulty() {
	
	//create wrapper
	wrapper = document.createElement('div');
	wrapper.id = "wrapper";
	
	//create page banner
	pageBanner = document.createElement('div');
	pageBanner.id = "page-banner";

	//create game area
	game = document.createElement('div');
	game.id = "game";

	//create reference grid area
	topRight = document.createElement('div');
	topRight.id = "reference-grid";

	//create bottom right panel
	bottomRight = document.createElement('div');
	bottomRight.id = "bottom-right";

	//append page banner, game area, reference grid area and bottom right area to wrapper
	wrapper.appendChild(pageBanner);
	wrapper.appendChild(game);
	wrapper.appendChild(topRight);
	wrapper.appendChild(bottomRight);

	body.appendChild(wrapper); //append wrapper to body

	generateBanner(); //generate contents of page banner

	//CHOOSE DIFFICULTY
	title = document.createElement('div');
	title.classList.add('you-win');
	title.style.fontSize = "2em";
	title.style.alignSelf = "auto";
	title.innerHTML = "CHOOSE DIFFICULTY: ";
	title.style.color = "#eee"
	title.style.paddingTop = "15px";
	game.appendChild(title);	

	//button: EASY
	button = document.createElement('div');
	button.classList.add('reset');
	button.textContent = "EASY";
	button.style.backgroundColor = "green"; 
	game.appendChild(button);
	button.addEventListener('click', function() {
		difficulty = "easy";
		generateGrid();
		button = null;
	});

	//button: NORMAL
	button1 = document.createElement('div');
	button1.classList.add('reset');
	button1.textContent = "NORMAL";
	button1.style.backgroundColor = "#0055ee"; 
	game.appendChild(button1);
	button1.addEventListener('click', function() {
		difficulty = "normal";
		generateGrid();
		button1 = null;
	});
	
	//button: HARD
	button2 = document.createElement('div');
	button2.classList.add('reset');
	button2.textContent = "HARD";
	button2.style.backgroundColor = "#ee0055"; 
	game.appendChild(button2);
	button2.addEventListener('click', function() {
		difficulty = "hard";
		generateGrid();
		button2 = null;
	});

	//title: CONTROLS
	var title1 = document.createElement('span');
	title1.classList.add('you-win');
	title1.alignItems = "start";
	title1.style.fontSize = "1.8em";
	title1.innerHTML = "CONTROLS:";
	title1.style.color = "#eee"
	title1.style.verticalAlign = "text-top";
	title1.style.gridColumn= "1/4";
	topRight.appendChild(title1);	

	//Up arrow key
	var upArrow = document.createElement('div');
	upArrow.classList.add('arrow-key');
	upArrow.innerHTML = "&#8593";
	upArrow.style.gridArea = "2/2/3/3";
	topRight.appendChild(upArrow);

	//Left arrow key
	var leftArrow = document.createElement('div');
	leftArrow.classList.add('arrow-key');
	leftArrow.innerHTML = "&#8592";
	leftArrow.style.gridArea = "3/1/4/2";
	topRight.appendChild(leftArrow);

	//Down arrow key
	var downArrow = document.createElement('div');
	downArrow.classList.add('arrow-key');
	downArrow.innerHTML = "&#8595";
	downArrow.style.gridArea = "3/2/4/3";
	topRight.appendChild(downArrow);

	//Right arrow key
	var rightArrow = document.createElement('div');
	rightArrow.classList.add('arrow-key');
	rightArrow.innerHTML = "&#8594";
	rightArrow.style.gridArea = "3/3/4/4";
	topRight.appendChild(rightArrow);
	
	//instructions
	var instructions = document.createElement('div');
	instructions.style.gridArea = "1/1/3/2";
	instructions.classList.add('instructions');
	instructions.textContent = "1. Use arrow keys to move tiles around.\r\n\r\n";
	instructions.textContent += "2. Rearrange the middle grid of tiles such that it matches with the reference grid.\r\n\r\n";
	instructions.textContent += "3. Finish before the timer runs out.";
	bottomRight.appendChild(instructions); 
}

function clickStart(e) {
	document.getElementById('gameBGM').loop = true;
	document.getElementById('gameBGM').play();
	document.addEventListener('keydown', moveTile);
	if(difficulty === "easy")
		minute = 4;
	else if(difficulty === "normal")
		minute = 9;
	else
		minute = 14;
	var sec = 59;
	e.target.style.backgroundColor = "crimson";
	e.target.textContent = "RESET";
	e.target.setAttribute('onclick', 'location.reload()');
	timer = setInterval(function () {
		secText = String(sec);
		sec < 10 ? secText = '0' + secText: true;
		document.querySelector("#bottom-right .score").innerHTML = minute + " : " + secText;
		if (sec == 0) {
			if (minute == 0) {
				gameEndBanner();
				clearInterval(timer);
			}
			sec = 60;
			minute--;
		}	
		sec--;
	}, 1000);
	timer;
	e.target.removeEventListener('click', clickStart);
}

function moveTile(e) {
	var upTile, downTile, leftTile, rightTile;
	movableTiles = getDraggableTiles();
	var empty = document.querySelector(".empty:empty");
	rowStart = empty.style.gridRowStart;
	colStart = empty.style.gridColumnStart;
	for(movableTile of movableTiles) { 
		if(movableTile.parentNode.style.gridRowStart > rowStart)
			downTile = movableTile;
		else if(movableTile.parentNode.style.gridRowStart < rowStart)
			upTile = movableTile;
		else if(movableTile.parentNode.style.gridColumnStart > colStart)
			rightTile = movableTile;
		else
			leftTile = movableTile;
	}
	if(e.key == "ArrowDown" && upTile !== undefined)		
		empty.append(upTile);
	else if(e.key == "ArrowUp" && downTile !== undefined)		
		empty.append(downTile);
	else if(e.key == "ArrowLeft" && rightTile !== undefined)		
		empty.append(rightTile);
	else if(e.key == "ArrowRight" && leftTile !== undefined)
		empty.append(leftTile);
	else
		--countMoves;
	++countMoves;
	if(gridMatches(difficulty)) {
		gameEndBanner("WIN");
		document.removeEventListener('keydown', moveTile);
	}
}

function gameEndBanner(endType) {
	
	clearInterval(timer);
	
	document.getElementById('gameBGM').pause(); //pause music
	
	//score calculation
	if(difficulty === "easy")
		numerator = 1000000;
	else if(difficulty === "normal")
		numerator = 10000000;
	else
		numerator = 100000000;
	scoreNumber = Math.floor(numerator/countMoves);
	scoreNumber = String(scoreNumber) === "Infinity" ? 0:scoreNumber;

	//Game Over pop up box
	gameEnd = document.createElement('div');
	gameEnd.id = 'game-end';
	gameEnd.style.gridTemplateRows = "2fr 1fr 1fr 1fr 1fr";
	gameEnd.style.height = "50%";
	gameEnd.style.marginTop = "9em";

	//title: YOU WIN / YOU LOSE!
	body = document.querySelector('body');
	youWin = document.createElement('div');
	youWin.classList.add('you-win');
	if(endType == "WIN") {
		youWin.textContent = "YOU WIN!";
		document.getElementById('victoryBGM').play();
	}
	else {
		youWin.textContent = "YOU LOSE!";
		scoreNumber /= 100;
		document.getElementById('loseBGM').play();
	}	
	
	var difficultyHighScoreValue = difficulty + 'HighScoreValue'; //high score value of given game difficulty
	var difficultyHighScorePlayer = difficulty + 'HighScorePlayer'; //high score player of given game difficulty

	//local storage of high score
	if(localStorage.getItem(difficultyHighScoreValue) == null || localStorage.getItem(difficultyHighScoreValue) < scoreNumber) {
		localStorage.setItem(difficultyHighScoreValue, scoreNumber);
		localStorage.setItem(difficultyHighScorePlayer, userName);
	}

	//Score display
	score = document.createElement('div');
	score.classList.add('score');
	score.textContent = "Your score: " + String(scoreNumber);

	//Top scorer display
	topScorer = document.createElement('div');
	topScorer.classList.add('score');
	topScorer.style.fontSize = "1.5em";
	topScorer.textContent = "Top scorer: " + localStorage.getItem(difficultyHighScorePlayer);

	//Top score display
	topScore = document.createElement('div');
	topScore.classList.add('score');
	topScore.style.fontSize = "1.5em";
	topScore.textContent = "Top Score: " + String(localStorage.getItem(difficultyHighScoreValue));

	//reset button
	reset = document.createElement('div');
	reset.classList.add('reset');
	reset.textContent = "RESET";
	reset.style.marginBottom = "1.5em";
	reset.addEventListener('click',() => {location.reload()});
	
	//add title, score, and reset button to html
	gameEnd.appendChild(youWin);
	gameEnd.appendChild(score);
	gameEnd.appendChild(topScorer);
	gameEnd.appendChild(topScore);
	gameEnd.appendChild(reset);
	body.appendChild(gameEnd);
}

function generateBanner(){	
	const banner = document.querySelector("#page-banner");
	const title = "COLORTILES";	
	var titleColours = ["#BDBA06", "#8cb5e8", "#5dba51", 
						"#7f7bd3", "#22CCAC", "#b073bf", 
						"#da3f1b", "#aef4c4", "#e217c7", 
						"#b5d194"];
	for(i = 0; i < title.length; ++i) {
		var letter = document.createElement('div');
		letter.classList.add("game-title");
		letter.textContent = title[i];
		var randomColourIndex = Math.floor(Math.random() * titleColours.length);
		var randomColour = titleColours[randomColourIndex];
		letter.style.color = randomColour;
		titleColours.splice(randomColourIndex, 1);
		banner.appendChild(letter);		
	}
	var createdBy = document.createElement('div');
	createdBy.id = "about";
	createdBy.textContent = "A game by Kiran Srinivasan";
	banner.appendChild(createdBy);
	var wordGithub = document.createElement('div');
	wordGithub.textContent = "Github: ";
	var github = document.createElement('a');
	wordGithub.id = "socials";
	github.textContent = "@ghadilion";
	github.target = "_blank";
	github.href = "https://github.com/ghadilion";
	wordGithub.appendChild(github);
	banner.appendChild(wordGithub);
}

function generateGrid(){
	outer = document.querySelector('#game');  
    
	outer.innerHTML = "";

	var baseColours = ['#ddc246','#eb7a9b','#02daa4','#e67326','#98c5da','#da5fe6'];
	var fillColours = new Array();
		
	if(difficulty == "easy") {
		outer.style.gridTemplateRows = outer.style.gridTemplateColumns = "repeat(5, 1fr)";
		gridLength = 5;
		bRadius = 20;
	}
	else if(difficulty === "normal") {
		outer.style.gridTemplateRows = outer.style.gridTemplateColumns = "repeat(6, 1fr)";
		gridLength = 6;
		baseColours.push("#7dfe2f");
		bRadius = 15;
	}
	else if(difficulty === "hard") {
		outer.style.gridTemplateRows = outer.style.gridTemplateColumns = "repeat(7, 1fr)";
		gridLength = 7;
		baseColours.push("#ff954f");
		baseColours.push("#7dfe2f");
		bRadius = 12;
	}
	
	for(var i = 0; i < gridLength + 1; ++i)
		for(var j = 0; j < gridLength - 1; ++j)
			fillColours.push(baseColours[i]);

	var referenceGridColours = fillColours.slice(0);

	highlighter = document.createElement('div');
	highlighter.id = "highlighter";
	highlighter.style.gridArea = String(2) + "/" + String(2) + "/" + String(gridLength) + "/" + String(gridLength);
	outer.append(highlighter);
	
	for(i = 1; i <= gridLength; ++i){
		for(j = 1; j <= gridLength; ++j){
			bottomTile = document.createElement('div');
			bottomTile.classList.add("empty");
			bottomTile.style.gridArea = String(i) + "/" + String(j) + "/" + String(i+1) + "/" + String(j+1);
			
			if(i*j != gridLength*gridLength){
				var randomColourIndex = Math.floor(Math.random() * fillColours.length);
				var randomColour = fillColours[randomColourIndex];
				topTile = document.createElement('div');
				topTile.classList.add('fill');
				topTile.style.borderRadius = String(bRadius) + "px";
				topTile.style.background = randomColour;
				fillColours.splice(randomColourIndex, 1);
				bottomTile.appendChild(topTile);
			} 
			
			outer.appendChild(bottomTile); 	
		}
	}
	generateReferenceGrid(referenceGridColours, gridLength, bRadius);
}

function generateReferenceGrid(colours, gridLength, bRadius) {
	outer = document.querySelector('#reference-grid');  
	
	outer.innerHTML = "";

	outer.style.columnGap = outer.style.rowGap = "0." + (10 - gridLength) + "em";
	outer.style.gridTemplateRows = outer.style.gridTemplateColumns = "repeat(" + (gridLength-2) + ", 1fr)";
	for(i = 1; i <= (gridLength-2)**2; ++i){
		Tile = document.createElement('div');
		Tile.classList.add("fill");
		var randomColourIndex = Math.floor(Math.random() * colours.length);
		var randomColour = colours[randomColourIndex];
		Tile.style.backgroundColor = randomColour;
		Tile.style.borderRadius = String(bRadius-5) + "px";
		referenceGrid.push(Tile.style.backgroundColor);
		colours.splice(randomColourIndex, 1);
		outer.appendChild(Tile); 
	}
	generateBottomRight();
}

function generateBottomRight(){	
	var outer = document.querySelector('#bottom-right');
	outer.innerHTML = "";
	//START button
	var startButton = document.createElement('div');
	startButton.classList.add('reset');
	startButton.textContent = "START";
	outer.appendChild(startButton);
	startButton.addEventListener('click', function(e){clickStart(e)});

	//Timer
	if(difficulty === 'easy')
		startTime = 5;
	else if(difficulty === 'normal')
		startTime = 10;
	else if(difficulty === 'hard')
		startTime = 15;
	var timer = document.createElement('div');
	timer.classList.add('score');
	timer.textContent = String(startTime) + ' : 00';
	outer.appendChild(timer);
	


}

function getDraggableTiles(){
	const empty = document.querySelector(".empty:empty");
	var filledAndDraggable = [];
	rowStart = empty.style.gridRowStart;
	rowEnd = empty.style.gridRowEnd;
	colStart = empty.style.gridColumnStart;
	colEnd = empty.style.gridColumnEnd;
	fillTiles = document.querySelectorAll(".fill");
	for(fillTile of fillTiles) {
		parent = fillTile.parentNode.style;
		if( parent.gridArea == concatenate(parseInt(rowStart) - 1, colStart, parseInt(rowEnd) - 1, colEnd) ||
			parent.gridArea == concatenate(parseInt(rowStart) + 1, colStart, parseInt(rowEnd) + 1, colEnd) ||
			parent.gridArea == concatenate(rowStart, parseInt(colStart) - 1, rowEnd, parseInt(colEnd) - 1) ||
			parent.gridArea == concatenate(rowStart, parseInt(colStart) + 1, rowEnd, parseInt(colEnd) + 1)
		) {
			filledAndDraggable.push(fillTile);
		}
	}
	return filledAndDraggable;
}

function concatenate(tRowStart, tColStart, tRowEnd, tColEnd) {
	return String(tRowStart) + " / " + String(tColStart) + " / " + String(tRowEnd) + " / " + String(tColEnd);
}

function gridMatches(difficulty){
	allTiles = document.querySelectorAll("#game .fill");
	midTiles = new Array();
	
	if (difficulty === "easy")
		gridLength = 5;
	else if(difficulty === "normal")
		gridLength = 6;
	else if(difficulty === "hard")
		gridLength = 7;

	for(tile of allTiles) { 
		rowStart = tile.parentNode.style.gridRowStart;
		rowEnd = tile.parentNode.style.gridRowEnd;
		colStart = tile.parentNode.style.gridColumnStart;
		colEnd = tile.parentNode.style.gridColumnEnd;
		if(rowStart >= 2 && rowEnd <= gridLength && colStart >= 2 && colEnd <= gridLength) {
			midTiles.push(tile.style.backgroundColor);
		}
	}
	for(var i = 0; i < (gridLength-2)**2; ++i) {
		if(referenceGrid[i] != midTiles[i])
			return false;
	}
	return true;
}