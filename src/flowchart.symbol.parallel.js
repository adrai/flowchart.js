var Symbol = require('./flowchart.symbol');
var inherits = require('./flowchart.helpers').inherits;

function Parallel(chart, options) {
  var symbol = chart.paper.rect(0, 0, 0, 0);
  options = options || {};
  Symbol.call(this, chart, options, symbol);
  this.textMargin = this.getAttr('text-margin');
  this.path1_direction = 'bottom';
  this.path2_direction = 'right';
  this.path3_direction = 'top';
  this.params = options.params;
  if (options.direction_next === 'path1' && !options[options.direction_next] && options.next) {
    options[options.direction_next] = options.next;
  }
  if (options.direction_next === 'path2' && !options[options.direction_next] && options.next) {
    options[options.direction_next] = options.next;
  }
  if (options.direction_next === 'path3' && !options[options.direction_next] && options.next) {
    options[options.direction_next] = options.next;
  }

  if (options.path1 && options.direction_path1 && options.path2 && !options.direction_path2 && options.path3 && !options.direction_path3) {
    if (options.direction_path1 === 'right') {
      this.path2_direction = 'bottom';
      this.path1_direction = 'right';
      this.path3_direction = 'top';
    } else if (options.direction_path1 === 'top') {
      this.path2_direction = 'right';
      this.path1_direction = 'top';
      this.path3_direction = 'bottom';
    } else if (options.direction_path1 === 'left') {
      this.path2_direction = 'right';
      this.path1_direction = 'left';
      this.path3_direction = 'bottom';
    } else {
      this.path2_direction = 'right';
      this.path1_direction = 'bottom';
      this.path3_direction = 'top';
    }
  } else if (options.path1 && !options.direction_path1 && options.path2 && options.direction_path2 && options.path3 && !options.direction_path3) {
    if (options.direction_path2 === 'right') {
      this.path1_direction = 'bottom';
      this.path2_direction = 'right';
      this.path3_direction = 'top';
    } else if (options.direction_path2 === 'left') {
      this.path1_direction = 'bottom';
      this.path2_direction = 'left';
      this.path3_direction = 'right';
    } else {
      this.path1_direction = 'right';
      this.path2_direction = 'bottom';
      this.path3_direction = 'top';
    }
  } else if (options.path1 && !options.direction_path1 && options.path2 && !options.direction_path2 && options.path3 && options.direction_path3) {
    if (options.direction_path2 === 'right') {
      this.path1_direction = 'bottom';
      this.path2_direction = 'top';
      this.path3_direction = 'right';
    } else if (options.direction_path2 === 'left') {
      this.path1_direction = 'bottom';
      this.path2_direction = 'right';
      this.path3_direction = 'left';
    } else {
      this.path1_direction = 'right';
      this.path2_direction = 'bottom';
      this.path3_direction = 'top';
    }
  } else {
    this.path1_direction = options.direction_path1;
    this.path2_direction = options.direction_path2;
    this.path3_direction = options.direction_path3;
  }

  this.path1_direction = this.path1_direction || 'bottom';
  this.path2_direction = this.path2_direction || 'right';
  this.path3_direction = this.path3_direction || 'top';

  this.initialize();
}
inherits(Parallel, Symbol);

Parallel.prototype.render = function() {

  if (this.path1_direction) {
    this[this.path1_direction + '_symbol'] = this.path1_symbol;
  }

  if (this.path2_direction) {
    this[this.path2_direction + '_symbol'] = this.path2_symbol;
  }

  if (this.path3_direction) {
    this[this.path3_direction + '_symbol'] = this.path3_symbol;
  }

  var lineLength = this.getAttr('line-length');

  if (this.bottom_symbol) {
    var bottomPoint = this.getBottom();

    if (!this.bottom_symbol.isPositioned) {
      this.bottom_symbol.shiftY(this.getY() + this.height + lineLength);
      this.bottom_symbol.setX(bottomPoint.x - this.bottom_symbol.width / 2);
      this.bottom_symbol.isPositioned = true;

      this.bottom_symbol.render();
    }
  }

  if (this.top_symbol) {
    var topPoint = this.getTop();

    if (!this.top_symbol.isPositioned) {
      this.top_symbol.shiftY(this.getY() - this.top_symbol.height - lineLength);
      this.top_symbol.setX(topPoint.x + this.top_symbol.width);
      this.top_symbol.isPositioned = true;

      this.top_symbol.render();
    }
  }

  var self = this;

  if (this.left_symbol) {
    var leftPoint = this.getLeft();

    if (!this.left_symbol.isPositioned) {
      this.left_symbol.setY(leftPoint.y - this.left_symbol.height / 2);
      this.left_symbol.shiftX(-(this.group.getBBox().x + this.width + lineLength));
      (function shift() {
        var hasSymbolUnder = false;
        var symb;
        for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
          symb = self.chart.symbols[i];

          if (!self.params['align-next'] || self.params['align-next'] !== 'no') {
            var diff = Math.abs(symb.getCenter().x - self.left_symbol.getCenter().x);
            if (symb.getCenter().y > self.left_symbol.getCenter().y && diff <= self.left_symbol.width / 2) {
              hasSymbolUnder = true;
              break;
            }
          }
        }

        if (hasSymbolUnder) {
          if (self.left_symbol.symbolType === 'end') return;
          self.left_symbol.setX(symb.getX() + symb.width + lineLength);
          shift();
        }
      })();

      this.left_symbol.isPositioned = true;

      this.left_symbol.render();
    }
  }

  if (this.right_symbol) {
    var rightPoint = this.getRight();

    if (!this.right_symbol.isPositioned) {
      this.right_symbol.setY(rightPoint.y - this.right_symbol.height / 2);
      this.right_symbol.shiftX(this.group.getBBox().x + this.width + lineLength);
      (function shift() {
        var hasSymbolUnder = false;
        var symb;
        for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
          symb = self.chart.symbols[i];

          if (!self.params['align-next'] || self.params['align-next'] !== 'no') {
            var diff = Math.abs(symb.getCenter().x - self.right_symbol.getCenter().x);
            if (symb.getCenter().y > self.right_symbol.getCenter().y && diff <= self.right_symbol.width / 2) {
              hasSymbolUnder = true;
              break;
            }
          }
        }

        if (hasSymbolUnder) {
          if (self.right_symbol.symbolType === 'end') return;
          self.right_symbol.setX(symb.getX() + symb.width + lineLength);
          shift();
        }
      })();

      this.right_symbol.isPositioned = true;

      this.right_symbol.render();
    }
  }
};

Parallel.prototype.renderLines = function() {
  if (this.path1_symbol) {
    this.drawLineTo(this.path1_symbol, '', this.path1_direction);
  }

  if (this.path2_symbol) {
    this.drawLineTo(this.path2_symbol, '', this.path2_direction);
  }

  if (this.path3_symbol) {
    this.drawLineTo(this.path3_symbol, '', this.path3_direction);
  }
};

module.exports = Parallel;