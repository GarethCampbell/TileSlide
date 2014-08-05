function Buffer(size, side) {
	this.tiles = [];

	for(var i = 0; i < 6; i++) {
		var position = side + i;
	    var tile = new Tile({buffer:position});
	    this.tiles.push(tile);
	}
}