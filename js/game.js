function Game(size, InputManager, Actuator) {
  this.size           = size;
  this.inputManager   = new InputManager;
  this.actuator       = new Actuator;

  this.inputManager.on("move", this.move.bind(this));

  this.init();
}

Game.prototype.init = function() {
	this.bufferN = new Buffer(this.size,"n");
	this.bufferE = new Buffer(this.size,"e");
	this.bufferS = new Buffer(this.size,"s");
	this.bufferW = new Buffer(this.size,"w");

	this.tiles = []
	this.deadTiles = [];
	this.over = false;
	this.actuator.actuate(this);
}

Game.prototype.move = function (direction) {
	/* deberia re-hacer esto porque es medio desprolijo */
	for (var i = 0; i < this.tiles.length; i++) {
		this.tiles[i].prevX = this.tiles[i].x;
		this.tiles[i].prevY = this.tiles[i].y;
		this.tiles[i].buffer = null;
		this.tiles[i].prevBuffer= false;
	};
	for (var i = 0; i < this.bufferN.tiles.length; i++) {
		this.bufferN.tiles[i].isNew= false;
	}
	for (var i = 0; i < this.bufferE.tiles.length; i++) {
		this.bufferE.tiles[i].isNew= false;
	}
	for (var i = 0; i < this.bufferS.tiles.length; i++) {
		this.bufferS.tiles[i].isNew= false;
	}
	for (var i = 0; i < this.bufferW.tiles.length; i++) {
		this.bufferW.tiles[i].isNew = false;
	}

	for (var i = 0; i < this.size; i++) { //trasverasl
		for (var j = 0; j < this.size; j++) { //direccion
			var x,y;
			switch (direction) {
			  case "n":
			    x = i;
			    y = j;
			    break;
			  case "e":
			    x = this.size - j - 1;
			    y = i;
			    break;
			  case "s":
			  	x = i;
			  	y = this.size - j - 1;
			  	break;
			  case "w":
			  	x = j;
			  	y = i;
			}

			if(this.isEmpty(x,y)){
				this.moveLine(x,y,direction);
				break;
			}
		}
	}
	//this.actuator.actuate(this);
	this.checkMatches();
	if(this.tiles.length==this.size*this.size) {
		this.over = true;
	}

	this.actuator.actuate(this);
}

Game.prototype.isEmpty = function(x,y){
	var isEmpty = true;
	this.tiles.forEach(function(tile) {
    	if(tile.x == x) {
    		if(tile.y == y){
    			isEmpty = false;
    		}
    	}
	});

	return isEmpty;
}

Game.prototype.moveLine = function(x,y,direction){

	this.tiles.forEach(function(tile) {
		switch (direction) {
		  case "n":
		    if((tile.x==x)&&(tile.y>y))
		    	tile.move("n");
		    break;
		  case "e":
		    if((tile.y==y)&&(tile.x<x))
		    	tile.move("e");
		    break;
		  case "s":
		    if((tile.x==x)&&(tile.y<y))
		    	tile.move("s");
		  	break;
		  case "w":
		    if((tile.y==y)&&(tile.x>x))
		    	tile.move("w");
		    break;
		}

	});

	// buffers
	if(direction=="n"){
		for (var i = this.bufferS.tiles.length-1; i >= 0; i--) {
			if(this.bufferS.tiles[i].buffer == "s"+x) {
			    var movedTile = new Tile({x:x,y:this.size-1}, this.bufferS.tiles[i].value);
			    movedTile.prevBuffer = this.bufferS.tiles[i].buffer;
			    this.tiles.push(movedTile);
			    // bufferS.repopulate();
			    var spawnTile = new Tile({buffer:this.bufferS.tiles[i].buffer});
			    this.bufferS.tiles[i] = spawnTile;
			}
		};
		return
	}
	if(direction=="s"){
		for (var i = this.bufferN.tiles.length-1; i >= 0; i--) {
			if(this.bufferN.tiles[i].buffer == "n"+x) {
			    var movedTile = new Tile({x:x,y:0}, this.bufferN.tiles[i].value);
			    movedTile.prevBuffer = this.bufferN.tiles[i].buffer;
			    this.tiles.push(movedTile);

			    var spawnTile = new Tile({buffer:this.bufferN.tiles[i].buffer});
			    this.bufferN.tiles[i] = spawnTile;
			}
		};
		return
	}
	if(direction=="e"){
		for (var i = this.bufferW.tiles.length-1; i >= 0; i--) {
			if(this.bufferW.tiles[i].buffer == "w"+y) {
			    var movedTile = new Tile({x:0,y:y}, this.bufferW.tiles[i].value);
			    movedTile.prevBuffer = this.bufferW.tiles[i].buffer;
			    this.tiles.push(movedTile);

			    var spawnTile = new Tile({buffer:this.bufferW.tiles[i].buffer});
			    this.bufferW.tiles[i] = spawnTile;
			}
		};
		return
	}
	if(direction=="w"){
		for (var i = this.bufferE.tiles.length-1; i >= 0; i--) {
			if(this.bufferE.tiles[i].buffer == "e"+y) {
			    var movedTile = new Tile({x:this.size-1,y:y}, this.bufferE.tiles[i].value);
			    movedTile.prevBuffer = this.bufferE.tiles[i].buffer;
			    this.tiles.push(movedTile);

			    var spawnTile = new Tile({buffer:this.bufferE.tiles[i].buffer});
			    this.bufferE.tiles[i] = spawnTile;
			}
		};
		return
	}
}

Game.prototype.checkMatches = function(){
	var self = this;

	var floodPaint = function(i,targetValue) {

		if(alreadyParsedIs.indexOf(i)!=-1) return;
		if(self.tiles[i]==undefined) return;
		if(targetValue==undefined) {
			targetValue =  self.tiles[i].value;
		}
		var tileV = self.tiles[i].value;
		var tileX = self.tiles[i].x;
		var tileY = self.tiles[i].y;

		if(tileV!=targetValue) return;

		thisGroupIndexes.push(i);
		alreadyParsedIs.push(i);

		var north 	= self.tileByXY(tileX,tileY-1)
		var east 	= self.tileByXY(tileX+1,tileY)
		var south 	= self.tileByXY(tileX,tileY+1)
		var west 	= self.tileByXY(tileX-1,tileY)

		floodPaint(north,tileV);
		floodPaint(east,tileV);
		floodPaint(south,tileV);
		floodPaint(west,tileV);
	}

	var alreadyParsedIs = [];
	var deleteIndexes = [];
	var thisGroupIndexes = [];

	for (var i = 0; i < this.tiles.length; i++) {
		thisGroupIndexes = [];		
		floodPaint(i);
		if(thisGroupIndexes.length>=3){
			deleteIndexes = deleteIndexes.concat(thisGroupIndexes);
		}
	}
	deleteIndexes.sort(function(a,b){ return b - a; });
	this.deadTiles = [];
	for (var i = 0; i < deleteIndexes.length; i++) {
		this.deadTiles.push(this.tiles[deleteIndexes[i]]);
		this.tiles.splice(deleteIndexes[i],1);
	};
}

Game.prototype.tileByXY = function(x,y){
	for (var i = 0; i < this.tiles.length; i++) {
    	if(this.tiles[i].x == x) {
    		if(this.tiles[i].y == y){ 
    			return i;
    		}
    	}		
	};

	return null;
}