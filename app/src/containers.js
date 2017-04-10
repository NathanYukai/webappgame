var app = require('./backgrounds');
var mainContainter = new PIXI.Container();
var menuContainer = new PIXI.Container();
var rangeContainer = new PIXI.Container();
var tileDisplayContainer = new PIXI.Container();
var bgContainer = new PIXI.Container();

// this is dirty fix to listening click outside of things but I can't come up with a better solution
// may cause issues, later, careful with the z depth
mainContainter.addChild(bgContainer);
mainContainter.addChild(tileDisplayContainer);
mainContainter.addChild(rangeContainer);
mainContainter.addChild(menuContainer);

exports.mainContainter = mainContainter;
exports.menuContainer = menuContainer;
exports.tileDisplayContainer = tileDisplayContainer;
exports.rangeContainer = rangeContainer;
exports.bgContainer = bgContainer;
