function Subroutine(chart, text) {
  var symbol = chart.paper.rect(0, 0, 0, 0);
  Symbol.call(this, chart, { text: text }, symbol);

  symbol.attr({
    width: this.text.getBBox().width + 4 * chart.options['text-margin']
  });

  this.text.attr({
    'x': 2 * chart.options['text-margin']
  });

  var innerWrap = chart.paper.rect(0, 0, 0, 0);
  innerWrap.attr({
    x: chart.options['text-margin'],
    stroke: chart.options['element-color'],
    'stroke-width': chart.options['line-width'],
    width: this.text.getBBox().width + 2 * chart.options['text-margin'],
    height: this.text.getBBox().height + 2 * chart.options['text-margin']
  });
  this.group.push(innerWrap);

  this.initialize();
}
f.inherits(Subroutine, Symbol);