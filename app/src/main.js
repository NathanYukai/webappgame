var bg = require('./backgrounds');
var charactor = require('./charactor');
var lib = require('./lib');
var app = bg.app;

document.body.appendChild(app.view);

var gameMap = bg.generateHexagonMap(5);
app.stage.addChild(bg.drawMap(gameMap));

var knightSprites = 'static/sprites/knight.png';

var knight = charactor.createCharactor(knightSprites,lib.Hex(0 ,0,-1),gameMap);
app.stage.addChild(knight);
