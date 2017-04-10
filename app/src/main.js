var bg = require('./backgrounds');
var charactor = require('./charactor');
var lib = require('./lib');
var enemy = require('./enemy');
var app = bg.app;
var c = require('./containers');

PIXI.loader
    .add('spritesheet', 'static/sprites/explosion.json')
    .load(afterLoadAssets);

function afterLoadAssets(){

  document.body.appendChild(app.view);

  var gameMap = bg.generateHexagonMap(5);
  c.bgContainer.addChild(bg.drawMap(gameMap));

  var knightSprites = 'static/sprites/knight.png';
  var frankensteinSprites = 'static/sprites/frankenstein.png';

  var knight = charactor.createCharactor("k1",knightSprites,lib.Hex(1 ,0,-1),gameMap);
  var knight2 = charactor.createCharactor("k2",knightSprites,lib.Hex(1 ,2,-3),gameMap);
  var enemy1 = enemy.createEnemy('e1',frankensteinSprites,lib.Hex(2,2,-4),gameMap);
  c.tileDisplayContainer.addChild(knight);
  c.tileDisplayContainer.addChild(knight2);
  c.tileDisplayContainer.addChild(enemy1);
}
