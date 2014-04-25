function Condition(chart, options) {
  options = options || {};
  Symbol.call(this, chart, options);

  this.yes_direction = 'bottom';
  this.no_direction = 'right';
  if (options.yes && options['direction_yes'] && options.no && !options['direction_no']) {
    if (options['direction_yes'] === 'right') {
      this.no_direction = 'bottom';
      this.yes_direction = 'right';
    } else {
      this.no_direction = 'right';
      this.yes_direction = 'bottom';
    }
  } else if (options.yes && !options['direction_yes'] && options.no && options['direction_no']) {
    if (options['direction_no'] === 'right') {
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
    x: (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']) * 2
  });

  var width = this.text.getBBox().width + 3 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']);
  width += width/2;
  var height = this.text.getBBox().height + 2 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']);
  height += height/2;
  height = Math.max(width * 0.5, height);
  var startX = width/4;
  var startY = height/4;

  this.text.attr({
    x: startX + (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin'])/2
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
    stroke: (this.chart.options.symbols[this.symbolType]['element-color'] || this.chart.options['element-color']),
    'stroke-width': (this.chart.options.symbols[this.symbolType]['line-width'] || this.chart.options['line-width']),
    fill: (this.chart.options.symbols[this.symbolType]['fill'] || this.chart.options['fill'])
  });
  if (options.link) { symbol.attr('href', options.link); }
  if (options.target) { symbol.attr('target', options.target); }
  if (options.key) { symbol.node.id = options.key; }

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

  var lineLength = this.chart.options.symbols[this.symbolType]['line-length'] || this.chart.options['line-length'];

  if (this.bottom_symbol) {
    var bottomPoint = this.getBottom();
    var topPoint = this.bottom_symbol.getTop();

    if (!this.bottom_symbol.isPositioned) {
      this.bottom_symbol.shiftY(this.getY() + this.height + lineLength);
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
      this.right_symbol.shiftX(this.group.getBBox().x + this.width + lineLength);

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
          self.right_symbol.setX(symb.getX() + symb.width + lineLength);
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