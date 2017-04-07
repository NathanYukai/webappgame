
function createActionMenu(imgUrl,x,y){
  var graphics = new PIXI.Graphics();
  var lineColor = 0x445762;
  var fillColor = 0xEDE3DE;

  drawActionMenu(graphics,lineColor,fillColor,100,30);
}

function drawActionMenu(graphics, lineColor, fillColor, w,h){
  var width = w;
  var height = h;
  var alpha = 0.75;
  graphics.lineStyle(1,lineColor,1);
  graphics.beginFill(fillColor,alpha);
  graphics.drawRoundRect(x,y,width,height,15);
  graphics.endFill();
}
