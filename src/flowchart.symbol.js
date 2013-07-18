function Symbol(chart, options, symbol) {
  this.chart = chart;
  this.group = this.chart.paper.set();
  
  this.text = this.chart.paper.text(0, 0, options.text);
  this.text.attr({
    'text-anchor': 'start',
    'font-size': this.chart.options['font-size'],
    'x': this.chart.options['text-margin'],
    stroke: chart.options['font-color']
  });
  if (options.link) { this.text.attr('href', options.link); }
  if (options.target) { this.text.attr('target', options.target) };
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
    }
  }
};

Symbol.prototype.renderLines = function() {
  if (this.next) {
    this.drawLineTo(this.next);
  }
};

Symbol.prototype.drawLineTo = function(symbol, text, origin) {
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
      {x: right.x + this.chart.options['line-length']/2, y: symbolRight.y},
      {x: symbolRight.x, y: symbolRight.y}
    ], text);
    this.rightStart = true;
    symbol.rightEnd = true;
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

  // if (line) {
  //   var self = this;
  //   this.chart.paper.forEach(function (e) {
  //     if (e.type === 'path') {
  //       var intersections = Raphael.pathIntersection(e.attr('path'), line.attr('path'));
  //       console.log(intersections);
  //       for (var i = 0, len = intersections.length; i < len; i++) {
  //         var inter =intersections[i];
  //         var c = self.chart.paper.circle(inter.x, inter.y, 3);
  //         c.attr('fill', 'red');
  //       }
  //     }
  //   });
  // }

  if (!this.chart.maxXFromLine || (this.chart.maxXFromLine && maxX > this.chart.maxXFromLine)) {
    this.chart.maxXFromLine = maxX;
  }
};