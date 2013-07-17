function End(chart, text) {
  var symbol = chart.paper.rect(0, 0, 0, 0, 20);
  Symbol.call(this, chart, { text: text || 'End' }, symbol);
}
f.inherits(End, Symbol);