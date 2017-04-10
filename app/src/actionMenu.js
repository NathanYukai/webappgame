var lib = require('./lib')
var bg = require('./backgrounds');
var app = bg.app;
var drawRange = bg.drawRange;
var createHidListener = require('./hidListener').createHidListener;
var dismissMenu = require('./hidListener').dismissMenu;
var menuContainer = require('./containers').menuContainer;
var tileDisplayContainer = require('./containers').tileDisplayContainer;
var mainContainter = require('./containers').mainContainter;
var createExplosion = require('./attackAnime/explosion').createExplosion;

function createActionMenu(posKey,gameMap){
  var charactor = gameMap.get(posKey).charactor;
  var lineColor = 0x445762;
  var fillColor = 0xEDE3DE;

  var hid = createHidListener();
  menuContainer.addChild(hid);

  //This should be taking from charactor,
  // now is just experimenting
  var attackMenu = singleMenu('static/sprites/attackMenu.png',100,40);
  attackMenu.interactive = true;
  attackMenu.x = charactor.x+20;
  attackMenu.y = charactor.y-10;
  attackMenu.charactor = charactor;
  attackMenu.gameMap = gameMap;
  attackMenu.color = 0xdf3e16;
  attackMenu.on('pointerdown',attackRange);

  menuContainer.addChild(attackMenu);
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
// add at 1 so that it's in front of the hiddenlistener
  menuContainer.addChildAt(attackTile,1);
//remove the attackMenu
  menuContainer.removeChild(this);
}

//TODO, finish attack ,
// check if there is an valid target,
// if so, do attack,
function attackAt(event){
  var rawPos = event.data.getLocalPosition(this.parent);
  var hex = lib.hex_round(lib.pixel_to_hex(bg.layout_p,rawPos));
  var pixPos = lib.hex_to_pixel(bg.layout_p,hex);

  tileDisplayContainer.addChild(createExplosion(pixPos.x,pixPos.y));

  dismissMenu();
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
