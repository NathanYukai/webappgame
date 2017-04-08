var app = require('./backgrounds').app;
var canvasSize = require('./backgrounds').canvasSize;

function createHidListener(){
  var hidListener = new PIXI.Graphics()
  hidListener.interactive = true;
  hidListener.beginFill(0x000000,0);
  hidListener.drawRect(0,0,canvasSize.w,canvasSize.h);
  hidListener.endFill();
  hidListener.on('pointerdown',dismissMenu);
  return hidListener;
}

//remove menuContainer,
//free resources
function dismissMenu(){
  var parent = this.parent;
  var children = parent.children;
  for (var i = 0; i< children.length; i ++){
    children[i].destroy();
  }
  parent.destroy();
  app.stage.removeChild(this.parent);
}

exports.createHidListener = createHidListener;
