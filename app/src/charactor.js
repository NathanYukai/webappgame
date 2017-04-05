var lib = require('./lib');
var bg = require('./backgrounds');
var mov = require('./movement');

//position should be hex position
function createCharactor(imgUrl, hexPosition, gameMap){
  var charactor = new PIXI.Sprite.fromImage(imgUrl);
  charactor.interactive = true;
  charactor.anchor.set(0.5,0.7);

  //it's position on the game map
  charactor.hexPos = hexPosition;
  charactor.gameMap = gameMap;

  var pixelPosition = lib.hex_to_pixel(bg.layout_p,hexPosition);
  charactor.x = pixelPosition.x;
  charactor.y = pixelPosition.y;
  charactor.width = bg.tileSize.x*2;
  charactor.height = bg.tileSize.y*2;

  charactor
    .on('pointerdown',onDragStart)
    .on('pointerup',onDragEnd)
    .on('pointerupoutside',onDragEnd)
    .on('pointermove',onDragging);

  //testing moverange later more info needed
  charactor.moveLimit = 4;

  return charactor;
}


function onDragStart(event){
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;

    //calculate place can go to
    var costs = mov.calculateCost(this.hexPos, this.gameMap, this.moveLimit);
    //[[q,r],...]
    var inRange = lib.getMapKeysToArray(costs);
    this.moveRange = inRange;
    //draw range
    var rangeColor = 0xb9c170;
    var tmpGraphics = new PIXI.Graphics();
    tmpGraphics.alpha = 0.2;
    bg.drawRange(tmpGraphics,inRange,rangeColor,rangeColor)
    bg.app.stage.addChild(tmpGraphics);
    this.rangeGraphics = tmpGraphics;
}

function onDragging(){
  if(this.dragging){
    var newPos = this.data.getLocalPosition(this.parent);
    var hexPos = lib.hex_round(lib.pixel_to_hex(bg.layout_p,newPos));
    var tiledPos = lib.hex_to_pixel(bg.layout_p,hexPos);

    if(lib.arrayContainArray([hexPos.q,hexPos.r], this.moveRange)){
      this.x = tiledPos.x;
      this.y = tiledPos.y;
      this.hexPos = hexPos;
    }
  }
}

function onDragEnd(){
  this.alpha = 1;
  this.dragging = false;
  this.data = null;
  bg.app.stage.removeChild(this.rangeGraphics);
  this.rangeGraphics = null;
}



exports.createCharactor = createCharactor;
