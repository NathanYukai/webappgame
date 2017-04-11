

// return a map of :
// {[q,r]:[items on this position]}
function generateHexagonMap(size){
  map = new HashMap();
  for (var q = -size; q <= size; q++) {
    var r1 = Math.max(-size, -q - size);
    var r2 = Math.min(size, -q + size);
    for (var r = r1; r <= r2; r++) {
        map.set([q,r], setTileItems(bgEnum.EMPTY,[],{}));
    }
  }

  for (var i = 0; i <8; i++){
    var randKey = map.keys()[Math.floor(Math.random()*map.count())];
    map.set(randKey,setTileItems(bgEnum.BLOCKED,[],{}));
  }
  for (var i = 0; i <5; i++){
    var randKey = map.keys()[Math.floor(Math.random()*map.count())];
    map.set(randKey,setTileItems(bgEnum.SLOW_1,[],{}));
  }
  return map;
}

function drawMap(map){

  var graphics = new PIXI.Graphics();

  map.forEach(function(value, key) {
      var hex = lib.Hex(key[0],key[1],-key[0]-key[1]);
      //array of things in that tile
      var tileType = map.get(key).tileType;
        if(tileType == bgEnum.BLOCKED){
        drawTile(graphics, layout_p, hex, tileColor, lineColor );
      }else if(tileType == bgEnum.SLOW_1){
        drawTile(graphics, layout_p, hex, 0xeff75b, 0xeff75b );
      }else{
        drawTile(graphics, layout_p, hex, lineColor, tileColor );
      }
  })
  return graphics;
}
