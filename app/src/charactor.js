var lib = require('./lib');
var bg = require('./backgrounds');
var mov = require('./movement');
var _ = require('underscore');
var actionMenu = require('./actionMenu');
var mainContainter = require('./containers').mainContainter;
var rangeContainer = require('./containers').rangeContainer;
var drawHealthBar = require('./UI').drawHealthBar;
var gameMap = bg.gameMap;

//position should be Hex position
function createCharactor(id, imgUrl, hexPosition, info){
  var charactor = new PIXI.Sprite.fromImage(imgUrl);
  charactor.interactive = true;
  charactor.anchor.set(0.5,0.7);
  charactor.fight_info = info
  charactor.current_info = {health:info.hitpoint};

  //lib Hex
  charactor.hexPos = hexPosition;
  charactor.id = id;
  //add to map
  var tileItems = gameMap.get([hexPosition.q,hexPosition.r])
  tileItems.charactor = charactor;

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

  //move limit
  charactor.moveLimit = info.movementPoint;
  charactor.moveLeft = charactor.moveLimit;
  //attack range
  //[Hex]
  charactor.attackRange = lib.hex_directions;


//draw UI
  charactor.UI = new PIXI.Container()
  healthBar = drawHealthBar(1);
  charactor.addChild(charactor.UI)
  charactor.UI.addChild(healthBar);

  reDrawHealth(charactor,0.2);

//functions for charactor class
  charactor.updateMoveLeft = function(){
    this.moveLeft = Math.max(0,
      this.moveLeft - this.moveCosts[[this.hexPos.q,this.hexPos.r]]);
  }

  charactor.clearDraggingField = function(){
    this.originHexPos = null;
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
    this.moveRange = null;
    this.moveCosts = null;
    rangeContainer.removeChild(this.rangeGraphics);
    this.rangeGraphics.destroy();
    this.rangeGraphics = null;
  }

  return charactor;
}

function reDrawHealth(charactor,percent){
  bar = charactor.UI.getChildAt(0)
  bar.height = bg.tileSize.y*percent;
  bar.y = (bg.tileSize.y-bar.height)/2;
}

function removeCharactorFromMap(hex){
  gameMap.get([hex.q,hex.r]).charactor = {};
}

function drawMoveRange(rangeColor,charactor){
  var range = new PIXI.Graphics();
  range.alpha = 0.2;
  bg.drawRange(range,charactor.moveRange,rangeColor,rangeColor)
  rangeContainer.addChild(range);
  charactor.rangeGraphics = range;
}

function onDragStart(event){
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    this.originHexPos = this.hexPos;

    //so that it can still move back to it's origin place
    removeCharactorFromMap(this.originHexPos);

    //calculate place can go to
    //return [[q,r]..]
    var costs = mov.calculateCost(this.hexPos, gameMap, this.moveLeft);
    //[[q,r],...]
    this.moveRange = lib.getMapKeysToArray(costs);
    this.moveCosts = costs;

    //draw range
    drawMoveRange(0xb9c170,this);
}

function onDragging(){
  if(this.dragging){
    var newPos = this.data.getLocalPosition(this.parent);
    var hexPos = lib.hex_round(lib.pixel_to_hex(bg.layout_p,newPos));
    var tiledPos = lib.hex_to_pixel(bg.layout_p,hexPos);

    var pos = [hexPos.q,hexPos.r];
    // update position if in range,
    // also if no charactor in this tile
    if(lib.arrayContainArray(pos, this.moveRange)
  && (_.isEqual(gameMap.get(pos).charactor,{})) ){
      this.x = tiledPos.x;
      this.y = tiledPos.y;
      this.hexPos = hexPos;
    }
  }
}

function onDragEnd(){
  if(this.dragging){

    this.updateMoveLeft();
    // update map
    //add new position
    var posKey = [this.hexPos.q,this.hexPos.r];
    var tileItems = gameMap.get(posKey).charactor = this;

    //draw menu
    actionMenu.createActionMenu(posKey);

    this.clearDraggingField();
  }
}





exports.createCharactor = createCharactor;
