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

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = 0;
		this.homeY = 0;

		this.draw = function(){
			// test10
			// Tu código aquí
			// Pintar cuerpo de fantasma	
			// Pintar ojos 
	
		
			// test12 
			// Tu código aquí
			// Asegúrate de pintar el fantasma de un color u otro dependiendo del estado del fantasma y de thisGame.ghostTimer
			// siguiendo el enunciado

			// test13 
			// Tu código aquí
			// El cuerpo del fantasma sólo debe dibujarse cuando el estado del mismo es distinto a Ghost.SPECTACLES

		}; // draw
		
		this.move = function() {
			// test10
			// Tu código aquí

		
			// test13 
			// Tu código aquí
			// Si el estado del fantasma es Ghost.SPECTACLES
			// Mover el fantasma lo más recto posible hacia la casilla de salida
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
	    			'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3
			};
		
			// test6
			var TILE_WIDTH = thisGame.TILE_WIDTH;
			var TILE_HEIGHT = thisGame.TILE_HEIGHT;

			var tileID = {
				'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3
			};
			// test6
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,600,600);
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
					ctx.beginPath();
					ctx.arc(j*TILE_WIDTH+TILE_WIDTH/2, i*TILE_HEIGHT+TILE_HEIGHT/2, 5, 0, 2 * Math.PI, false);
					ctx.closePath();
					ctx.fillStyle = 'red';
					ctx.fill();
				} else if (tile == 4){//pacman

				} else if (tile >= 100 && tile <= 199){//pared
					ctx.fillStyle = "blue";
							ctx.fillRect(j*TILE_WIDTH,i*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
				} else{//fantasma
				
				} 
				}
			}
		};

		// >=test7
		this.isWall = function(row, col) {
			// test7
			// Tu código aquí
		};

		// >=test7
		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
			// test7
			// Tu código aquí
			// Determinar si el jugador va a moverse a una fila,columna que tiene pared 
			// Hacer uso de isWall
		};
		
		// >=test11
		this.checkIfHit = function(playerX, playerY, x, y, holgura){
			// Test11
			// Tu código aquí	
		};

		// >=test8
		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    			'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};
			
			// test8
			// Tu código aquí
			// Gestiona la recogida de píldoras
			
			// test9
			// Tu código aquí
			// Gestiona las puertas teletransportadoras
			
			// test12
			// Tu código aquí
			// Gestiona la recogida de píldoras de poder
			// (cambia el estado de los fantasmas)

		};

	}; // end Level 
	
	// >=test2
	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
		this.direccion = "d";
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
		if ((this.x+this.radius*2+this.speed>w && this.direccion=="right") || (this.x-this.speed<0 && this.direccion=="left") || (this.y+this.radius*2+this.speed>h && this.direccion=="down") || (this.y-this.speed<0 && this.direccion=="up")){
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
		}
		
		// >=test8: introduce esta instrucción 
		// dentro del código implementado en el test7:
		// tras actualizar this.x  y  this.y... 
		// check for collisions with other tiles (pellets, etc)
		 thisLevel.checkIfHitSomething(this.x, this.y, this.nearestRow, this.nearestCol);
		
		// test11
		// Tu código aquí
		// check for collisions with the ghosts
		
		// test13 
		// Tu código aquí 
		// Si chocamos contra un fantasma y su estado es Ghost.VULNERABLE
		// cambiar velocidad del fantasma y pasarlo a modo Ghost.SPECTACLES
		
		// test14 
		// Tu código aquí. 
		// Si chocamos contra un fantasma cuando éste esta en estado Ghost.NORMAL --> cambiar el modo de juego a HIT_GHOST

	};
	
	// >=test2
	// Función para pintar el Pacman
	// En el test2 se llama drawPacman(x, y) {
	Pacman.prototype.draw = function() {
         
		// Pac Man
		// test2   
		ctx.beginPath();

		ctx.arc(this.posX+this.radius, this.posY+this.radius, this.radius, this.angle1 * Math.PI, this.angle2 * Math.PI,false);
		ctx.lineTo(this.posX+this.radius, this.posY+this.radius);
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
			player.direccion = key;
			todosFalse = false;
		  }
		}
		if (todosFalse){
		  player.direccion = "";
		}
		
		// test7
		// Tu código aquí
		// LEE bien el enunciado, especialmente la nota de ATENCION que
		// se muestra tras el test 7
	};

	// >=test12
	var updateTimers = function(){
		// test12
		// Tu código aquí
        	// Actualizar thisGame.ghostTimer (y el estado de los fantasmas, tal y como se especifica en el enunciado)

		// test14
		// Tu código aquí
		// actualiza modeTimer...
	};
	
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
     
		// test14
		// Tu código aquí
		// sólo en modo NORMAL
		
		// >=test4
		checkInputs();
		
		// test10
		// Tu código aquí
		// Mover fantasmas
		
		// >=test3
		//ojo: en el test3 esta instrucción es pacman.move()
		player.move();


		// test14
		// Tu código aquí
		// en modo HIT_GHOST
		// seguir el enunciado...
	
		// test14	
		// Tu código aquí
		// en modo WAIT_TO_START
		// seguir el enunciado...
	

		// >=test2
		// Clear the canvas
		clearCanvas();
   
   		// >=test6
		thisLevel.drawMap();

		// test10
		// Tu código aquí
		// Pintar fantasmas

		// >=test3
		//ojo: en el test3 esta instrucción es pacman.draw()
		player.draw();
		
		// >=test12
		updateTimers();
		
		
		// call the animation loop every 1/60th of second
		// comentar esta instrucción en el test3
		requestAnimationFrame(mainLoop);
	};
	
	// >=test4
	var addListeners = function(){
    
		// add the listener to the main, window object, and update the states
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
	  
			} else if (key == "Space") {
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
	  
			} else if (key == "Space") {
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
		// Tu código aquí
		// Inicialmente Pacman debe empezar a moverse en horizontal hacia la derecha, con una velocidad igual a su atributo speed
		// inicializa la posición inicial de Pacman tal y como indica el enunciado
	
		// test10
		// Tu código aquí
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
		thisLevel: thisLevel
		
		// solo para el test 13
		Ghost: Ghost
		
		// solo para el test14
		thisGame: thisGame
	};
};

// >=test1
var game = new GF();
game.start();




