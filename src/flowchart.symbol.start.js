var Symbol = require('./flowchart.symbol');
var inherits = require('./flowchart.helpers').inherits;

function Start(chart, options) {
  var symbol = chart.paper.rect(0, 0, 0, 0, 20);
  options = options || {};
  options.text = options.text || 'Start';
  Symbol.call(this, chart, options, symbol);
}
inherits(Start, Symbol);

module.exports = Start;

// Start.prototype.render = function() {
//   if (this.next) {
//     var lineLength = this.chart.options.symbols[this.symbolType]['line-length'] || this.chart.options['line-length'];

//     var bottomPoint = this.getBottom();
//     var topPoint = this.next.getTop();

//     if (!this.next.isPositioned) {
//       this.next.shiftY(this.getY() + this.height + lineLength);
//       this.next.setX(bottomPoint.x - this.next.width/2);
//       this.next.isPositioned = true;

//       this.next.render();
//     }
//   }
// };

// Start.prototype.renderLines = function() {
//   if (this.next) {
//     this.drawLineTo(this.next);
//   }
// };
