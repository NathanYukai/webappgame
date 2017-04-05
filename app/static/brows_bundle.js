(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var lib = require('./lib');
var HashMap = require('hashmap/hashmap');
var bgEnum = require('./enums').bgEnum;

//initialise the app
var app = new PIXI.Application(800, 600, { antialias: true });

// layout of the map
var tileSize = lib.Point(30,30);
var origin = lib.Point(350,300);
var layout_p = lib.Layout(lib.layout_pointy,tileSize,origin);

var lineColor = 0x67d5ff;
var tileColor = 0x37526f;

function drawTile(graphics, layout, hex, linecolor, fillcolor){
  graphics.lineStyle(2, linecolor, 1);

  corners = lib.polygon_corners(layout,hex);
  c0 = corners[0];

  graphics.beginFill(fillcolor);
  graphics.moveTo(c0.x,c0.y);
  for (var i = 1; i < corners.length; i++){
    var c = corners[i];
    graphics.lineTo(c.x,c.y);
  }

  graphics.lineTo(c0.x,c0.y);
  graphics.endFill();
};

function generateHexagonMap(size){
  map = new HashMap();
  for (var q = -size; q <= size; q++) {
    var r1 = Math.max(-size, -q - size);
    var r2 = Math.min(size, -q + size);
    for (var r = r1; r <= r2; r++) {
        map.set([q,r], bgEnum.EMPTY);
    }
  }

  for (var i = 0; i <8; i++){
    var randKey = map.keys()[Math.floor(Math.random()*map.count())];
    map.set(randKey,bgEnum.BLOCKED);
  }
  for (var i = 0; i <5; i++){
    var randKey = map.keys()[Math.floor(Math.random()*map.count())];
    map.set(randKey,bgEnum.SLOW_1);
  }
  return map;
}

function drawMap(map){

  var graphics = new PIXI.Graphics();

  map.forEach(function(value, key) {
      var hex = lib.Hex(key[0],key[1],-key[0]-key[1]);
      if(map.get(key) == bgEnum.EMPTY ){
        drawTile(graphics, layout_p, hex, lineColor, tileColor );
      }else if(map.get(key) == bgEnum.BLOCKED){
        drawTile(graphics, layout_p, hex, tileColor, lineColor );
      }else{
        drawTile(graphics, layout_p, hex, 0xeff75b, 0xeff75b );
      }
  })
  return graphics;
}


function drawRange(graphics, range, lineColor, fillColor){
  for (var i=0; i < range.length; i++){
    var pos = range[i];
    var hex = lib.Hex(pos[0],pos[1],pos[0]-pos[1]);
    drawTile(graphics,layout_p,hex,lineColor,fillColor);
  }
}

exports.layout_p = layout_p;
exports.drawTile = drawTile;
exports.drawMap = drawMap;
exports.generateHexagonMap = generateHexagonMap;
exports.tileSize = tileSize;
exports.app = app;
exports.drawRange = drawRange;

},{"./enums":3,"./lib":4,"hashmap/hashmap":7}],2:[function(require,module,exports){
var lib = require('./lib');
var bg = require('./backgrounds');
var mov = require('./movement');

//position should be hex position
function createCharactor(imgUrl, hexPosition, gameMap){
  var charactor = new PIXI.Sprite.fromImage(imgUrl);
  charactor.interactive = true;
  charactor.anchor.set(0.5,0.7);

  //it's position on the game map
  charactor.hexPos = hexPosition;
  charactor.gameMap = gameMap;

  var pixelPosition = lib.hex_to_pixel(bg.layout_p,hexPosition);
  charactor.x = pixelPosition.x;
  charactor.y = pixelPosition.y;
  charactor.width = bg.tileSize.x*2;
  charactor.height = bg.tileSize.y*2;

  charactor
    .on('pointerdown',onDragStart)
    .on('pointerup',onDragEnd)
    .on('pointerupoutside',onDragEnd)
    .on('pointermove',onDragging);

  //testing moverange later more info needed
  charactor.moveLimit = 4;

  return charactor;
}


function onDragStart(event){
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;

    //calculate place can go to
    var costs = mov.calculateCost(this.hexPos, this.gameMap, this.moveLimit);
    //[[q,r],...]
    var inRange = lib.getMapKeysToArray(costs);
    this.moveRange = inRange;
    //draw range
    var rangeColor = 0xb9c170;
    var tmpGraphics = new PIXI.Graphics();
    tmpGraphics.alpha = 0.2;
    bg.drawRange(tmpGraphics,inRange,rangeColor,rangeColor)
    bg.app.stage.addChild(tmpGraphics);
    this.rangeGraphics = tmpGraphics;
}

function onDragging(){
  if(this.dragging){
    var newPos = this.data.getLocalPosition(this.parent);
    var hexPos = lib.hex_round(lib.pixel_to_hex(bg.layout_p,newPos));
    var tiledPos = lib.hex_to_pixel(bg.layout_p,hexPos);

    if(lib.arrayContainArray([hexPos.q,hexPos.r], this.moveRange)){
      this.x = tiledPos.x;
      this.y = tiledPos.y;
      this.hexPos = hexPos;
    }
  }
}

function onDragEnd(){
  this.alpha = 1;
  this.dragging = false;
  this.data = null;
  bg.app.stage.removeChild(this.rangeGraphics);
  this.rangeGraphics = null;
}



exports.createCharactor = createCharactor;

},{"./backgrounds":1,"./lib":4,"./movement":6}],3:[function(require,module,exports){
var bgEnum = Object.freeze({
  EMPTY:1,
  BLOCKED:2,
  SLOW_1:3
})

exports.bgEnum = bgEnum;

},{}],4:[function(require,module,exports){
// Generated code -- http://www.redblobgames.com/grids/hexagons/
"use strict";



function Point(x, y) {
    return {x: x, y: y};
}




function Hex(q, r, s) {
    return {q: q, r: r, s: s};
}

function hex_add(a, b)
{
    return Hex(a.q + b.q, a.r + b.r, a.s + b.s);
}

function hex_subtract(a, b)
{
    return Hex(a.q - b.q, a.r - b.r, a.s - b.s);
}

function hex_scale(a, k)
{
    return Hex(a.q * k, a.r * k, a.s * k);
}

var hex_directions = [Hex(1, 0, -1), Hex(1, -1, 0), Hex(0, -1, 1), Hex(-1, 0, 1), Hex(-1, 1, 0), Hex(0, 1, -1)];
function hex_direction(direction)
{
    return hex_directions[direction];
}

function hex_neighbor(hex, direction)
{
    return hex_add(hex, hex_direction(direction));
}

var hex_diagonals = [Hex(2, -1, -1), Hex(1, -2, 1), Hex(-1, -1, 2), Hex(-2, 1, 1), Hex(-1, 2, -1), Hex(1, 1, -2)];
function hex_diagonal_neighbor(hex, direction)
{
    return hex_add(hex, hex_diagonals[direction]);
}

function hex_length(hex)
{
    return Math.trunc((Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2);
}

function hex_distance(a, b)
{
    return hex_length(hex_subtract(a, b));
}

function hex_round(h)
{
    var q = Math.trunc(Math.round(h.q));
    var r = Math.trunc(Math.round(h.r));
    var s = Math.trunc(Math.round(h.s));
    var q_diff = Math.abs(q - h.q);
    var r_diff = Math.abs(r - h.r);
    var s_diff = Math.abs(s - h.s);
    if (q_diff > r_diff && q_diff > s_diff)
    {
        q = -r - s;
    }
    else
        if (r_diff > s_diff)
        {
            r = -q - s;
        }
        else
        {
            s = -q - r;
        }
    return Hex(q, r, s);
}

function hex_lerp(a, b, t)
{
    return Hex(a.q * (1 - t) + b.q * t, a.r * (1 - t) + b.r * t, a.s * (1 - t) + b.s * t);
}

function hex_linedraw(a, b)
{
    var N = hex_distance(a, b);
    var a_nudge = Hex(a.q + 0.000001, a.r + 0.000001, a.s - 0.000002);
    var b_nudge = Hex(b.q + 0.000001, b.r + 0.000001, b.s - 0.000002);
    var results = [];
    var step = 1.0 / Math.max(N, 1);
    for (var i = 0; i <= N; i++)
    {
        results.push(hex_round(hex_lerp(a_nudge, b_nudge, step * i)));
    }
    return results;
}




function OffsetCoord(col, row) {
    return {col: col, row: row};
}

var EVEN = 1;
var ODD = -1;
function qoffset_from_cube(offset, h)
{
    var col = h.q;
    var row = h.r + Math.trunc((h.q + offset * (h.q & 1)) / 2);
    return OffsetCoord(col, row);
}

function qoffset_to_cube(offset, h)
{
    var q = h.col;
    var r = h.row - Math.trunc((h.col + offset * (h.col & 1)) / 2);
    var s = -q - r;
    return Hex(q, r, s);
}

function roffset_from_cube(offset, h)
{
    var col = h.q + Math.trunc((h.r + offset * (h.r & 1)) / 2);
    var row = h.r;
    return OffsetCoord(col, row);
}

function roffset_to_cube(offset, h)
{
    var q = h.col - Math.trunc((h.row + offset * (h.row & 1)) / 2);
    var r = h.row;
    var s = -q - r;
    return Hex(q, r, s);
}




function Orientation(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
    return {f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, start_angle: start_angle};
}




function Layout(orientation, size, origin) {
    return {orientation: orientation, size: size, origin: origin};
}

var layout_pointy = Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
var layout_flat = Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);
function hex_to_pixel(layout, h)
{
    var M = layout.orientation;
    var size = layout.size;
    var origin = layout.origin;
    var x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    var y = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return Point(x + origin.x, y + origin.y);
}

function pixel_to_hex(layout, p)
{
    var M = layout.orientation;
    var size = layout.size;
    var origin = layout.origin;
    var pt = Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
    var q = M.b0 * pt.x + M.b1 * pt.y;
    var r = M.b2 * pt.x + M.b3 * pt.y;
    return Hex(q, r, -q - r);
}

function hex_corner_offset(layout, corner)
{
    var M = layout.orientation;
    var size = layout.size;
    var angle = 2.0 * Math.PI * (M.start_angle - corner) / 6;
    return Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
}

function polygon_corners(layout, h)
{
    var corners = [];
    var center = hex_to_pixel(layout, h);
    for (var i = 0; i < 6; i++)
    {
        var offset = hex_corner_offset(layout, i);
        corners.push(Point(center.x + offset.x, center.y + offset.y));
    }
    return corners;
}

/// from yukai:

function getMapKeysToArray(map){

  return Object.keys(map).map(function(str){
    return str.split(',')
  }).map(function(a){
    return a.map(function(i){
      return parseInt(i)
    })
  })
}


function arrayContainArray(elem,array){
  var a = JSON.stringify(array);
  var b = JSON.stringify(elem);
  var c = a.indexOf(b);
  return c != -1;
}

// Exports for node/browserify modules:

exports.Point = Point;

exports.Hex = Hex;
exports.hex_add = hex_add;
exports.hex_subtract = hex_subtract;
exports.hex_scale = hex_scale;
exports.hex_directions = hex_directions;
exports.hex_direction = hex_direction;
exports.hex_neighbor = hex_neighbor;
exports.hex_diagonals = hex_diagonals;
exports.hex_diagonal_neighbor = hex_diagonal_neighbor;
exports.hex_length = hex_length;
exports.hex_distance = hex_distance;
exports.hex_round = hex_round;
exports.hex_lerp = hex_lerp;
exports.hex_linedraw = hex_linedraw;

exports.OffsetCoord = OffsetCoord;
exports.EVEN = EVEN;
exports.ODD = ODD;
exports.qoffset_from_cube = qoffset_from_cube;
exports.qoffset_to_cube = qoffset_to_cube;
exports.roffset_from_cube = roffset_from_cube;
exports.roffset_to_cube = roffset_to_cube;

exports.Orientation = Orientation;

exports.Layout = Layout;
exports.layout_pointy = layout_pointy;
exports.layout_flat = layout_flat;
exports.hex_to_pixel = hex_to_pixel;
exports.pixel_to_hex = pixel_to_hex;
exports.hex_corner_offset = hex_corner_offset;
exports.polygon_corners = polygon_corners;

// exports
exports.getMapKeysToArray = getMapKeysToArray;
exports.arrayContainArray = arrayContainArray;

},{}],5:[function(require,module,exports){
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

},{"./backgrounds":1,"./charactor":2,"./lib":4}],6:[function(require,module,exports){
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

},{"./enums":3,"./lib":4,"priorityqueuejs":8}],7:[function(require,module,exports){
/**
 * HashMap - HashMap Class for JavaScript
 * @author Ariel Flesler <aflesler@gmail.com>
 * @version 2.0.6
 * Homepage: https://github.com/flesler/hashmap
 */

(function(factory) {
	/* global define */
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof module === 'object') {
		// Node js environment
		var HashMap = module.exports = factory();
		// Keep it backwards compatible
		HashMap.HashMap = HashMap;
	} else {
		// Browser globals (this is window)
		this.HashMap = factory();
	}
}(function() {

	function HashMap(other) {
		this.clear();
		switch (arguments.length) {
			case 0: break;
			case 1: this.copy(other); break;
			default: multi(this, arguments); break;
		}
	}

	var proto = HashMap.prototype = {
		constructor:HashMap,

		get:function(key) {
			var data = this._data[this.hash(key)];
			return data && data[1];
		},

		set:function(key, value) {
			// Store original key as well (for iteration)
			var hash = this.hash(key);
			if ( !(hash in this._data) ) {
				this._count++;
			}
			this._data[hash] = [key, value];
		},

		multi:function() {
			multi(this, arguments);
		},

		copy:function(other) {
			for (var hash in other._data) {
				if ( !(hash in this._data) ) {
					this._count++;
				}
				this._data[hash] = other._data[hash];
			}
		},

		has:function(key) {
			return this.hash(key) in this._data;
		},

		search:function(value) {
			for (var key in this._data) {
				if (this._data[key][1] === value) {
					return this._data[key][0];
				}
			}

			return null;
		},

		remove:function(key) {
			var hash = this.hash(key);
			if ( hash in this._data ) {
				this._count--;
				delete this._data[hash];
			}
		},

		type:function(key) {
			var str = Object.prototype.toString.call(key);
			var type = str.slice(8, -1).toLowerCase();
			// Some browsers yield DOMWindow for null and undefined, works fine on Node
			if (type === 'domwindow' && !key) {
				return key + '';
			}
			return type;
		},

		keys:function() {
			var keys = [];
			this.forEach(function(_, key) { keys.push(key); });
			return keys;
		},

		values:function() {
			var values = [];
			this.forEach(function(value) { values.push(value); });
			return values;
		},

		count:function() {
			return this._count;
		},

		clear:function() {
			// TODO: Would Object.create(null) make any difference
			this._data = {};
			this._count = 0;
		},

		clone:function() {
			return new HashMap(this);
		},

		hash:function(key) {
			switch (this.type(key)) {
				case 'undefined':
				case 'null':
				case 'boolean':
				case 'number':
				case 'regexp':
					return key + '';

				case 'date':
					return '♣' + key.getTime();

				case 'string':
					return '♠' + key;

				case 'array':
					var hashes = [];
					for (var i = 0; i < key.length; i++) {
						hashes[i] = this.hash(key[i]);
					}
					return '♥' + hashes.join('⁞');

				default:
					// TODO: Don't use expandos when Object.defineProperty is not available?
					if (!key.hasOwnProperty('_hmuid_')) {
						key._hmuid_ = ++HashMap.uid;
						hide(key, '_hmuid_');
					}

					return '♦' + key._hmuid_;
			}
		},

		forEach:function(func, ctx) {
			for (var key in this._data) {
				var data = this._data[key];
				func.call(ctx || this, data[1], data[0]);
			}
		}
	};

	HashMap.uid = 0;

	//- Add chaining to all methods that don't return something

	['set','multi','copy','remove','clear','forEach'].forEach(function(method) {
		var fn = proto[method];
		proto[method] = function() {
			fn.apply(this, arguments);
			return this;
		};
	});

	//- Utils

	function multi(map, args) {
		for (var i = 0; i < args.length; i += 2) {
			map.set(args[i], args[i+1]);
		}
	}

	function hide(obj, prop) {
		// Make non iterable if supported
		if (Object.defineProperty) {
			Object.defineProperty(obj, prop, {enumerable:false});
		}
	}

	return HashMap;
}));

},{}],8:[function(require,module,exports){
/**
 * Expose `PriorityQueue`.
 */
module.exports = PriorityQueue;

/**
 * Initializes a new empty `PriorityQueue` with the given `comparator(a, b)`
 * function, uses `.DEFAULT_COMPARATOR()` when no function is provided.
 *
 * The comparator function must return a positive number when `a > b`, 0 when
 * `a == b` and a negative number when `a < b`.
 *
 * @param {Function}
 * @return {PriorityQueue}
 * @api public
 */
function PriorityQueue(comparator) {
  this._comparator = comparator || PriorityQueue.DEFAULT_COMPARATOR;
  this._elements = [];
}

/**
 * Compares `a` and `b`, when `a > b` it returns a positive number, when
 * it returns 0 and when `a < b` it returns a negative number.
 *
 * @param {String|Number} a
 * @param {String|Number} b
 * @return {Number}
 * @api public
 */
PriorityQueue.DEFAULT_COMPARATOR = function(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  } else {
    a = a.toString();
    b = b.toString();

    if (a == b) return 0;

    return (a > b) ? 1 : -1;
  }
};

/**
 * Returns whether the priority queue is empty or not.
 *
 * @return {Boolean}
 * @api public
 */
PriorityQueue.prototype.isEmpty = function() {
  return this.size() === 0;
};

/**
 * Peeks at the top element of the priority queue.
 *
 * @return {Object}
 * @throws {Error} when the queue is empty.
 * @api public
 */
PriorityQueue.prototype.peek = function() {
  if (this.isEmpty()) throw new Error('PriorityQueue is empty');

  return this._elements[0];
};

/**
 * Dequeues the top element of the priority queue.
 *
 * @return {Object}
 * @throws {Error} when the queue is empty.
 * @api public
 */
PriorityQueue.prototype.deq = function() {
  var first = this.peek();
  var last = this._elements.pop();
  var size = this.size();

  if (size === 0) return first;

  this._elements[0] = last;
  var current = 0;

  while (current < size) {
    var largest = current;
    var left = (2 * current) + 1;
    var right = (2 * current) + 2;

    if (left < size && this._compare(left, largest) >= 0) {
      largest = left;
    }

    if (right < size && this._compare(right, largest) >= 0) {
      largest = right;
    }

    if (largest === current) break;

    this._swap(largest, current);
    current = largest;
  }

  return first;
};

/**
 * Enqueues the `element` at the priority queue and returns its new size.
 *
 * @param {Object} element
 * @return {Number}
 * @api public
 */
PriorityQueue.prototype.enq = function(element) {
  var size = this._elements.push(element);
  var current = size - 1;

  while (current > 0) {
    var parent = Math.floor((current - 1) / 2);

    if (this._compare(current, parent) <= 0) break;

    this._swap(parent, current);
    current = parent;
  }

  return size;
};

/**
 * Returns the size of the priority queue.
 *
 * @return {Number}
 * @api public
 */
PriorityQueue.prototype.size = function() {
  return this._elements.length;
};

/**
 *  Iterates over queue elements
 *
 *  @param {Function} fn
 */
PriorityQueue.prototype.forEach = function(fn) {
  return this._elements.forEach(fn);
};

/**
 * Compares the values at position `a` and `b` in the priority queue using its
 * comparator function.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 * @api private
 */
PriorityQueue.prototype._compare = function(a, b) {
  return this._comparator(this._elements[a], this._elements[b]);
};

/**
 * Swaps the values at position `a` and `b` in the priority queue.
 *
 * @param {Number} a
 * @param {Number} b
 * @api private
 */
PriorityQueue.prototype._swap = function(a, b) {
  var aux = this._elements[a];
  this._elements[a] = this._elements[b];
  this._elements[b] = aux;
};

},{}]},{},[1,2,3,4,5,6]);
