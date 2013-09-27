function Condition(chart, options) {
  options = options || {};
  Symbol.call(this, chart, options);

  if (options.yes.direction && !options.no.direction) {
    if (options.yes.direction === 'right') {
      options.no.direction = 'bottom';
    } else {
      options.no.direction = 'right';
    }
  } else if (!options.yes.direction && options.no.direction) {
    if (options.no.direction === 'right') {
      options.yes.direction = 'bottom';
    } else {
      options.yes.direction = 'right';
    }
  } else {
    options.yes.direction = 'bottom';
    options.no.direction = 'right';
  }

  this.options = options;

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

  this[this.options.yes.direction + '_symbol'] = this.yes_symbol;
  this[this.options.no.direction + '_symbol'] = this.no_symbol;

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
    this.drawLineTo(this.yes_symbol, this.chart.options['yes-text'], this.options.yes.direction);
  }

  if (this.no_symbol) {
    this.drawLineTo(this.no_symbol, this.chart.options['no-text'], this.options.no.direction);
  }
};