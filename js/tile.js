function Tile(position,value) {

	if(value!=undefined){
		this.value = value;
	} else {
		this.value =  Math.floor(Math.random() * (5));
	}

	this.x = position.x;
	this.y = position.y;

	this.buffer = position.buffer;

	this.prevX = null;
	this.prevY = null;
	this.prevBuffer = null;	
	this.isNew = true;
}

Tile.prototype.move = function(direction) {

	switch (direction) {
		case "n":
   			this.y--;
	    	break;
		case "e":
   			this.x++;
	    	break;
		case "s":
   			this.y++;
	    	break;
		case "w":
   			this.x--;
	    	break;	    
	}
}