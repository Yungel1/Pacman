// >=test1
// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

// >=test1
// GAME FRAMEWORK 
var GF = function(){

	// >=test2
 	// variables para contar frames/s, usadas por measureFPS
	var frameCount = 0;
	var lastTime;
	var fpsContainer;
	var fps; 
 	
 	// >=test4
	//  variable global temporalmente para poder testear el ejercicio
	inputStates = {};

	// >=test10
	const TILE_WIDTH=24, TILE_HEIGHT=24;
	var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost
	
	// >=test10
	// hold ghost objects
	var ghosts = {};
	
	// >=test10
	var Ghost = function(id, ctx){

		this.x = null;
		this.y = null;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = null;
		this.homeY = null;

		this.state = null;

		this.draw = function(){
			// test13
			if (this.state != Ghost.SPECTACLES){
				// test10
				ctx.beginPath();
				// This is where the curve begins (P0)
				ctx.moveTo(this.x, this.y+TILE_HEIGHT);
				ctx.quadraticCurveTo(this.x+3*TILE_WIDTH/9, this.y, this.x+TILE_WIDTH/2, this.y+2*TILE_HEIGHT/7);
				ctx.moveTo(this.x+TILE_WIDTH/2, this.y+2*TILE_HEIGHT/7);
				ctx.quadraticCurveTo(this.x+4*TILE_WIDTH/5, this.y, this.x+TILE_WIDTH, this.y+TILE_HEIGHT);
				ctx.lineTo(this.x, this.y+TILE_HEIGHT);
				ctx.closePath();
				// test12 
				if (this.state == Ghost.NORMAL){
				  ctx.fillStyle = ghostcolor[this.id];
				  ctx.fill();
				  ctx.strokeStyle = ghostcolor[this.id];
				  ctx.stroke();
		
				} else if (this.state == Ghost.VULNERABLE){
				  if (thisGame.ghostTimer>100 || thisGame.ghostTimer%25<12){
					ctx.fillStyle = ghostcolor[4];
					ctx.fill();
					ctx.strokeStyle = ghostcolor[4];
					ctx.stroke();
				  }	else{
					ctx.fillStyle = ghostcolor[5];
					ctx.fill();
					ctx.strokeStyle = ghostcolor[5];
					ctx.stroke();
				  }
				}
			  }
			  
			  //ojoDerecha
			  ctx.beginPath();
			  ctx.arc(this.x+3*TILE_WIDTH/5, this.y+3*TILE_HEIGHT/6, 3, 0, 2 * Math.PI);
			  ctx.closePath();
			  ctx.fillStyle = "white";
			  ctx.fill();
			  ctx.strokeStyle = "white"
			  ctx.stroke();
			  //ojoIzquierda
			  ctx.beginPath();
			  ctx.arc(this.x+3*TILE_WIDTH/12, this.y+3*TILE_HEIGHT/6, 3, 0, 2 * Math.PI);
			  ctx.closePath();
			  ctx.fillStyle = "white";
			  ctx.fill();
	   

		}; // draw
		
		this.move = function() {
			let nextRow; 
			let nextCol; 
			let posX = this.x / TILE_WIDTH;
			let posY = this.y / TILE_HEIGHT;

      
			if(this.state==Ghost.SPECTACLES){
				if(this.x<this.homeX){
					this.velX=1;
					this.velY=0;
				} else if (this.y<this.homeY){
					this.velX=0;
					this.velY=1;
				} else if (this.x>this.homeX){
					this.velX=-1;
					this.velY=0;
				} else if (this.y>this.homeY){
					this.velX=0;
					this.velY=-1;
				}
				
			}else{
			
				// test10
				if(posX % 1 == 0 && posY % 1 == 0){
					let possibleMoves = [[0,-1],[1,0],[0,1],[-1,0]];
					let move;
					let sol = [];
					for(let i = 0; i<possibleMoves.length;i++){
						move = possibleMoves[i];
						if (!thisLevel.isWall(posY+move[1],posX+move[0])){
						sol.push(move);
						}
					}

					if(this.velY<0 || this.velX<0){
						nextRow = Math.floor((this.y + this.velY*this.speed)/TILE_HEIGHT); 
						nextCol = Math.floor((this.x + this.velX*this.speed)/TILE_WIDTH); 
					} else {
						nextRow = Math.ceil((this.y + this.velY*this.speed)/TILE_HEIGHT); 
						nextCol = Math.ceil((this.x + this.velX*this.speed)/TILE_WIDTH); 
					}

					if (sol.length > 2) {
						let randomSol = Math.floor(Math.random() * sol.length);
						this.velX = sol[randomSol][0];
						this.velY = sol[randomSol][1];
					} else if (sol.lenght != 0 && (thisLevel.isWall(nextRow,nextCol)|| (this.velX==0 && this.velY==0))){
						let randomSol = Math.floor(Math.random() * sol.length);
						this.velX = sol[randomSol][0];
						this.velY = sol[randomSol][1];
					}
				} 
			}

			this.x = this.x + this.velX*this.speed;
			this.y = this.y + this.velY*this.speed;
			// test13 
			if(this.state == Ghost.SPECTACLES && this.x==this.homeX  && this.y==this.homeY){
				this.state = Ghost.NORMAL;
			}

		};

	}; // fin clase Ghost
	
	// >=test12
	// static variables
	Ghost.NORMAL = 1;
	Ghost.VULNERABLE = 2;
	Ghost.SPECTACLES = 3;

	// >=test5
	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		this.powerPelletBlinkTimer = 0;

		this.setMapTile = function(row, col, newValue){
			// test5
			if (!this.map[row]) {
      
				this.map[row] = [];
		
			}
		
			this.map[row][col] = newValue;

			if (newValue == 2){
				this.pellets++;
			}
			
		};

		this.getMapTile = function(row, col){
			// test5
			const column = this.map[row]
			if (column) {
			  return column[col];
			}
			return undefined;	
		};

		this.printMap = function(){
			// test5
			console.log(this.map);
		};

		this.loadLevel = function(){
			// test5
			//https://raw.githubusercontent.com/AinhoY/froga/main/1.txt
			fetch('res/levels/1.txt').then(x => x.text()).then(txt => {

				let lines = txt.split("\n");
		  
				let row = 0;
				let elems;
		  
		  
				for (let i = 0; i < lines.length; i++) {
				  elems = lines[i].split(" ");
				  if (elems[1]=="lvlwidth"){
		  
					this.lvlWidth = elems[2];
				  } else if (elems[1]=="lvlheight"){
					this.lvlHeight = elems[2];
				  } else if (elems[0]!=""&&elems[0]!="#"){
					for (let j = 0; j < elems.length; j++){
					  if (elems[j]!=""){
						this.setMapTile(row,j,elems[j]);
					  }
					}
					row += 1;
				  }
		  
				}
			});
			// leer res/levels/1.txt y guardarlo en el atributo map	
			// haciendo uso de setMapTile
		
			// test10
			// Tu código aquí
		};

		// >=test6
         	this.drawMap = function(){

				var TILE_WIDTH = thisGame.TILE_WIDTH;
				var TILE_HEIGHT = thisGame.TILE_HEIGHT;
		  
				var tileID = {
					 'door-h': 20,
				  'door-v': 21,
				  'pellet-power': 3
				};
		  
				// test6
				ctx.fillStyle = "black";
				ctx.fillRect(0,0,600,600);
				this.powerPelletBlinkTimer++;
				for(let i = 0; i<thisGame.screenTileSize[0];i++){
					for (let j = 0; j<thisGame.screenTileSize[1];j++){
						let tile = this.getMapTile(i,j);
					if (tile==0){//Vacío
					
					} else if (tile == 2){//píldora
						ctx.beginPath();
						ctx.arc(j*TILE_WIDTH+TILE_WIDTH/2, i*TILE_HEIGHT+TILE_HEIGHT/2, 5, 0, 2 * Math.PI, false);
						ctx.closePath();
						ctx.fillStyle = 'white';
						ctx.fill();
					} else if (tile == 3){//píldora de poder
						if(this.powerPelletBlinkTimer%60<30){
							ctx.beginPath();
							ctx.arc(j*TILE_WIDTH+TILE_WIDTH/2, i*TILE_HEIGHT+TILE_HEIGHT/2, 5, 0, 2 * Math.PI, false);
							ctx.closePath();
							ctx.fillStyle = 'red';
							ctx.fill();
						}
					} else if (tile == 4){//pacman
						player.homeX = j*TILE_WIDTH;
						player.homeY = i*TILE_HEIGHT;
						if(player.x == null && player.y == null){
							player.x = player.homeX;
							player.y = player.homeY;
						}
				
					
					} else if (tile >= 100 && tile <= 199){//pared
						ctx.fillStyle = "blue";
								ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					} else if (tile == 10 ){//fantasma//test10(lo he puesto yo)
						ghost = ghosts[0];
						ghost.homeX = j*TILE_WIDTH;
						ghost.homeY = i*TILE_HEIGHT;
						if(ghost.x == null && ghost.y == null){
						  ghost.x = ghost.homeX;
						  ghost.y = ghost.homeY;
						}
					} else if (tile == 11 ){//fantasma//test10(lo he puesto yo)
						ghost = ghosts[1];
						ghost.homeX = j*TILE_WIDTH;
						ghost.homeY = i*TILE_HEIGHT;
						if(ghost.x == null && ghost.y == null){
						  ghost.x = ghost.homeX;
						  ghost.y = ghost.homeY;
						}
					}  else if (tile == 12 ){//fantasma//test10(lo he puesto yo)
						ghost = ghosts[2];
						ghost.homeX = j*TILE_WIDTH;
						ghost.homeY = i*TILE_HEIGHT;
						if(ghost.x == null && ghost.y == null){
						  ghost.x = ghost.homeX;
						  ghost.y = ghost.homeY;
						}
					} else if (tile == 13 ){//fantasma//test10(lo he puesto yo)
						ghost = ghosts[3];
						ghost.homeX = j*TILE_WIDTH;
						ghost.homeY = i*TILE_HEIGHT;
						if(ghost.x == null && ghost.y == null){
						  ghost.x = ghost.homeX;
						  ghost.y = ghost.homeY;
						}
					}
				}
			}
		};

		// >=test7
		this.isWall = function(row, col) {
			// test7
			let tile = this.getMapTile(row,col);
			if ((tile >= 100 && tile <= 199)||row<0||col<0||col >= this.lvlWidth||row >= this.lvlHeight){//pared
						  return true
			}
			return false;
		};

		// >=test7
		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
			// test7
			let TILE_WIDTH = thisGame.TILE_WIDTH;
			let TILE_HEIGHT = thisGame.TILE_HEIGHT;
			
			let x = possiblePlayerX/TILE_WIDTH;
			let y = possiblePlayerY/TILE_HEIGHT;
			
			
			let row1 = Math.ceil(y);
			let col1 = Math.ceil(x);
			let row2 = Math.floor(y);
			let col2 = Math.floor(x);
			
			
			if (this.isWall(row1,col1)||this.isWall(row1,col2)||this.isWall(row2,col1)||this.isWall(row2,col2)){
				return true;
			}
	  
			return false;
		};
		
		// >=test11
		this.checkIfHit = function(playerX, playerY, x, y, holgura){
			// Test11
			if (Math.abs(playerX - x) > holgura || Math.abs(playerY -y) > holgura){
				return false;
			}
			console.log("siente el choque");
			return true;
		};

		// >=test8
		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
				'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};
			let TILE_WIDTH = thisGame.TILE_WIDTH;
			let TILE_HEIGHT = thisGame.TILE_HEIGHT;
			
			let x = playerX/TILE_WIDTH;
			let y = playerY/TILE_HEIGHT;
			
			
			let posX = Math.floor(x);
			let posY = Math.floor(y);
			
			let posXround = Math.round(x);
			let posYround = Math.round(y);
			
			/*if (player.direccion == "right" || player.direccion == "down"){
				posX = Math.ceil(x);
						posY = Math.ceil(y);
			} else if (player.direccion == "left" || player.direccion == "up"){
				posX = Math.floor(x);
						posY = Math.floor(y); 
			}*/
          
			if(this.getMapTile(posYround,posXround)==tileID.pellet){
				this.setMapTile(posYround,posXround,0);
				this.pellets--;
			} else if (this.getMapTile(posY,posX)==tileID['door-v'] || this.getMapTile(posY+1,posX)==tileID['door-v']) {	// test9
				if(posY == 0){
					player.y = (thisGame.screenTileSize[0]-2)*TILE_HEIGHT;
				} else{
					player.y = TILE_HEIGHT;
				} 
      	
			} else if (this.getMapTile(posY,posX)==tileID['door-h'] || this.getMapTile(posY,posX+1)==tileID['door-h']) {
				if(posX == 0){
					player.x = (thisGame.screenTileSize[1]-2)*TILE_WIDTH;
				} else{
					player.x = TILE_WIDTH;
				} 
			} else if (this.getMapTile(posYround,posXround)==tileID["pellet-power"]){//test12
				this.setMapTile(posYround,posXround,0);
			  	for (var i=0; i < numGhosts; i++){
					if(ghosts[i].state == Ghost.NORMAL){
						ghosts[i].state = Ghost.VULNERABLE;
					}
				}
			  	thisGame.ghostTimer = 360;
			}
			
			if(this.pellets == 0){
				console.log("Next level!");
			} 
		

		};

	}; // end Level 
	
	// >=test2
	var Pacman = function() {
		this.radius = 10;
		this.x = null;
		this.y = null;
		this.homeX = null;
		this.homeY = null;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
		this.direccion = "right";
		this.direccionPrevia = ""; //test7
	};
	
	// >=test3
	Pacman.prototype.move = function() {
	
		// test3 / test4 / test7
		//test3
		/*if (this.direccion == "d" && this.posX+this.radius>w){
			this.direccion = "i";
		  this.posX -= this.speed;
		} else if (this.direccion == "i" && this.posX+this.radius<0){
			this.direccion = "d";
		  this.posX += this.speed;
		} else if (this.direccion == "i"){
			this.posX -= this.speed;
		} else {
			this.posX += this.speed;
		}*/

		//test4
		/*if ((this.x+this.radius*2+this.speed>w && this.direccion=="right") || (this.x-this.speed<0 && this.direccion=="left") || (this.y+this.radius*2+this.speed>h && this.direccion=="down") || (this.y-this.speed<0 && this.direccion=="up")){
			//Quieto

		} else if (this.direccion == "right" ){
    		
		  	this.x += this.speed;
		} else if (this.direccion == "left" ){
		  	this.x -= this.speed;
		} else if (this.direccion == "down" ){
		  	this.y += this.speed;
		} else if (this.direccion == "up" ){
		  	this.y -= this.speed;
		} else if (this.direccion == "space" ){
		  	console.log("space");
		}*/

		// test7
		let nearestRow = Math.floor(this.y/thisGame.TILE_HEIGHT);
		let nearestCol = Math.floor(this.x/thisGame.TILE_WIDTH);
		let x,y,xy;
		
	
		xy = this.moveAux();
		x = xy[0];
		y = xy[1];
		
		if (!thisLevel.checkIfHitWall(x,y,nearestRow,nearestCol)){
		
			this.x = x;
		  this.y = y;
		  
		} else {
		
			this.direccion = this.direccionPrevia;
			xy = this.moveAux();
			x = xy[0];
			y = xy[1];
		  
			if (!thisLevel.checkIfHitWall(x,y,nearestRow,nearestCol)){
	
			  this.x = x;
			  this.y = y;
	
			}
		}
		
		// >=test8: introduce esta instrucción 
		// dentro del código implementado en el test7:
		// tras actualizar this.x  y  this.y... 
		// check for collisions with other tiles (pellets, etc)
		 thisLevel.checkIfHitSomething(this.x, this.y, this.nearestRow, this.nearestCol);
		
		// test11
		for (var i=0; i< numGhosts; i++){
			//test13
			if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,TILE_WIDTH/2)&&ghosts[i].state==Ghost.VULNERABLE){
				ghosts[i].state=Ghost.SPECTACLES;
			  // Si chocamos contra un fantasma y su estado es Ghost.VULNERABLE
			  // cambiar velocidad del fantasma y pasarlo a modo Ghost.SPECTACLES
			} else if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,TILE_WIDTH/2)&&ghosts[i].state==Ghost.NORMAL){
				// test14
				// Si chocamos contra un fantasma cuando éste esta en estado Ghost.NORMAL --> cambiar el modo de juego a HIT_GHOST
				thisGame.setMode(thisGame.HIT_GHOST);
			}
		}
		// check for collisions with the ghosts
		

	};

	Pacman.prototype.moveAux = function() {
  
		let x,y;
	  
		  if (this.direccion == "right" ){
				  x = this.x + this.speed;
			y = this.y;
			//console.log(nearestRow+","+nearestCol+","+y+","+x);
			} else if (this.direccion == "left" ){
				  x = this.x - this.speed;
			y = this.y;
			} else if (this.direccion == "down" ){
				  y = this.y + this.speed;
			x = this.x;
			} else if (this.direccion == "up" ){
				  y = this.y - this.speed;
			x = this.x;
			} else if (this.direccion == "space" ){
				  console.log("space");
			x = this.x;
			y = this.y;
			} else {
				x = this.x;
			y = this.y;
		}
		
		return [x, y];
	};
	
	
	// >=test2
	// Función para pintar el Pacman
	// En el test2 se llama drawPacman(x, y) {
	Pacman.prototype.draw = function(x,y) {
         
		// Pac Man
		// test2   
		ctx.beginPath();

		ctx.arc(this.x+this.radius+2, this.y+this.radius+2, this.radius, this.angle1 * Math.PI, this.angle2 * Math.PI,false);
		ctx.lineTo(this.x+this.radius+2, this.y+this.radius+2);
		ctx.closePath();
		ctx.fillStyle = "yellow";
		ctx.fill();
		ctx.strokeStyle = 'black';
		ctx.stroke();			     

		// ojo: en el test2 esta función se llama drawPacman(x,y))
    	};
    	
    	// >=test5
	var player = new Pacman();
	
	// >=test10
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}
 
	// >=test5
	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		
		// >=test14
	        setMode : function(mode) {
			this.mode = mode;
			this.modeTimer = 0;
		},
		
		// >=test6
		screenTileSize: [25, 21],//lo hemos cambiado
		
		// >=test5
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		
		// >=test12
		ghostTimer: 0,
		
		// >=test14
		NORMAL : 1,
		HIT_GHOST : 2,
		GAME_OVER : 3,
		WAIT_TO_START: 4,
		modeTimer: 0
	};
	
       // >=test5
	var thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 
	
	// >=test2
	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

		if (diffTime >= 1000) {

			fps = frameCount;    
			frameCount = 0;
			lastTime = newTime;
		}

		// mostrar los FPS en una capa del documento
		// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
	};
	
	// >=test3
	// clears the canvas content
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};

	// >=test4
	var checkInputs = function(){
		
		// test4
		todosFalse = true;
		for (let [key, value] of Object.entries(inputStates)) {
	
		  if (value){
      	player.direccionPrevia = player.direccion; //test7
        player.direccion = key;
        todosFalse = false;
		  }
		}
		/*if (todosFalse){
		  player.direccion = "";
		}*/
		
		// test7
		// Tu código aquí
		// LEE bien el enunciado, especialmente la nota de ATENCION que
		// se muestra tras el test 7
	};

	// >=test12
	var updateTimers = function(){
		// test12
		if (thisGame.ghostTimer > 0){
			thisGame.ghostTimer--;
		} else {
			for (var i=0; i < numGhosts; i++){
				if(ghosts[i].state == Ghost.VULNERABLE){
					ghosts[i].state = Ghost.NORMAL;
				}
			}
		}
        	// Actualizar thisGame.ghostTimer (y el estado de los fantasmas, tal y como se especifica en el enunciado)

		// test14
		thisGame.modeTimer++;
		// actualiza modeTimer...
	};
	
	var cont = 0;
	// >=test1
	var mainLoop = function(time){
    
		// test1 
		/*let canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		let x = Math.floor(Math.random() * 601);
		let y = Math.floor(Math.random() * 601);


		context.beginPath();
		context.arc(x, y, 5, 0, 2 * Math.PI);
		context.fillStyle = "green";
		context.fill();
		context.strokeStyle = 'green';
		context.stroke();*/
		// A partir del test2 deberás borrar lo implementado en el test1
		
    		// >=test2
		// main function, called each frame 
		measureFPS(time);
     
		if(thisGame.mode== thisGame.NORMAL){//test14
			checkInputs();
	  
	  
			let ghostPacmanNull = false;
			// test10
			for (var i=0; i < numGhosts; i++){
			  if(ghosts[i].x == null & ghosts[i].y == null){
				ghostPacmanNull = true;
			  } 
			}
			if (player.x == null && player.y == null){
			  ghostPacmanNull = true;
			} 
	  
			// Mover fantasmas
			if(!ghostPacmanNull){
			  player.move();
			  for (var i=0; i < numGhosts; i++){
				ghosts[i].move();
			  }
			}
	  
			clearCanvas();
	  
			thisLevel.drawMap();
	  
			// Pintar fantasmas
	  
			if(!ghostPacmanNull){
			  player.draw();
			  for (var i=0; i < numGhosts; i++){
				ghosts[i].draw();
			  }
			}
	  
		}else if(thisGame.mode== thisGame.HIT_GHOST){//test14
			if(thisGame.modeTimer==90){
				thisGame.lifes--;
				reset();
				thisGame.setMode(thisGame.WAIT_TO_START);
			}
		}else if(thisGame.mode== thisGame.WAIT_TO_START){//test14
			clearCanvas();
			thisLevel.drawMap();
			player.draw();
			for (var i=0; i < numGhosts; i++){
				ghosts[i].draw();
			}
			if(thisGame.modeTimer==30){
				thisGame.setMode(thisGame.NORMAL);
			}
		}
		  
		  
		  updateTimers();
		  
			  // call the animation loop every 1/60th of second
			  requestAnimationFrame(mainLoop);
	};
	
	// >=test4
	var addListeners = function(){
    
				//add the listener to the main, window object, and update the states
    // test4
    document.onkeydown = function(evt) {
		let key = evt.key;
		if (key == "ArrowLeft") {
		  evt.preventDefault();
				  inputStates.left = true;
  
		} else if (key == "ArrowRight") {
		  evt.preventDefault();
				  inputStates.right = true;
  
		} else if (key == "ArrowDown") {
		  evt.preventDefault();
				  inputStates.down = true;
  
		} else if (key == "ArrowUp") {
		  evt.preventDefault();
		  inputStates.up = true;
  
		} else if (key == " ") {
		  evt.preventDefault();
		  inputStates.space = true;
		}
	  }
  
	  document.onkeyup = function(evt) {
		let key = evt.key;
		if (key == "ArrowLeft") {
		  evt.preventDefault();
				  inputStates.left = false;
  
		} else if (key == "ArrowRight") {
		  evt.preventDefault();
				  inputStates.right = false;
  
		} else if (key == "ArrowDown") {
		  evt.preventDefault();
				  inputStates.down = false;
  
		} else if (key == "ArrowUp") {
		  evt.preventDefault();
		  inputStates.up = false;
  
		} else if (key == " ") {
		  evt.preventDefault();
		  inputStates.space = false;
		}
	  }
	};
	
	
	//>=test7
	var reset = function(){
	
		// test12
		// Tu código aquí
		// probablemente necesites inicializar los atributos de los fantasmas
		// (x,y,velX,velY,state, speed)
		
		// test7
		player.x = player.homeX;
		player.y = player.homeY;
		player.direccion = "right";
		player.direccionPrevia = "right";
	
		// test10
		for (var i=0; i < numGhosts; i++){
			ghosts[i].x = ghosts[i].homeX;
			ghosts[i].y = ghosts[i].homeY;
			ghosts[i].velX = 0;
			ghosts[i].velY = 0;
			ghosts[i].state = Ghost.NORMAL;
		}
		// Inicializa los atributos x,y, velX, velY, speed de la clase Ghost de forma conveniente
		
		// >=test14
		thisGame.setMode( thisGame.NORMAL);
	};
	
	// >=test1
	var start = function(){
	
		// >=test2
		// adds a div for displaying the fps value
		fpsContainer = document.createElement('div');
		document.body.appendChild(fpsContainer);
       	
       	// >=test4
		addListeners();

		// >=test7
		reset();

		// start the animation
		requestAnimationFrame(mainLoop);
	};

	// >=test1
	//our GameFramework returns a public API visible from outside its scope
	return {
		start: start,
		
		// solo para el test 10 
		ghost: Ghost,  // exportando Ghost para poder probarla
		
		// solo para estos test: test12 y test13
		ghosts: ghosts, 
		
		// solo para el test12
		thisLevel: thisLevel,
		
		// solo para el test 13
		Ghost: Ghost,
		
		// solo para el test14
		thisGame: thisGame
	};
};

// >=test1
var game = new GF();
game.start();




