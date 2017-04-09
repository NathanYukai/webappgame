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
// add at 1 so that it's in front of the hiddenlistener
  this.parent.addChildAt(attackTile,1);
//remove the attackMenu
  this.parent.removeChild(this);
}

//TODO, finish attack ,
// check if there is an valid target,
// if so, do attack,
function attackAt(event){
  var rawPos = event.data.getLocalPosition(this.parent);
  var hex = lib.hex_round(lib.pixel_to_hex(bg.layout_p,rawPos));
  var pixPos = lib.hex_to_pixel(bg.layout_p,hex);
  //todo later
  var frames = [];
  for (var i = 1; i<= 27; i++){
    frames.push(PIXI.Texture.fromFrame('Explosion_Sequence_A '+i+'.png'))
  }
  var explosion = new PIXI.extras.AnimatedSprite(frames);
  explosion.x = pixPos.x;
  explosion.y = pixPos.y;
  explosion.width = bg.tileSize.x;
  explosion.height = bg.tileSize.y;
  explosion.play();
  explosion.loop = false;
  explosion.onComplete = (function(){
    this.parent.removeChild(this);
  })
  app.stage.addChild(explosion);
  //TODO at this point, containers become complex,
  // need a reference to containers
  // do it like enums
  this.parent.parent.removeChild(this.parent);
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
