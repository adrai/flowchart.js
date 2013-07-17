function Start(chart, options) {
  var symbol = chart.paper.rect(0, 0, 0, 0, 20);
  options = options || {};
  options.text = options.text || 'Start';
  Symbol.call(this, chart, options, symbol);
}
f.inherits(Start, Symbol);