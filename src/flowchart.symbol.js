var drawAPI = require('./flowchart.functions');
var drawLine = drawAPI.drawLine;
var checkLineIntersection = drawAPI.checkLineIntersection;

function Symbol(chart, options, symbol) {
  this.chart = chart;
  this.group = this.chart.paper.set();
  this.symbol = symbol;
  this.connectedTo = [];
  this.symbolType = options.symbolType;
  this.flowstate = (options.flowstate || 'future');
  this.lineStyle = (options.lineStyle || {});
  this.key = (options.key || '');

  this.next_direction = options.next && options['direction_next'] ? options['direction_next'] : undefined;

  this.text = this.chart.paper.text(0, 0, options.text);
  //Raphael does not support the svg group tag so setting the text node id to the symbol node id plus t
  if (options.key) { this.text.node.id = options.key + 't'; }
  this.text.node.setAttribute('class', this.getAttr('class') + 't');

  this.text.attr({
    'text-anchor': 'start',
    'x'          : this.getAttr('text-margin'),
    'fill'       : this.getAttr('font-color'),
    'font-size'  : this.getAttr('font-size')
  });

  var font  = this.getAttr('font');
  var fontF = this.getAttr('font-family');
  var fontW = this.getAttr('font-weight');

  if (font) this.text.attr({ 'font': font });
  if (fontF) this.text.attr({ 'font-family': fontF });
  if (fontW) this.text.attr({ 'font-weight': fontW });

  if (options.link) { this.text.attr('href', options.link); }
  
  //ndrqu Add click function with event and options params
  if (options.function) { 
    this.text.attr({ 'cursor' : 'pointer' });

    this.text.node.addEventListener("click", function(evt) {
        window[options.function](evt,options);
    }, false);
   }
   
  if (options.target) { this.text.attr('target', options.target); }

  var maxWidth = this.getAttr('maxWidth');
  if (maxWidth) {
    // using this approach: http://stackoverflow.com/a/3153457/22466
    var words = options.text.split(' ');
    var tempText = "";
    for (var i=0, ii=words.length; i<ii; i++) {
      var word = words[i];
      this.text.attr("text", tempText + " " + word);
      if (this.text.getBBox().width > maxWidth) {
        tempText += "\n" + word;
      } else {
        tempText += " " + word;
      }
    }
    this.text.attr("text", tempText.substring(1));
  }

  this.group.push(this.text);

  if (symbol) {
    var tmpMargin = this.getAttr('text-margin');

    symbol.attr({
      'fill' : this.getAttr('fill'),
      'stroke' : this.getAttr('element-color'),
      'stroke-width' : this.getAttr('line-width'),
      'width' : this.text.getBBox().width + 2 * tmpMargin,
      'height' : this.text.getBBox().height + 2 * tmpMargin
    });

    symbol.node.setAttribute('class', this.getAttr('class'));

    if (options.link) { symbol.attr('href', options.link); }
    if (options.target) { symbol.attr('target', options.target); }

    //ndrqu Add click function with event and options params
    if (options.function) { 
        symbol.node.addEventListener("click", function(evt) {
          window[options.function](evt,options);
        }, false);
      symbol.attr({ 'cursor' : 'pointer' });
    }
    if (options.key) { symbol.node.id = options.key; }

    this.group.push(symbol);
    symbol.insertBefore(this.text);

    this.text.attr({
      'y': symbol.getBBox().height/2
    });

    this.initialize();
  }

}

/* Gets the attribute based on Flowstate, Symbol-Name and default, first found wins */
Symbol.prototype.getAttr = function(attName) {
  if (!this.chart) {
    return undefined;
  }
  var opt3 = (this.chart.options) ? this.chart.options[attName] : undefined;
  var opt2 = (this.chart.options.symbols) ? this.chart.options.symbols[this.symbolType][attName] : undefined;
  var opt1;
  if (this.chart.options.flowstate && this.chart.options.flowstate[this.flowstate]) {
    opt1 = this.chart.options.flowstate[this.flowstate][attName];
  }
  return (opt1 || opt2 || opt3);
};

Symbol.prototype.initialize = function() {
  this.group.transform('t' + this.getAttr('line-width') + ',' + this.getAttr('line-width'));

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

    var self = this;
    var lineLength = this.getAttr('line-length');

    if (this.next_direction === 'right') {

      var rightPoint = this.getRight();

      if (!this.next.isPositioned) {
        this.next.setY(rightPoint.y - this.next.height/2);
        this.next.shiftX(this.group.getBBox().x + this.width + lineLength);

        (function shift() {
          var hasSymbolUnder = false;
          var symb;
          for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
            symb = self.chart.symbols[i];

            var diff = Math.abs(symb.getCenter().x - self.next.getCenter().x);
            if (symb.getCenter().y > self.next.getCenter().y && diff <= self.next.width/2) {
              hasSymbolUnder = true;
              break;
            }
          }

          if (hasSymbolUnder) {
            if (self.next.symbolType === 'end') return;
            self.next.setX(symb.getX() + symb.width + lineLength);
            shift();
          }
        })();

        this.next.isPositioned = true;

        this.next.render();
      }
    } else if (this.next_direction === 'left') {

      var leftPoint = this.getLeft();

      if (!this.next.isPositioned) {
        this.next.setY(leftPoint.y - this.next.height/2);
        this.next.shiftX(-(this.group.getBBox().x + this.width + lineLength));

        (function shift() {
          var hasSymbolUnder = false;
          var symb;
          for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
            symb = self.chart.symbols[i];

            var diff = Math.abs(symb.getCenter().x - self.next.getCenter().x);
            if (symb.getCenter().y > self.next.getCenter().y && diff <= self.next.width/2) {
              hasSymbolUnder = true;
              break;
            }
          }

          if (hasSymbolUnder) {
            if (self.next.symbolType === 'end') return;
            self.next.setX(symb.getX() + symb.width + lineLength);
            shift();
          }
        })();

        this.next.isPositioned = true;

        this.next.render();
      }
    } else {
      var bottomPoint = this.getBottom();

      if (!this.next.isPositioned) {
        this.next.shiftY(this.getY() + this.height + lineLength);
        this.next.setX(bottomPoint.x - this.next.width/2);
        this.next.isPositioned = true;

        this.next.render();
      }
    }
  }
};

Symbol.prototype.renderLines = function() {
  if (this.next) {
    if (this.next_direction) {
      this.drawLineTo(this.next, this.getAttr('arrow-text') || '', this.next_direction);
    } else {
      this.drawLineTo(this.next, this.getAttr('arrow-text') || '');
    }
  }
};

Symbol.prototype.drawLineTo = function(symbol, text, origin) {
  if (this.connectedTo.indexOf(symbol) < 0) {
    this.connectedTo.push(symbol);
  }

  var x = this.getCenter().x,
      y = this.getCenter().y,
      right = this.getRight(),
      bottom = this.getBottom(),
      top = this.getTop(),
      left = this.getLeft();

  var symbolX = symbol.getCenter().x,
      symbolY = symbol.getCenter().y,
      symbolTop = symbol.getTop(),
      symbolRight = symbol.getRight(),
      symbolLeft = symbol.getLeft();

  var isOnSameColumn = x === symbolX,
      isOnSameLine = y === symbolY,
      isUnder = y < symbolY,
      isUpper = y > symbolY || this === symbol,
      isLeft = x > symbolX,
      isRight = x < symbolX;

  var maxX = 0,
      line,
      lineLength = this.getAttr('line-length'),
      lineWith = this.getAttr('line-width');

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
      {x: right.x + lineLength/2, y: right.y},
      {x: right.x + lineLength/2, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.rightStart = true;
    symbol.topEnd = true;
    maxX = right.x + lineLength/2;
  } else if ((!origin || origin === 'right') && isOnSameColumn && isUnder) {
    line = drawLine(this.chart, right, [
      {x: right.x + lineLength/2, y: right.y},
      {x: right.x + lineLength/2, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.rightStart = true;
    symbol.topEnd = true;
    maxX = right.x + lineLength/2;
  } else if ((!origin || origin === 'bottom') && isLeft) {
    if (this.leftEnd && isUpper) {
      line = drawLine(this.chart, bottom, [
        {x: bottom.x, y: bottom.y + lineLength/2},
        {x: bottom.x + (bottom.x - symbolTop.x)/2, y: bottom.y + lineLength/2},
        {x: bottom.x + (bottom.x - symbolTop.x)/2, y: symbolTop.y - lineLength/2},
        {x: symbolTop.x, y: symbolTop.y - lineLength/2},
        {x: symbolTop.x, y: symbolTop.y}
      ], text);
    } else {
      line = drawLine(this.chart, bottom, [
        {x: bottom.x, y: symbolTop.y - lineLength/2},
        {x: symbolTop.x, y: symbolTop.y - lineLength/2},
        {x: symbolTop.x, y: symbolTop.y}
      ], text);
    }
    this.bottomStart = true;
    symbol.topEnd = true;
    maxX = bottom.x + (bottom.x - symbolTop.x)/2;
  } else if ((!origin || origin === 'bottom') && isRight && isUnder) {
    line = drawLine(this.chart, bottom, [
      {x: bottom.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.bottomStart = true;
    symbol.topEnd = true;
    maxX = bottom.x;
    if (symbolTop.x > maxX) maxX = symbolTop.x;
  } else if ((!origin || origin === 'bottom') && isRight) {
    line = drawLine(this.chart, bottom, [
      {x: bottom.x, y: bottom.y + lineLength/2},
      {x: bottom.x + (bottom.x - symbolTop.x)/2, y: bottom.y + lineLength/2},
      {x: bottom.x + (bottom.x - symbolTop.x)/2, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.bottomStart = true;
    symbol.topEnd = true;
    maxX = bottom.x + (bottom.x - symbolTop.x)/2;
  } else if ((origin && origin === 'right') && isLeft) {
    line = drawLine(this.chart, right, [
      {x: right.x + lineLength/2, y: right.y},
      {x: right.x + lineLength/2, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.rightStart = true;
    symbol.topEnd = true;
    maxX = right.x + lineLength/2;
  } else if ((origin && origin === 'right') && isRight) {
    line = drawLine(this.chart, right, [
      {x: symbolTop.x, y: right.y},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.rightStart = true;
    symbol.topEnd = true;
    maxX = right.x + lineLength/2;
  } else if ((origin && origin === 'bottom') && isOnSameColumn && isUpper) {
    line = drawLine(this.chart, bottom, [
      {x: bottom.x, y: bottom.y + lineLength/2},
      {x: right.x + lineLength/2, y: bottom.y + lineLength/2},
      {x: right.x + lineLength/2, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.bottomStart = true;
    symbol.topEnd = true;
    maxX = bottom.x + lineLength/2;
  } else if ((origin === 'left') && isOnSameColumn && isUpper) {
    var diffX = left.x - lineLength/2;
    if (symbolLeft.x < left.x) {
      diffX = symbolLeft.x - lineLength/2;
    }
    line = drawLine(this.chart, left, [
      {x: diffX, y: left.y},
      {x: diffX, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.leftStart = true;
    symbol.topEnd = true;
    maxX = left.x;
  } else if ((origin === 'left')) {
    line = drawLine(this.chart, left, [
      {x: symbolTop.x + (left.x - symbolTop.x)/2, y: left.y},
      {x: symbolTop.x + (left.x - symbolTop.x)/2, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.leftStart = true;
    symbol.topEnd = true;
    maxX = left.x;
  } else if ((origin === 'top')) {
    line = drawLine(this.chart, top, [
      {x: top.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y - lineLength/2},
      {x: symbolTop.x, y: symbolTop.y}
    ], text);
    this.topStart = true;
    symbol.topEnd = true;
    maxX = top.x;
  }

  //update line style
  if (this.lineStyle[symbol.key] && line){
    line.attr(this.lineStyle[symbol.key]);
  }

  if (line) {
    for (var l = 0, llen = this.chart.lines.length; l < llen; l++) {
      var otherLine = this.chart.lines[l];
      var len;

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
                newSegment = ['L', res.x + lineWith * 2,  line2_from_y];
                lPath.splice(lP + 1, 0, newSegment);
                newSegment = ['C', res.x + lineWith * 2,  line2_from_y, res.x, line2_from_y - lineWith * 4, res.x - lineWith * 2, line2_from_y];
                lPath.splice(lP + 2, 0, newSegment);
                line.attr('path', lPath);
              } else {
                newSegment = ['L', res.x - lineWith * 2,  line2_from_y];
                lPath.splice(lP + 1, 0, newSegment);
                newSegment = ['C', res.x - lineWith * 2,  line2_from_y, res.x, line2_from_y - lineWith * 4, res.x + lineWith * 2, line2_from_y];
                lPath.splice(lP + 2, 0, newSegment);
                line.attr('path', lPath);
              }
            } else {
              if (line2_from_y > line2_to_y) {
                newSegment = ['L', line2_from_x, res.y + lineWith * 2];
                lPath.splice(lP + 1, 0, newSegment);
                newSegment = ['C', line2_from_x, res.y + lineWith * 2, line2_from_x + lineWith * 4, res.y, line2_from_x, res.y - lineWith * 2];
                lPath.splice(lP + 2, 0, newSegment);
                line.attr('path', lPath);
              } else {
                newSegment = ['L', line2_from_x, res.y - lineWith * 2];
                lPath.splice(lP + 1, 0, newSegment);
                newSegment = ['C', line2_from_x, res.y - lineWith * 2, line2_from_x + lineWith * 4, res.y, line2_from_x, res.y + lineWith * 2];
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
    if (this.chart.minXFromSymbols === undefined || this.chart.minXFromSymbols > left.x) {
      this.chart.minXFromSymbols = left.x;
    }
  }

  if (!this.chart.maxXFromLine || (this.chart.maxXFromLine && maxX > this.chart.maxXFromLine)) {
    this.chart.maxXFromLine = maxX;
  }
};

module.exports = Symbol;
