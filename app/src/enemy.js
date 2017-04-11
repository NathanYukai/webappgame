var bg = require('./backgrounds');
var lib = require('./lib');

function createEnemy(id, imgUrl, hexPosition){
    var enemy = new PIXI.Sprite.fromImage(imgUrl);
    enemy.hexPos = hexPosition;
    enemy.id = id;
    enemy.anchor.set(0.5,0.6);

    var pixelPosition = lib.hex_to_pixel(bg.layout_p,hexPosition);
    enemy.x = pixelPosition.x;
    enemy.y = pixelPosition.y;
    enemy.width = bg.tileSize.x*1.7;
    enemy.height = bg.tileSize.y*1.7;

    return enemy
}


exports.createEnemy = createEnemy;
