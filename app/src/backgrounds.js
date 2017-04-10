var lib = require('./lib');
var HashMap = require('hashmap/hashmap');
var bgEnum = require('./enums').bgEnum;
var mainContainter = require('./containers').mainContainter
var canvasSize = {w:800,h:600}

//initialise the app
var app = new PIXI.Application(canvasSize.w, canvasSize.h, { antialias: true });
app.stage.addChild(mainContainter)

// layout of the map
var tileSize = lib.Point(30,30);
var origin = lib.Point(350,300);
var layout_p = lib.Layout(lib.layout_pointy,tileSize,origin);

var lineColor = 0x67d5ff;
var tileColor = 0x37526f;

function drawTile(graphics, layout, hex, linecolor, fillcolor){
  graphics.lineStyle(2, linecolor, 1);

  corners = lib.polygon_corners(layout,hex);
  c0 = corners[0];

  graphics.beginFill(fillcolor);
  graphics.moveTo(c0.x,c0.y);
  for (var i = 1; i < corners.length; i++){
    var c = corners[i];
    graphics.lineTo(c.x,c.y);
  }

  graphics.lineTo(c0.x,c0.y);
  graphics.endFill();
};

// return a map of :
// {[q,r]:[items on this position]}
function generateHexagonMap(size){
  map = new HashMap();
  for (var q = -size; q <= size; q++) {
    var r1 = Math.max(-size, -q - size);
    var r2 = Math.min(size, -q + size);
    for (var r = r1; r <= r2; r++) {
        map.set([q,r], setTileItems(bgEnum.EMPTY,[],{}));
    }
  }

  for (var i = 0; i <8; i++){
    var randKey = map.keys()[Math.floor(Math.random()*map.count())];
    map.set(randKey,setTileItems(bgEnum.BLOCKED,[],{}));
  }
  for (var i = 0; i <5; i++){
    var randKey = map.keys()[Math.floor(Math.random()*map.count())];
    map.set(randKey,setTileItems(bgEnum.SLOW_1,[],{}));
  }
  return map;
}

function drawMap(map){

  var graphics = new PIXI.Graphics();

  map.forEach(function(value, key) {
      var hex = lib.Hex(key[0],key[1],-key[0]-key[1]);
      //array of things in that tile
      var tileType = map.get(key).tileType;
        if(tileType == bgEnum.BLOCKED){
        drawTile(graphics, layout_p, hex, tileColor, lineColor );
      }else if(tileType == bgEnum.SLOW_1){
        drawTile(graphics, layout_p, hex, 0xeff75b, 0xeff75b );
      }else{
        drawTile(graphics, layout_p, hex, lineColor, tileColor );
      }
  })
  return graphics;
}

//
function drawRange(graphics, range, lineColor, fillColor){
  for (var i=0; i < range.length; i++){
    var pos = range[i];
    var hex = lib.Hex(pos[0],pos[1],pos[0]-pos[1]);
    drawTile(graphics,layout_p,hex,lineColor,fillColor);
  }
}


//groundItems should not affect charactor movement
//type should be mutual exclusive to each other
function setTileItems(type, groundItems, charactor){
  return {tileType: type, groudnItems: groundItems, charactor: charactor};
}

exports.layout_p = layout_p;
exports.drawTile = drawTile;
exports.drawMap = drawMap;
exports.generateHexagonMap = generateHexagonMap;
exports.tileSize = tileSize;
exports.app = app;
exports.drawRange = drawRange;
exports.canvasSize = canvasSize;
