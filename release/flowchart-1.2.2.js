// flowchart, v1.2.2
// Copyright (c)2013 Adriano Raiano (adrai).
// Distributed under MIT license
// http://adrai.github.io/flowchart.js
(function() {

  // add indexOf to non ECMA-262 standard compliant browsers
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this === null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 0) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n !== 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  
  // add lastIndexOf to non ECMA-262 standard compliant browsers
  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/) {
      "use strict";
      if (this === null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = len;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {
          n = 0;
        } else if (n !== 0 && n != (1 / 0) && n != -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);
      for (; k >= 0; k--) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  var root = this,
      flowchart = {};

  // Export the flowchart object for **CommonJS**. 
  // If we're not in CommonJS, add `flowchart` to the
  // global object or to jquery.
  if (typeof module !== 'undefined' && module.exports) {
     module.exports = flowchart;
  } else {
    root.flowchart = root.flowchart || flowchart;
  }
  // defaults
  var o = {
    'line-width': 3,
    'line-length': 50,
    'text-margin': 10,
    'font-size': 14,
    'font-color': 'black',
    'line-color': 'black',
    'element-color': 'black',
    'fill': 'white',
    'yes-text': 'yes',
    'no-text': 'no',
    'arrow-end': 'block'
  };
  function _defaults(options, defaultOptions) {
    if (!options || typeof options === 'function') {
      return defaultOptions;
    }
  
    var merged = {};
    for (var attrname in defaultOptions) { merged[attrname] = defaultOptions[attrname]; }
    for (attrname in options) { if (options[attrname]) merged[attrname] = options[attrname]; }
    return merged;
  }
  
  function _inherits(ctor, superCtor) {
    if (typeof(Object.create) === 'function') {
      // implementation from standard node.js 'util' module
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    } else {
      // old school shim for old browsers
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  }
  
  // move dependent functions to a container so that
  // they can be overriden easier in no jquery environment (node.js)
  var f = {
    defaults: _defaults,
    inherits: _inherits
  };
  function drawPath(chart, location, points) {
    var i, len;
    var path = 'M{0},{1}';
    for (i = 2, len = 2 * points.length + 2; i < len; i+=2) {
      path += ' L{' + i + '},{' + (i + 1) + '}';
    }
    var pathValues = [location.x, location.y];
    for (i = 0, len = points.length; i < len; i++) {
      pathValues.push(points[i].x);
      pathValues.push(points[i].y);
    }
    var symbol = chart.paper.path(path, pathValues);
    symbol.attr('stroke', chart.options['element-color']);
    symbol.attr('stroke-width', chart.options['line-width']);
    return symbol;
  }
  
  function drawLine(chart, from, to, text) {
    var i, len;
  
    if (Object.prototype.toString.call(to) !== '[object Array]') {
      to = [to];
    }
  
    var path = 'M{0},{1}';
    for (i = 2, len = 2 * to.length + 2; i < len; i+=2) {
      path += ' L{' + i + '},{' + (i + 1) + '}';
    }
    var pathValues = [from.x, from.y];
    for (i = 0, len = to.length; i < len; i++) {
      pathValues.push(to[i].x);
      pathValues.push(to[i].y);
    }
  
    var line = chart.paper.path(path, pathValues);
    line.attr({
      stroke: chart.options['line-color'],
      'stroke-width': chart.options['line-width'],
      'arrow-end': chart.options['arrow-end']
    });
  
    if (text) {
  
      var centerText = false;
  
      var textPath = chart.paper.text(0, 0, text);
  
      var isHorizontal = false;
      var firstTo = to[0];
  
      if (from.y === firstTo.y) {
        isHorizontal = true;
      }
  
      var x = 0,
          y = 0;
  
      if (centerText) {
        if (from.x > firstTo.x) {
          x = from.x - (from.x - firstTo.x)/2;
        } else {
          x = firstTo.x - (firstTo.x - from.x)/2;
        }
  
        if (from.y > firstTo.y) {
          y = from.y - (from.y - firstTo.y)/2;
        } else {
          y = firstTo.y - (firstTo.y - from.y)/2;
        }
  
        if (isHorizontal) {
          x -= textPath.getBBox().width/2;
          y -= chart.options['text-margin'];
        } else {
          x += chart.options['text-margin'];
          y -= textPath.getBBox().height/2;
        }
      } else {
        x = from.x;
        y = from.y;
  
        if (isHorizontal) {
          x += chart.options['text-margin']/2;
          y -= chart.options['text-margin'];
        } else {
          x += chart.options['text-margin']/2;
          y += chart.options['text-margin'];
        }
      }
  
      textPath.attr({
        'text-anchor': 'start',
        'font-size': chart.options['font-size'],
        stroke: chart.options['font-color'],
        x: x,
        y: y
      });
    }
  
    return line;
  }
  
  function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
      x: null,
      y: null,
      onLine1: false,
      onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
      return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;
  
    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
    // it is worth noting that this should be the same as:
    x = line2StartX + (b * (line2EndX - line2StartX));
    y = line2StartX + (b * (line2EndY - line2StartY));
    */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
      result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
      result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
  }
  function FlowChart(container, options) {
    options = options || {};
  
    this.paper = new Raphael(container);
  
    this.options = f.defaults(options, o);
  
    this.symbols = [];
    this.lines = [];
    this.start = null;
  }
  
  FlowChart.prototype.handle = function(symbol) {
    if (this.symbols.indexOf(symbol) <= -1) {
      this.symbols.push(symbol);
    }
  
    var flowChart = this;
  
    if (symbol instanceof(Condition)) {
      symbol.yes = function(nextSymbol) {
        symbol.yes_symbol = nextSymbol;
        if(symbol.no_symbol) {
          symbol.pathOk = true;
        }
        return flowChart.handle(nextSymbol);
      };
      symbol.no = function(nextSymbol) {
        symbol.no_symbol = nextSymbol;
        if(symbol.yes_symbol) {
          symbol.pathOk = true;
        }
        return flowChart.handle(nextSymbol);
      };
    } else {
      symbol.then = function(nextSymbol) {
        symbol.next = nextSymbol;
        symbol.pathOk = true;
        return flowChart.handle(nextSymbol);
      };
    }
  
    return symbol;
  };
  
  FlowChart.prototype.startWith = function(symbol) {
    this.start = symbol;
    return this.handle(symbol);
  };
  
  FlowChart.prototype.render = function() {
    var maxWidth = 0,
        i = 0,
        len = 0,
        maxX = 0,
        maxY = 0,
        symbol;
  
    for (i = 0, len = this.symbols.length; i < len; i++) {
      symbol = this.symbols[i];
      if (symbol.width > maxWidth) {
        maxWidth = symbol.width;
      }
    }
  
    for (i = 0, len = this.symbols.length; i < len; i++) {
      symbol = this.symbols[i];
      symbol.shiftX((maxWidth - symbol.width)/2);
    }
  
    this.start.render();
    // for (i = 0, len = this.symbols.length; i < len; i++) {
    //   symbol = this.symbols[i];
    //   symbol.render();
    // }
  
    for (i = 0, len = this.symbols.length; i < len; i++) {
      symbol = this.symbols[i];
      symbol.renderLines();
    }
  
    maxX = this.maxXFromLine;
  
    for (i = 0, len = this.symbols.length; i < len; i++) {
      symbol = this.symbols[i];
      var x = symbol.getX() + symbol.width;
      var y = symbol.getY() + symbol.height;
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
    }
  
    this.paper.setSize(maxX + this.options['line-width'], maxY + this.options['line-width']);
  };
  
  FlowChart.prototype.clean = function() {
    if (this.paper) {
      var paperDom = this.paper.canvas;
      paperDom.parentNode.removeChild(paperDom);
    }
  };
  function Symbol(chart, options, symbol) {
    this.chart = chart;
    this.group = this.chart.paper.set();
    this.connectedTo = [];
  
    this.text = this.chart.paper.text(0, 0, options.text);
    this.text.attr({
      'text-anchor': 'start',
      'font-size': this.chart.options['font-size'],
      'x': this.chart.options['text-margin'],
      stroke: chart.options['font-color']
    });
    if (options.link) { this.text.attr('href', options.link); }
    if (options.target) { this.text.attr('target', options.target); }
    this.group.push(this.text);
  
    if (symbol) {
      symbol.attr({
        stroke: this.chart.options['element-color'],
        'stroke-width': this.chart.options['line-width'],
        width: this.text.getBBox().width + 2 * this.chart.options['text-margin'],
        height: this.text.getBBox().height + 2 * this.chart.options['text-margin'],
        fill: chart.options['fill']
      });
      if (options.link) { symbol.attr('href', options.link); }
      if (options.target) { symbol.attr('target', options.target); }
  
      this.group.push(symbol);
      symbol.insertBefore(this.text);
  
      this.text.attr({
        'y': symbol.getBBox().height/2
      });
  
      this.initialize();
    }
  }
  
  Symbol.prototype.initialize = function() {
    this.group.transform('t' + this.chart.options['line-width'] + ',' + this.chart.options['line-width']);
  
    this.width = this.group.getBBox().width;
    this.height = this.group.getBBox().height;
  };
  
  Symbol.prototype.getCenter = function() {
    return {x: this.getX() + this.width/2,
            y: this.getY() + this.height/2};
  };
  
  Symbol.prototype.getX = function() {
    return this.group.getBBox().x;
  };
  
  Symbol.prototype.getY = function() {
    return this.group.getBBox().y;
  };
  
  Symbol.prototype.shiftX = function(x) {
    this.group.transform('t' + (this.getX() + x) + ',' + this.getY());
  };
  
  Symbol.prototype.setX = function(x) {
    this.group.transform('t' + x + ',' + this.getY());
  };
  
  Symbol.prototype.shiftY = function(y) {
    this.group.transform('t' + this.getX() + ',' + (this.getY() + y));
  };
  
  Symbol.prototype.setY = function(y) {
    this.group.transform('t' + this.getX() + ',' + y);
  };
  
  Symbol.prototype.getTop = function() {
    var y = this.getY();
    var x = this.getX() + this.width/2;
    return {x: x, y: y};
  };
  
  Symbol.prototype.getBottom = function() {
    var y = this.getY() + this.height;
    var x = this.getX() + this.width/2;
    return {x: x, y: y};
  };
  
  Symbol.prototype.getLeft = function() {
    var y = this.getY() + this.group.getBBox().height/2;
    var x = this.getX();
    return {x: x, y: y};
  };
  
  Symbol.prototype.getRight = function() {
    var y = this.getY() + this.group.getBBox().height/2;
    var x = this.getX() + this.group.getBBox().width;
    return {x: x, y: y};
  };
  
  Symbol.prototype.render = function() {
    if (this.next) {
      var bottomPoint = this.getBottom();
      var topPoint = this.next.getTop();
  
      if (!this.next.isPositioned) {
        this.next.shiftY(this.getY() + this.height + this.chart.options['line-length']);
        this.next.setX(bottomPoint.x - this.next.width/2);
        this.next.isPositioned = true;
  
        this.next.render();
      }
    }
  };
  
  Symbol.prototype.renderLines = function() {
    if (this.next) {
      this.drawLineTo(this.next);
    }
  };
  
  Symbol.prototype.drawLineTo = function(symbol, text, origin) {
    if (this.connectedTo.indexOf(symbol) >= 0) {
      return;
    }
  
    this.connectedTo.push(symbol);
  
    var x = this.getCenter().x,
        y = this.getCenter().y,
        top = this.getTop(),
        right = this.getRight(),
        bottom = this.getBottom(),
        left = this.getLeft();
  
    var symbolX = symbol.getCenter().x,
        symbolY = symbol.getCenter().y,
        symbolTop = symbol.getTop(),
        symbolRight = symbol.getRight(),
        symbolBottom = symbol.getBottom(),
        symbolLeft = symbol.getLeft();
  
    var isOnSameColumn = x === symbolX,
        isOnSameLine = y === symbolY,
        isUnder = y < symbolY,
        isUpper = y > symbolY,
        isLeft = x > symbolX,
        isRight = x < symbolX;
  
    var maxX = 0,
        line;
  
    if ((!origin || origin === 'bottom') && isOnSameColumn && isUnder) {
      line = drawLine(this.chart, bottom, symbolTop, text);
      this.bottomStart = true;
      symbol.topEnd = true;
      maxX = bottom.x;
    } else if ((!origin || origin === 'right') && isOnSameLine && isRight) {
      line = drawLine(this.chart, right, symbolLeft, text);
      this.rightStart = true;
      symbol.leftEnd = true;
      maxX = symbolLeft.x;
    } else if ((!origin || origin === 'left') && isOnSameLine && isLeft) {
      line = drawLine(this.chart, left, symbolRight, text);
      this.leftStart = true;
      symbol.rightEnd = true;
      maxX = symbolRight.x;
    } else if ((!origin || origin === 'right') && isOnSameColumn && isUpper) {
      line = drawLine(this.chart, right, [
        {x: right.x + this.chart.options['line-length']/2, y: right.y},
        {x: right.x + this.chart.options['line-length']/2, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y}
      ], text);
      this.rightStart = true;
      symbol.topEnd = true;
      maxX = right.x + this.chart.options['line-length']/2;
    } else if ((!origin || origin === 'bottom') && isLeft) {
      if (this.leftEnd && isUpper) {
        line = drawLine(this.chart, bottom, [
          {x: bottom.x, y: bottom.y + this.chart.options['line-length']/2},
          {x: bottom.x + (bottom.x - symbolTop.x)/2, y: bottom.y + this.chart.options['line-length']/2},
          {x: bottom.x + (bottom.x - symbolTop.x)/2, y: symbolTop.y - this.chart.options['line-length']/2},
          {x: symbolTop.x, y: symbolTop.y - this.chart.options['line-length']/2},
          {x: symbolTop.x, y: symbolTop.y}
        ], text);
      } else {
        line = drawLine(this.chart, bottom, [
          {x: bottom.x, y: symbolTop.y - this.chart.options['line-length']/2},
          {x: symbolTop.x, y: symbolTop.y - this.chart.options['line-length']/2},
          {x: symbolTop.x, y: symbolTop.y}
        ], text);
      }
      this.bottomStart = true;
      symbol.topEnd = true;
      maxX = bottom.x + (bottom.x - symbolTop.x)/2;
    } else if ((!origin || origin === 'bottom') && isRight) {
      line = drawLine(this.chart, bottom, [
        {x: bottom.x, y: bottom.y + this.chart.options['line-length']/2},
        {x: bottom.x + (bottom.x - symbolTop.x)/2, y: bottom.y + this.chart.options['line-length']/2},
        {x: bottom.x + (bottom.x - symbolTop.x)/2, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y}
      ], text);
      this.bottomStart = true;
      symbol.topEnd = true;
      maxX = bottom.x + (bottom.x - symbolTop.x)/2;
    } else if ((origin && origin === 'right') && isLeft) {
      line = drawLine(this.chart, right, [
        {x: right.x + this.chart.options['line-length']/2, y: right.y},
        {x: right.x + this.chart.options['line-length']/2, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y}
      ], text);
      this.rightStart = true;
      symbol.topEnd = true;
      maxX = right.x + this.chart.options['line-length']/2;
    } else if ((origin && origin === 'right') && isRight) {
      line = drawLine(this.chart, right, [
        {x: symbolRight.x + this.chart.options['line-length']/2, y: right.y},
        {x: symbolRight.x + this.chart.options['line-length']/2, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y}
      ], text);
      this.rightStart = true;
      symbol.topEnd = true;
      maxX = symbolRight.x + this.chart.options['line-length']/2;
    } else if ((origin && origin === 'bottom') && isOnSameColumn && isUpper) {
      line = drawLine(this.chart, bottom, [
        {x: bottom.x, y: bottom.y + this.chart.options['line-length']/2},
        {x: right.x + this.chart.options['line-length']/2, y: bottom.y + this.chart.options['line-length']/2},
        {x: right.x + this.chart.options['line-length']/2, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y - this.chart.options['line-length']/2},
        {x: symbolTop.x, y: symbolTop.y}
      ], text);
      this.bottomStart = true;
      symbol.topEnd = true;
      maxX = bottom.x + this.chart.options['line-length']/2;
    }
  
    if (line) {
      var self = this;
      for (var l = 0, llen = this.chart.lines.length; l < llen; l++) {
        var otherLine = this.chart.lines[l];
        var i,
            len,
            intersections,
            inter;
  
        var ePath = otherLine.attr('path'),
            lPath = line.attr('path');
  
        for (var iP = 0, lenP = ePath.length - 1; iP < lenP; iP++) {
          var newPath = [];
          newPath.push(['M', ePath[iP][1], ePath[iP][2]]);
          newPath.push(['L', ePath[iP + 1][1], ePath[iP + 1][2]]);
  
          var line1_from_x = newPath[0][1];
          var line1_from_y = newPath[0][2];
          var line1_to_x = newPath[1][1];
          var line1_to_y = newPath[1][2];
  
          for (var lP = 0, lenlP = lPath.length - 1; lP < lenlP; lP++) {
            var newLinePath = [];
            newLinePath.push(['M', lPath[lP][1], lPath[lP][2]]);
            newLinePath.push(['L', lPath[lP + 1][1], lPath[lP + 1][2]]);
  
            var line2_from_x = newLinePath[0][1];
            var line2_from_y = newLinePath[0][2];
            var line2_to_x = newLinePath[1][1];
            var line2_to_y = newLinePath[1][2];
  
            var res = checkLineIntersection(line1_from_x, line1_from_y, line1_to_x, line1_to_y, line2_from_x, line2_from_y, line2_to_x, line2_to_y);
            if (res.onLine1 && res.onLine2) {
  
              var newSegment;
              if (line2_from_y === line2_to_y) {
                if (line2_from_x > line2_to_x) {
                  newSegment = ['L', res.x + this.chart.options['line-width'] * 2,  line2_from_y];
                  lPath.splice(lP + 1, 0, newSegment);
                  newSegment = ['C', res.x + this.chart.options['line-width'] * 2,  line2_from_y, res.x, line2_from_y - this.chart.options['line-width'] * 4, res.x - this.chart.options['line-width'] * 2, line2_from_y];
                  lPath.splice(lP + 2, 0, newSegment);
                  line.attr('path', lPath);
                } else {
                  newSegment = ['L', res.x - this.chart.options['line-width'] * 2,  line2_from_y];
                  lPath.splice(lP + 1, 0, newSegment);
                  newSegment = ['C', res.x - this.chart.options['line-width'] * 2,  line2_from_y, res.x, line2_from_y - this.chart.options['line-width'] * 4, res.x + this.chart.options['line-width'] * 2, line2_from_y];
                  lPath.splice(lP + 2, 0, newSegment);
                  line.attr('path', lPath);
                }
              } else {
                if (line2_from_y > line2_to_y) {
                  newSegment = ['L', line2_from_x, res.y + this.chart.options['line-width'] * 2];
                  lPath.splice(lP + 1, 0, newSegment);
                  newSegment = ['C', line2_from_x, res.y + this.chart.options['line-width'] * 2, line2_from_x + this.chart.options['line-width'] * 4, res.y, line2_from_x, res.y - this.chart.options['line-width'] * 2];
                  lPath.splice(lP + 2, 0, newSegment);
                  line.attr('path', lPath);
                } else {
                  newSegment = ['L', line2_from_x, res.y - this.chart.options['line-width'] * 2];
                  lPath.splice(lP + 1, 0, newSegment);
                  newSegment = ['C', line2_from_x, res.y - this.chart.options['line-width'] * 2, line2_from_x + this.chart.options['line-width'] * 4, res.y, line2_from_x, res.y + this.chart.options['line-width'] * 2];
                  lPath.splice(lP + 2, 0, newSegment);
                  line.attr('path', lPath);
                }
              }
  
              lP += 2;
              len += 2;
            }
          }
        }
      }
  
      this.chart.lines.push(line);
    }
  
    if (!this.chart.maxXFromLine || (this.chart.maxXFromLine && maxX > this.chart.maxXFromLine)) {
      this.chart.maxXFromLine = maxX;
    }
  };
  function Start(chart, options) {
    var symbol = chart.paper.rect(0, 0, 0, 0, 20);
    options = options || {};
    options.text = options.text || 'Start';
    Symbol.call(this, chart, options, symbol);
  }
  f.inherits(Start, Symbol);
  function End(chart, options) {
    var symbol = chart.paper.rect(0, 0, 0, 0, 20);
    options = options || {};
    options.text = options.text || 'End';
    Symbol.call(this, chart, options, symbol);
  }
  f.inherits(End, Symbol);
  function Operation(chart, options) {
    var symbol = chart.paper.rect(0, 0, 0, 0);
    options = options || {};
    Symbol.call(this, chart, options, symbol);
  }
  f.inherits(Operation, Symbol);
  function Subroutine(chart, options) {
    var symbol = chart.paper.rect(0, 0, 0, 0);
    options = options || {};
    Symbol.call(this, chart, options, symbol);
  
    symbol.attr({
      width: this.text.getBBox().width + 4 * chart.options['text-margin']
    });
  
    this.text.attr({
      'x': 2 * chart.options['text-margin']
    });
  
    var innerWrap = chart.paper.rect(0, 0, 0, 0);
    innerWrap.attr({
      x: chart.options['text-margin'],
      stroke: chart.options['element-color'],
      'stroke-width': chart.options['line-width'],
      width: this.text.getBBox().width + 2 * chart.options['text-margin'],
      height: this.text.getBBox().height + 2 * chart.options['text-margin'],
      fill: chart.options['fill']
    });
    if (options.link) { innerWrap.attr('href', options.link); }
    if (options.target) { innerWrap.attr('target', options.target); }
    this.group.push(innerWrap);
    innerWrap.insertBefore(this.text);
  
    this.initialize();
  }
  f.inherits(Subroutine, Symbol);
  function InputOutput(chart, options) {
    options = options || {};
    Symbol.call(this, chart, options);
  
    this.text.attr({
      x: chart.options['text-margin'] * 3
    });
  
    var width = this.text.getBBox().width + 4 * chart.options['text-margin'];
    var height = this.text.getBBox().height + 2 * chart.options['text-margin'];
    var startX = chart.options['text-margin'];
    var startY = height/2;
  
    var start = {x: startX, y: startY};
    var points = [
      {x: startX - chart.options['text-margin'], y: height},
      {x: startX - chart.options['text-margin'] + width, y: height},
      {x: startX - chart.options['text-margin'] + width + 2 * chart.options['text-margin'], y: 0},
      {x: startX - chart.options['text-margin'] + 2 * chart.options['text-margin'], y: 0},
      {x: startX, y: startY}
    ];
  
    var symbol = drawPath(chart, start, points);
  
    symbol.attr({
      stroke: chart.options['element-color'],
      'stroke-width': chart.options['line-width'],
      fill: chart.options['fill']
    });
    if (options.link) { symbol.attr('href', options.link); }
    if (options.target) { symbol.attr('target', options.target); }
  
    this.text.attr({
      y: symbol.getBBox().height/2
    });
  
    this.group.push(symbol);
    symbol.insertBefore(this.text);
  
    this.initialize();
  }
  f.inherits(InputOutput, Symbol);
  
  InputOutput.prototype.getLeft = function() {
    var y = this.getY() + this.group.getBBox().height/2;
    var x = this.getX() + this.chart.options['text-margin'];
    return {x: x, y: y};
  };
  
  InputOutput.prototype.getRight = function() {
    var y = this.getY() + this.group.getBBox().height/2;
    var x = this.getX() + this.group.getBBox().width - this.chart.options['text-margin'];
    return {x: x, y: y};
  };
  function Condition(chart, options) {
    options = options || {};
    Symbol.call(this, chart, options);
  
    this.yes_direction = 'bottom';
    this.no_direction = 'right';
    if (options.yes && options.yes.direction && options.no && !options.no.direction) {
      if (options.yes.direction === 'right') {
        this.no_direction = 'bottom';
        this.yes_direction = 'right';
      } else {
        this.no_direction = 'right';
        this.yes_direction = 'bottom';
      }
    } else if (options.yes && !options.yes.direction && options.no && options.no.direction) {
      if (options.no.direction === 'right') {
        this.yes_direction = 'bottom';
        this.no_direction = 'right';
      } else {
        this.yes_direction = 'right';
        this.no_direction = 'bottom';
      }
    } else {
      this.yes_direction = 'bottom';
      this.no_direction = 'right';
    }
  
    this.yes_direction = this.yes_direction || 'bottom';
    this.no_direction = this.no_direction || 'right';
  
    this.text.attr({
      x: chart.options['text-margin'] * 2
    });
  
    var width = this.text.getBBox().width + 3 * chart.options['text-margin'];
    width += width/2;
    var height = this.text.getBBox().height + 2 * chart.options['text-margin'];
    height += height/2;
    var startX = width/4;
    var startY = height/4;
  
    this.text.attr({
      x: startX + chart.options['text-margin']/2
    });
  
    var start = {x: startX, y: startY};
    var points = [
      {x: startX - width/4, y: startY + height/4},
      {x: startX - width/4 + width/2, y: startY + height/4 + height/2},
      {x: startX - width/4 + width, y: startY + height/4},
      {x: startX - width/4 + width/2, y: startY + height/4 - height/2},
      {x: startX - width/4, y: startY + height/4}
    ];
  
    var symbol = drawPath(chart, start, points);
  
    symbol.attr({
      stroke: chart.options['element-color'],
      'stroke-width': chart.options['line-width'],
      fill: chart.options['fill']
    });
    if (options.link) { symbol.attr('href', options.link); }
    if (options.target) { symbol.attr('target', options.target); }
  
    this.text.attr({
      y: symbol.getBBox().height/2
    });
  
    this.group.push(symbol);
    symbol.insertBefore(this.text);
  
    this.initialize();
  }
  f.inherits(Condition, Symbol);
  
  Condition.prototype.render = function() {
  
    if (this.yes_direction) {
      this[this.yes_direction + '_symbol'] = this.yes_symbol;
    }
  
    if (this.no_direction) {
      this[this.no_direction + '_symbol'] = this.no_symbol;
    }
  
    if (this.bottom_symbol) {
      var bottomPoint = this.getBottom();
      var topPoint = this.bottom_symbol.getTop();
  
      if (!this.bottom_symbol.isPositioned) {
        this.bottom_symbol.shiftY(this.getY() + this.height + this.chart.options['line-length']);
        this.bottom_symbol.setX(bottomPoint.x - this.bottom_symbol.width/2);
        this.bottom_symbol.isPositioned = true;
  
        this.bottom_symbol.render();
      }
    }
  
    if (this.right_symbol) {
      var rightPoint = this.getRight();
      var leftPoint = this.right_symbol.getLeft();
  
      if (!this.right_symbol.isPositioned) {
  
        this.right_symbol.setY(rightPoint.y - this.right_symbol.height/2);
        this.right_symbol.shiftX(this.group.getBBox().x + this.width + this.chart.options['line-length']);
  
        var self = this;
        (function shift() {
          var hasSymbolUnder = false;
          var symb;
          for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
            symb = self.chart.symbols[i];
  
            var diff = Math.abs(symb.getCenter().x - self.right_symbol.getCenter().x);
            if (symb.getCenter().y > self.right_symbol.getCenter().y && diff <= self.right_symbol.width/2) {
              hasSymbolUnder = true;
              break;
            }
          }
  
          if (hasSymbolUnder) {
            self.right_symbol.setX(symb.getX() + symb.width + self.chart.options['line-length']);
            shift();
          }
        })();
  
        this.right_symbol.isPositioned = true;
  
        this.right_symbol.render();
      }
    }
  };
  
  Condition.prototype.renderLines = function() {
    if (this.yes_symbol) {
      this.drawLineTo(this.yes_symbol, this.chart.options['yes-text'], this.yes_direction);
    }
  
    if (this.no_symbol) {
      this.drawLineTo(this.no_symbol, this.chart.options['no-text'], this.no_direction);
    }
  };
  function parse(input) {
    input = input || '';
    input = input.trim();
  
    var chart = {
      symbols: {},
      start: null,
      drawSVG: function(container, options) {
        if (this.diagram) {
          this.diagram.clean();
        }
  
        var diagram = new FlowChart(container, options);
        this.diagram = diagram;
        var dispSymbols = {};
  
        function getDisplaySymbol(s) {
          if (dispSymbols[s.key]) {
            return dispSymbols[s.key];
          }
  
          switch (s.symbolType) {
            case 'start':
              dispSymbols[s.key] = new Start(diagram, s);
              break;
            case 'end':
              dispSymbols[s.key] = new End(diagram, s);
              break;
            case 'operation':
              dispSymbols[s.key] = new Operation(diagram, s);
              break;
            case 'inputoutput':
              dispSymbols[s.key] = new InputOutput(diagram, s);
              break;
            case 'subroutine':
              dispSymbols[s.key] = new Subroutine(diagram, s);
              break;
            case 'condition':
              dispSymbols[s.key] = new Condition(diagram, s);
              break;
            default:
              return new Error('Wrong symbol type!');
          }
  
          return dispSymbols[s.key];
        }
  
        var self = this;
  
        (function constructChart(s, prevDisp, prev) {
          var dispSymb = getDisplaySymbol(s);
  
          if (self.start === s) {
            diagram.startWith(dispSymb);
          } else if (prevDisp && prev && !prevDisp.pathOk) {
            if (prevDisp instanceof(Condition)) {
              if (prev.yes === s) {
                prevDisp.yes(dispSymb);
              } else if (prev.no === s) {
                prevDisp.no(dispSymb);
              }
            } else {
              prevDisp.then(dispSymb);
            }
          }
  
          if (dispSymb.pathOk) {
            return dispSymb;
          }
  
          if (dispSymb instanceof(Condition)) {
            if (s.yes) {
              constructChart(s.yes, dispSymb, s);
            }
            if (s.no) {
              constructChart(s.no, dispSymb, s);
            }
          } else if (s.next) {
            constructChart(s.next, dispSymb, s);
          }
  
          return dispSymb;
        })(this.start);
  
        diagram.render();
      },
      clean: function() {
        this.diagram.clean();
      }
    };
  
    var lines = input.split('\n');
    for (var l = 1, len = lines.length; l < len;) {
      var currentLine = lines[l];
  
      if (currentLine.indexOf(': ') < 0 && currentLine.indexOf('(') < 0 && currentLine.indexOf(')') < 0 && currentLine.indexOf('->') < 0 && currentLine.indexOf('=>') < 0) {
        lines[l - 1] += '\n' + currentLine;
        lines.splice(l, 1);
        len--;
      } else {
        l++;
      }
    }
  
    function getSymbol(s) {
      var startIndex = s.indexOf('(') + 1;
      var endIndex = s.indexOf(')');
      if (startIndex >= 0 && endIndex >= 0) {
        return chart.symbols[s.substring(0, startIndex - 1)];
      }
      return chart.symbols[s];
    }
  
    function getNextPath(s) {
      var next = 'next';
      var startIndex = s.indexOf('(') + 1;
      var endIndex = s.indexOf(')');
      if (startIndex >= 0 && endIndex >= 0) {
        next = flowSymb.substring(startIndex, endIndex);
      }
      return next;
    }
  
    while(lines.length > 0) {
      var line = lines.splice(0, 1)[0];
  
      if (line.indexOf('=>') >= 0) {
        // definition
        var parts = line.split('=>');
        var symbol = {
          key: parts[0],
          symbolType: parts[1],
          text: null,
          link: null,
          target: null
        };
  
        var sub;
  
        if (symbol.symbolType.indexOf(': ') >= 0) {
          sub = symbol.symbolType.split(': ');
          symbol.symbolType = sub[0];
          symbol.text = sub[1];
        }
  
        if (symbol.text && symbol.text.indexOf(':>') >= 0) {
          sub = symbol.text.split(':>');
          symbol.text = sub[0];
          symbol.link = sub[1];
        } else if (symbol.symbolType.indexOf(':>') >= 0) {
          sub = symbol.symbolType.split(':>');
          symbol.symbolType = sub[0];
          symbol.link = sub[1];
        }
  
        if (symbol.symbolType.indexOf('\n') >= 0) {
          symbol.symbolType = symbol.symbolType.split('\n')[0];
        }
  
        if (symbol.link) {
          var startIndex = symbol.link.indexOf('[') + 1;
          var endIndex = symbol.link.indexOf(']');
          if (startIndex >= 0 && endIndex >= 0) {
            symbol.target = symbol.link.substring(startIndex, endIndex);
            symbol.link = symbol.link.substring(0, startIndex - 1);
          }
        }
  
        chart.symbols[symbol.key] = symbol;
  
      } else if (line.indexOf('->') >= 0) {
        // flow
        var flowSymbols = line.split('->');
        for (var i = 0, lenS = flowSymbols.length; i < lenS; i++) {
          var flowSymb = flowSymbols[i];
  
          var realSymb = getSymbol(flowSymb);
          var next = getNextPath(flowSymb);
  
          var direction;
          if (next.indexOf(',') >= 0) {
            var condOpt = next.split(',');
            next = condOpt[0];
            direction = condOpt[1].trim();
          }
  
          if (!chart.start) {
            chart.start = realSymb;
          }
  
          if (i + 1 < lenS) {
            var nextSymb = flowSymbols[i + 1];
            realSymb[next] = getSymbol(nextSymb);
            realSymb[next].direction = direction;
            direction = undefined;
          }
        }
  
      }
  
    }
  
    return chart;
  }
  // public api interface
  flowchart.parse = parse;

})();