var lib = require('./lib');
var bg = require('./backgrounds');
var mov = require('./movement');
var _ = require('underscore');
var actionMenu = require('./actionMenu');
var mainContainter = require('./containers').mainContainter;
var rangeContainer = require('./containers').rangeContainer;

//position should be Hex position
function createCharactor(id, imgUrl, hexPosition, gameMap){
  var charactor = new PIXI.Sprite.fromImage(imgUrl);
  charactor.interactive = true;
  charactor.anchor.set(0.5,0.7);

  //lib Hex
  charactor.hexPos = hexPosition;
  charactor.gameMap = gameMap;
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
  charactor.moveLimit = 4;
  charactor.moveLeft = charactor.moveLimit;

  //attack range
  //[Hex]
  charactor.attackRange = lib.hex_directions;

  return charactor;
}


function onDragStart(event){
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    this.originHexPos = this.hexPos;

    //so that it can still move back to it's origin place
    var removePos = this.originHexPos;
    var tileItems = this.gameMap.get([removePos.q,removePos.r]);
    tileItems.charactor = {};


    //calculate place can go to
    //return [[q,r]..]
    var costs = mov.calculateCost(this.hexPos, this.gameMap, this.moveLeft);
    //[[q,r],...]
    this.moveRange = lib.getMapKeysToArray(costs);
    this.moveCosts = costs;

    //draw range
    var rangeColor = 0xb9c170;
    var range = new PIXI.Graphics();
    range.alpha = 0.2;
    bg.drawRange(range,this.moveRange,rangeColor,rangeColor)
    rangeContainer.addChild(range);
    this.rangeGraphics = range;
}

function onDragging(){
  if(this.dragging){
    var newPos = this.data.getLocalPosition(this.parent);
    var hexPos = lib.hex_round(lib.pixel_to_hex(bg.layout_p,newPos));
    var tiledPos = lib.hex_to_pixel(bg.layout_p,hexPos);

    var pos = [hexPos.q,hexPos.r];
    // update position if in range,
    // and no charactor in this tile
    if(lib.arrayContainArray(pos, this.moveRange)
  && (_.isEqual(this.gameMap.get(pos).charactor,{})) ){
      this.x = tiledPos.x;
      this.y = tiledPos.y;
      this.hexPos = hexPos;
    }
  }
}

function onDragEnd(){
  if(this.dragging){
    var posKey = [this.hexPos.q,this.hexPos.r];

    this.moveLeft = Math.max(0,
      this.moveLeft - this.moveCosts[posKey]);

    // update map
    //add new position
    var gameMap = this.gameMap;
    this.originHexPos = null;
    var tileItems = gameMap.get(posKey)
    tileItems.charactor = this;

    //draw menu
    actionMenu.createActionMenu(posKey,gameMap);

    //reset stuff
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
    rangeContainer.removeChild(this.rangeGraphics);
    this.rangeGraphics = null;
    this.moveRange = null;
    this.moveCosts = null;

  }
}





exports.createCharactor = createCharactor;
