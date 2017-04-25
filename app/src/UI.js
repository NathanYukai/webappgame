var tileSize = require('./backgrounds').tileSize

drawHealthBar = function(percentage){
  var graphics = new PIXI.Graphics()
  var w = tileSize.x/6
  var h = tileSize.y*percentage
  graphics.beginFill(0xFF700B, 1);
  graphics.drawRect(0,0,w,h);
  graphics.pivot.set(tileSize.x/2,tileSize.y/2);
  graphics.endFill();
  return graphics
}

exports.drawHealthBar = drawHealthBar
