var app = require('./backgrounds').app;
var canvasSize = require('./backgrounds').canvasSize;
var c = require('./containers');


// this is dirty fix to listening click outside of things but I can't come up with a better solution
// may cause issues, later, careful with the z depth
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

  var l = c.menuContainer.children.length
  for (var i = 0; i< l; i ++){
    c.menuContainer.removeChildAt(0);
  }


  //this works for now ,
  // assume it should only have one child
  if(c.attackRangeContainer.children.length>0){

    c.attackRangeContainer.getChildAt(0).destroy();
  }
}

exports.createHidListener = createHidListener;
exports.dismissMenu = dismissMenu;
