function Operation(chart, text) {
  var symbol = chart.paper.rect(0, 0, 0, 0);
  Symbol.call(this, chart, { text: text }, symbol);
}
f.inherits(Operation, Symbol);