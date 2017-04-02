var bg = require('./backgrounds.js')

var app = new PIXI.Application(800, 600, { antialias: true });
document.body.appendChild(app.view);

console.log(bg.graphics)
