var bg = require('./backgrounds');
var charactor = require('./charactor');
var lib = require('./lib');
var app = bg.app;

document.body.appendChild(app.view);

var gameMap = bg.generateHexagonMap(5);
app.stage.addChild(bg.drawMap(gameMap));

var knightSprites = 'static/sprites/knight.png';

var knight = charactor.createCharactor("k1",knightSprites,lib.Hex(1 ,0,-1),gameMap);
var knight2 = charactor.createCharactor("k2",knightSprites,lib.Hex(1 ,2,-3),gameMap);
app.stage.addChild(knight);
app.stage.addChild(knight2);
