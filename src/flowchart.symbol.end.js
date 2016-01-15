var Symbol = require('./flowchart.symbol');
var inherits = require('./flowchart.helpers').inherits;

function End(chart, options) {
  var symbol = chart.paper.rect(0, 0, 0, 0, 20);
  options = options || {};
  options.text = options.text || 'End';
  Symbol.call(this, chart, options, symbol);
}
inherits(End, Symbol);

module.exports = End;
