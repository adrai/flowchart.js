function Subroutine(chart, options) {
  var symbol = chart.paper.rect(0, 0, 0, 0);
  options = options || {};
  Symbol.call(this, chart, options, symbol);

  symbol.attr({
    width: this.text.getBBox().width + 4 * this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']
  });

  this.text.attr({
    'x': 2 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin'])
  });

  var innerWrap = chart.paper.rect(0, 0, 0, 0);
  innerWrap.attr({
    x: (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']),
    stroke: (this.chart.options.symbols[this.symbolType]['element-color'] || this.chart.options['element-color']),
    'stroke-width': (this.chart.options.symbols[this.symbolType]['line-width'] || this.chart.options['line-width']),
    width: this.text.getBBox().width + 2 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']),
    height: this.text.getBBox().height + 2 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']),
    fill: (this.chart.options.symbols[this.symbolType]['fill'] || this.chart.options['fill'])
  });
  if (options.link) { innerWrap.attr('href', options.link); }
  if (options.target) { innerWrap.attr('target', options.target); }
  this.group.push(innerWrap);
  innerWrap.insertBefore(this.text);

  this.initialize();
}
f.inherits(Subroutine, Symbol);