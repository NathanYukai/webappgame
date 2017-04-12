var app = require('./backgrounds');

var mainContainter = new PIXI.Container();
//attack, cancel menu , and hidden listener
var menuContainer = new PIXI.Container();
//display move range
var rangeContainer = new PIXI.Container();
//actual things on the map
var tileDisplayContainer = new PIXI.Container();
//bg , blocks, slow areas etc
var bgContainer = new PIXI.Container();

//only hold one attack range, only used by menucontainer
var attackRangeContainer = new PIXI.Container();

mainContainter.addChild(bgContainer);
mainContainter.addChild(tileDisplayContainer);
mainContainter.addChild(rangeContainer);

exports.mainContainter = mainContainter;
exports.menuContainer = menuContainer;
exports.tileDisplayContainer = tileDisplayContainer;
exports.rangeContainer = rangeContainer;
exports.bgContainer = bgContainer;
exports.attackRangeContainer = attackRangeContainer;
