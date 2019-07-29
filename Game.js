/**
* Code for the game is stored in this file
*/

/* Variable declarations */

//Obstacles to avoid hitting
var obstacle1;
var obstacle2;
var obstacle3;
var obstacle4;
var obstacle5;

//Win condition (0/1)
var win = 0;

//Wing flapping sound effect
var wingSound;

//Our player character
var phillipswee;

//Game Area object
var gameArea = {
	
	//Canvas: for displaying the game
	canvas : document.createElement("canvas"),
	
	//Initialize the game area
	initalize : function() {
		this.canvas.width = 300;
		this.canvas.height = 450;
		this.context = this.canvas.getContext("2d");
		
		//Add the canvas to the Game tab
		var content = document.getElementById("gameContent");
		content.appendChild(this.canvas);
		
		//Set refresh rate
		this.interval = setInterval(updategameArea, 30);
		
		//When a key is pressed
		window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = (e.type == "keydown");
        })
		
		//When the key is no longer pressed
		window.addEventListener('keyup', function (e) {
			gameArea.keys[e.keyCode] = false; 
		})
	},
	
	//Refresh
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},	
	
	//When a hit is registered, this is called and Phillipswee's sprite is reset
	stop : function() {
        phillipswee.reset();
    }    
}

/* Function declarations */

/**
* Function to start the game, called when the game tab is opened.
*/
function startGame(){
	gameArea.initalize();
	wingSound = new sound("assets/wing_flap.wav");
	phillipswee = new component(30, 40, "assets/phillipswee_left.png", 100, 400, "image");
	obstacle1 = new component(100, 20, "assets/obstacle_brick.png", 10,50, "image");
	obstacle2 = new component(100, 20, "assets/obstacle_brick.png", 100,200, "image");
	obstacle3 = new component(100, 20, "assets/obstacle_brick.png", 10,300, "image");
	obstacle4 = new component(100, 20, "assets/obstacle_brick.png", 200,200, "image");
	obstacle5 = new component(100, 20, "assets/obstacle_brick.png", 200,400, "image");
}

/**
* Function for defining a game component
*/
function component(width, height, colour, x, y, type) {
	this.type = type;
	this.lastDirection = "left";
	if (type == "image") {
		this.image = new Image();
		this.image.src = colour;
	}
	
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y; 
	this.speedX = 0;
    this.speedY = 0;   
	this.gravity = 3;
	this.gravitySpeed = 0;	
	gameContext = gameArea.context;
	gameContext.fillStyle = colour;
	gameContext.fillRect(this.x, this.y, this.width, this.height);
	
	//For redrawing sprites
	this.update = function(){
		gameContext = gameArea.context;
		if (type == "image") {
		    gameContext.drawImage(this.image, this.x, this.y, 
				this.width, this.height);
		} else {
			gameContext.fillStyle = colour;
			gameContext.fillRect(this.x, this.y, this.width, this.height);
		}
	}
		
	//For updating the position of the sprite	
	this.newPos = function() {
		this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed; 
		this.hitGround();	
    }
	
	//Check if a sprite is at the bottom of the window
	this.hitGround = function() {
		var bottom = gameArea.canvas.height - this.height;
		if (this.y > bottom) {
			this.y = bottom;
		}
		this.gravitySpeed=0;
	}
	
	//Collision checker, if the sprites are overlapping, 
	//then a hit is registerd
	this.isHit = function(obj) {
		var thisLeftEdge = this.x;
		var thisRightEdge = this.x + this.width;
		var thisTopEdge = this.y;
		var thisBottomEdge = this.y + this.height;
		
		var otherLeftEdge = obj.x;
		var otherRightEdge = obj.x + obj.width;
		var otherTopEdge = obj.y;
		var otherBottomEdge = obj.y + obj.height;
		
		var hit = true;
		
		if ((thisBottomEdge < otherTopEdge) || 
			(thisTopEdge > otherBottomEdge) || 
			(thisRightEdge < otherLeftEdge) || 
			(thisLeftEdge > otherRightEdge)) {
				hit = false;
		}
		
		return hit;
	}

	//Used specifically for Phillipswee, resets him to the bottom
	this.reset = function() {
		this.x = 100;
		this.y = 400; 
		this.speedX = 0;
		this.speedY = 0;   
		this.gravity = 3;
		this.gravitySpeed = 0;	
		
	}
		
}

/**
* Updates the game area, making Phillipswee and other elements move
*/
function updategameArea() {
	
	//If we've won, display the win screen
	if(win == 1){
		var end = new component(300,450, "assets/frame6.png", 0, 0, "image");
		end.update();
			
	}
	else{
		
		//If we collide with an obstacle, stop and reset
		if(phillipswee.isHit(obstacle1) || phillipswee.isHit(obstacle2) 
			|| phillipswee.isHit(obstacle3) || phillipswee.isHit(obstacle4) 
			|| phillipswee.isHit(obstacle5) || phillipswee.x>=300 || phillipswee.x<=0){
			gameArea.stop();
		}
		
		//We win if we get to the top
		if(phillipswee.y<=0){
			win = 1;
		}
		
		//reset game area and character's speed
		gameArea.clear();
		phillipswee.speedX = 0;
		phillipswee.speedY = 0;    
		
		//Control and sprite changes
		if (gameArea.keys && gameArea.keys[68]) { //d or right
			phillipswee.image.src = "assets/phillipswee_right.png";
			phillipswee.lastDirection = "right";
			phillipswee.speedX = 3; 
		} 	
		if (gameArea.keys && gameArea.keys[65]) { //a or left
			phillipswee.image.src = "assets/phillipswee_left.png";
			phillipswee.lastDirection = "left";
			phillipswee.speedX = -3; 
		}
		if (gameArea.keys && gameArea.keys[87]) { //w or fly
			wingSound.play();
			if(phillipswee.lastDirection === "right"){
				phillipswee.image.src = "assets/phillipswee_descend_right.png";
			} 
			else {
				phillipswee.image.src = "assets/phillipswee_descend_left.png";
			}
				
			phillipswee.speedY = -7;	
		} 	
		
		//updates
		phillipswee.newPos();
		obstacle1.update();
		obstacle2.update();
		obstacle3.update();
		obstacle4.update();
		obstacle5.update();
		phillipswee.update();

	}
}

/**
* Allows us to play sound
* Definition taken from: https://www.w3schools.com/graphics/game_sound.asp
*/
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

















