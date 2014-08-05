function HTMLActuator() {
  this.tilesContainer    = document.querySelector(".tiles-container");
  this.audio = document.getElementById('pip');
  this.audio.volume=0.05;
}

HTMLActuator.prototype.actuate = function (game) {
  var self = this;

  this.audio.pause();
  //this.audio.currentTime = 0;
  
  if(game.deadTiles.length>0){
    setTimeout(function(){self.audio.play();}, 200);
  }
  window.requestAnimationFrame(function () {
    self.clearContainer(self.tilesContainer);

    game.tiles.forEach(function(tile) {
      self.addTile(tile);
    });

    game.deadTiles.forEach(function(tile) {
      self.addTile(tile,"tile-dead");
    });

    game.bufferN.tiles.forEach(function(tile) {
      self.addTile(tile,"tile-buffer");
    });
    game.bufferE.tiles.forEach(function(tile) {
      self.addTile(tile,"tile-buffer");
    });
    game.bufferS.tiles.forEach(function(tile) {
      self.addTile(tile,"tile-buffer");
    });
    game.bufferW.tiles.forEach(function(tile) {
      self.addTile(tile,"tile-buffer");
    });

    if(game.over){
      alert("game over"); /* cambiar esto */
      game.init();
    }
  });
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile,extraClass) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");

  var position;
  if(tile.buffer!=null){
    position = {buffer:tile.buffer,isNew:tile.isNew}
  }
  if(tile.prevBuffer!=null){
    position = {buffer:tile.prevBuffer}
  }
  if(tile.prevX!=null) {
    position = {x: tile.prevX, y: tile.prevY}
  }
  var positionClass = this.positionClass(position);
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if(extraClass!=null) classes.push(extraClass);

  this.applyClasses(wrapper, classes);
  inner.textContent = tile.value;


  window.requestAnimationFrame(function () {
    if (tile.x!=null) {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
    } else {
      classes[2] = self.positionClass({ buffer: tile.buffer, isNew: false });
    }

    self.applyClasses(wrapper, classes); // Update the position
  });
  
  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tilesContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.positionClass = function (position) {
  if(position.x!=null){
    return "tile-position-" + position.x + "-" + position.y;  
  }
  var pre = "";
  if(position.isNew==true){ pre = "p";}

  return "tile-position-buffer-" + pre + position.buffer;  
  
};