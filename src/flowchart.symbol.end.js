function End(chart, options) {
  var symbol = chart.paper.rect(0, 0, 0, 0, 20);
  options = options || {};
  options.text = options.text || 'End';
  Symbol.call(this, chart, options, symbol);
}
f.inherits(End, Symbol);