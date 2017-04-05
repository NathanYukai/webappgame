var enums = require('./enums')
var PriorityQueue = require('priorityqueuejs')
var lib = require('./lib')

///movement helper functions
function moveCost(map,from, to){
  var cost1 = enums.bgEnum.SLOW_1;
  if((map.get([from.q,from.r])==cost1) || (map.get([to.q,to.r])==cost1) ){
    return 1;
  }
  return 1;
}

//return all non-blocked neibors
//position is hex
function neighbors(position, map){
  var result = [];
  for (var i = 0; i < 6; i++){
    var nb = lib.hex_neighbor(position,i);
    var tiletype = map.get([nb.q,nb.r]);
    if(( tiletype == enums.bgEnum.EMPTY) || (tiletype == enums.bgEnum.SLOW_1)){
      result.push(nb);
    }
  }
  return result;
}

//pos is lib.Hex
// return [q,r]:cost
function calculateCost(pos, map, limit){
  var frontier =new PriorityQueue(function(a,b){
    return a.priority - b.priority;
  });
  frontier.enq({priority:0,position:pos});
  var cameFrom = {};
  var costSoFar = {};
  cameFrom[[pos.q,pos.r]] = null;
  costSoFar[[pos.q,pos.r]] = 0;

  while( !frontier.isEmpty() ){
    var curr = frontier.deq().position;
    var nbrs = neighbors(curr,map);
    for (var i = 0; i < nbrs.length; i++){
      var next = [nbrs[i].q,nbrs[i].r];
      var newCost = costSoFar[[curr.q,curr.r]] + moveCost(map,curr,nbrs[i]);
      if( (newCost < limit) && (! (next in costSoFar))||(newCost < costSoFar[next]) ){
        costSoFar[next] = newCost;
        prio = newCost;
        frontier.enq({priority:prio,position:nbrs[i]});
        cameFrom[next] = curr;
      }
    }
  }

  return costSoFar;

}

exports.moveCost = moveCost;
exports.calculateCost = calculateCost;
exports.neighbors = neighbors;
