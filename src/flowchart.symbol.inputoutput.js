function InputOutput(chart, options) {
  options = options || {};
  Symbol.call(this, chart, options);

  this.text.attr({
    x: (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']) * 3
  });

  var width = this.text.getBBox().width + 4 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']);
  var height = this.text.getBBox().height + 2 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']);
  var startX = (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']);
  var startY = height/2;

  var start = {x: startX, y: startY};
  var points = [
    {x: startX - (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']), y: height},
    {x: startX - (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']) + width, y: height},
    {x: startX - (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']) + width + 2 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']), y: 0},
    {x: startX - (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']) + 2 * (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']), y: 0},
    {x: startX, y: startY}
  ];

  var symbol = drawPath(chart, start, points);

  symbol.attr({
    stroke: (this.chart.options.symbols[this.symbolType]['element-color'] || this.chart.options['element-color']),
    'stroke-width': (this.chart.options.symbols[this.symbolType]['line-width'] || this.chart.options['line-width']),
    fill: (this.chart.options.symbols[this.symbolType]['fill'] || this.chart.options['fill'])
  });
  if (options.link) { symbol.attr('href', options.link); }
  if (options.target) { symbol.attr('target', options.target); }

  this.text.attr({
    y: symbol.getBBox().height/2
  });

  this.group.push(symbol);
  symbol.insertBefore(this.text);

  this.initialize();
}
f.inherits(InputOutput, Symbol);

InputOutput.prototype.getLeft = function() {
  var y = this.getY() + this.group.getBBox().height/2;
  var x = this.getX() + (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']);
  return {x: x, y: y};
};

InputOutput.prototype.getRight = function() {
  var y = this.getY() + this.group.getBBox().height/2;
  var x = this.getX() + this.group.getBBox().width - (this.chart.options.symbols[this.symbolType]['text-margin'] || this.chart.options['text-margin']);
  return {x: x, y: y};
};