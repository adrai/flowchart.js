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