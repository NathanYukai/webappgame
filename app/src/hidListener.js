var app = require('./backgrounds').app;
var canvasSize = require('./backgrounds').canvasSize;
var c = require('./containers');

function createHidListener(){
  var hidListener = new PIXI.Graphics()
  hidListener.interactive = true;
  hidListener.beginFill(0xf1d1a8,0);
  hidListener.drawRect(0,0,canvasSize.w,canvasSize.h);
  hidListener.endFill();
  hidListener.on('pointerdown',dismissMenu);
  return hidListener;
}

//remove menuContainer
//free all resources in menucontainer
function dismissMenu(){

  var children = c.menuContainer.children;
  for (var i = 0; i< children.length; i ++){
    c.menuContainer.removeChild(children[i])
    children[i].destroy();
  }
}

exports.createHidListener = createHidListener;
exports.dismissMenu = dismissMenu;
