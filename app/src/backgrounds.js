var lib = require('./lib.js')
var layout = lib.layout_pointy

var graphics = 5;


function drawTile(){
  corners = lib.polygon_corners(layout,lib.Hex(0,0,0));
  console.log(corners);
};



exports.graphics = graphics;
