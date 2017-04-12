var lib = require('./lib')
var bg = require('./backgrounds');
var app = bg.app;
var drawRange = bg.drawRange;
var createHidListener = require('./hidListener').createHidListener;
var dismissMenu = require('./hidListener').dismissMenu;
var menuContainer = require('./containers').menuContainer;
var tileDisplayContainer = require('./containers').tileDisplayContainer;
var mainContainter = require('./containers').mainContainter;
var attackRangeContainer = require('./containers').attackRangeContainer;
var createExplosion = require('./attackAnime/explosion').createExplosion;
var gameMap = bg.gameMap;



var lineColor = 0x445762;
var fillColor = 0xEDE3DE;
var attackMenu = singleMenu('static/sprites/attackMenu.png',100,40);
attackMenu.interactive = true;
attackMenu.color = 0xdf3e16;
attackMenu.on('pointerdown',showAttackRange);

var cancelMenu = singleMenu('static/sprites/cancelMenu.png',100,40);
cancelMenu.interactive = true;
cancelMenu.on('pointerdown',dismissMenu);

var hid = createHidListener();

function createActionMenu(posKey){
  var charactor = gameMap.get(posKey).charactor;


  var menuX = charactor.x+20;
  attackMenu.x = menuX;
  attackMenu.y = charactor.y-10;
  attackMenu.charactor = charactor;

  cancelMenu.x = menuX;
  cancelMenu.y = charactor.y+30;

  menuContainer.addChildAt(hid,0);
  menuContainer.addChild(cancelMenu);
  menuContainer.addChild(attackMenu);

  mainContainter.addChild(menuContainer);
}

//get Range from charactor,
//draw range,
function showAttackRange(){
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
  attackTile.charactor = charactor
  attackTile.on('pointerdown',attackAt);

//remove the attackMenu
//add range container
  dismissMenu();
  attackRangeContainer.addChild(attackTile);
  menuContainer.addChild(attackRangeContainer);

// add it back for cancel attack ;
  menuContainer.addChildAt(hid,0)
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
