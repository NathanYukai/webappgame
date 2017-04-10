var bg = require('../backgrounds');
var tileDisplayContainer = require('../containers').tileDisplayContainer;


function createExplosion(x,y){
  var frames = [];
  for (var i = 1; i<= 27; i++){
    frames.push(PIXI.Texture.fromFrame('Explosion_Sequence_A '+i+'.png'))
  }

  var explosion = new PIXI.extras.AnimatedSprite(frames);
  explosion.x = x;
  explosion.y = y;
  explosion.width = bg.tileSize.x;
  explosion.height = bg.tileSize.y;
  explosion.play();
  explosion.loop = false;
  explosion.onComplete = (function(){
    tileDisplayContainer.removeChild(this);
    this.destroy();
  })

  return explosion
}

exports.createExplosion = createExplosion;
