var bg = require('./backgrounds');
var charactor = require('./charactor');
var lib = require('./lib');
var enemy = require('./enemy');
var app = bg.app;
var c = require('./containers');
var fightInfo = require('./fightInfo').fightInfo;

PIXI.loader
    .add('spritesheet', 'static/sprites/explosion.json')
    .load(afterLoadAssets);

function afterLoadAssets(){

  document.body.appendChild(app.view);

  var gameMap = bg.gameMap;
  c.bgContainer.addChild(bg.drawMap(gameMap));

  var knightSprites = 'static/sprites/knight.png';
  var frankensteinSprites = 'static/sprites/frankenstein.png';

  var knightInfo = fightInfo(10,2,1,4)
  var knight = charactor.createCharactor("k1",knightSprites,lib.Hex(1 ,0,-1),knightInfo);
  var knight2 = charactor.createCharactor("k2",knightSprites,lib.Hex(1 ,2,-3),knightInfo);
  var enemy1 = enemy.createEnemy('e1',frankensteinSprites,lib.Hex(2,2,-4));
  c.tileDisplayContainer.addChild(knight);
  c.tileDisplayContainer.addChild(knight2);
  c.tileDisplayContainer.addChild(enemy1);
}
