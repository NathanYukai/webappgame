var lib = require('./lib.js')
var HashMap = require('hashmap/hashmap.js')

var graphics = new PIXI.Graphics();


// layout of the map
var size = lib.Point(30,30);
var origin = lib.Point(350,300);
var layout_p = lib.Layout(lib.layout_pointy,size,origin);

var lineColor = 0x67d5ff;
var tileColor = 0x37526f;

function drawTile(layout, hex, linecolor, fillcolor){
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

function generateHexagonMap(size){
  map = new HashMap();
  for (var q = -size; q <= size; q++) {
    var r1 = Math.max(-size, -q - size);
    var r2 = Math.min(size, -q + size);
    for (var r = r1; r <= r2; r++) {
        map.set([q,r],  0);
    }
  }

  var a = map.remove([3,0]);
  return map;
}

function drawHexagonMap(map){
  map.forEach(function(value, key) {
      var hex = lib.Hex(key[0],key[1],-key[0]-key[1]);
      drawTile(layout_p, hex, lineColor, tileColor );
  });
}

var hex_map = generateHexagonMap(5);
drawHexagonMap(hex_map);

exports.graphics = graphics;
exports.game_map = hex_map;
