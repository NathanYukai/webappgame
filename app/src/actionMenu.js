var lib = require('./lib')
var bg = require('./backgrounds');
var app = bg.app;
var drawRange = bg.drawRange;
var createHidListener = require('./hidListener').createHidListener;

function createActionMenu(posKey,gameMap){
  var charactor = gameMap.get(posKey).charactor;
  var lineColor = 0x445762;
  var fillColor = 0xEDE3DE;

  var menuContainer = new PIXI.Container();

// this is dirty but I can't come up with a better solution
// may cause issues, later, careful with the z depth
  var hidListener = createHidListener();
  menuContainer.addChildAt(hidListener);

  //This should be taking from charactor,
  // now is just experimenting
  var attackMenu = singleMenu('static/sprites/attackMenu.png',100,40);
  attackMenu.interactive = true;
  attackMenu.x = charactor.x+20;
  attackMenu.y = charactor.y-10;
  menuContainer.addChild(attackMenu)
  attackMenu.charactor = charactor;
  attackMenu.gameMap = gameMap;
  attackMenu.color = 0xdf3e16;
  attackMenu.on('pointerdown',attackRange);


  app.stage.addChild(menuContainer);
}

//get Range from charactor,
//draw range,
// later need to parse gamemap
function attackRange(){
  var charactor = this.charactor;

  var hexPos = charactor.hexPos;
  var range = charactor.attackRange.map(function(a){
    var hex = lib.hex_add(hexPos,a);
    return [hex.q,hex.r]
  })
  var attackTile = new PIXI.Graphics();
  attackTile.alpha = 0.2;
  drawRange(attackTile,range,this.color,this.color);
  attackTile.interactive = true;
  attackTile.on('pointerdown',attackAt);

//so that hidden listener is still ready to remove all menu ,
// including the attackrange
  this.parent.addChildAt(attackTile,1);
//remove the button
  this.parent.removeChild(this);
}

//TODO, finish attack ,
// check if there is an valid target,
// if so, do attack,
function attackAt(event){
  var pixPos = event.data.getLocalPosition(this.parent);
  var hex = lib.hex_round(lib.pixel_to_hex(bg.layout_p,pixPos));
  //todo later
}

//generate texture
function singleMenu(imgUrl, w,h){
  var menu = new PIXI.Sprite.fromImage(imgUrl);
  menu.width = w;
  menu.height = h;
  menu.alpha = 0.6;

  return menu;
}

exports.createActionMenu = createActionMenu;
