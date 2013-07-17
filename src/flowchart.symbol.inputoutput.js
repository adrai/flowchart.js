function InputOutput(chart, options) {
  options = options || {};
  Symbol.call(this, chart, options);

  this.text.attr({
    x: chart.options['text-margin'] * 3
  });

  var width = this.text.getBBox().width + 4 * chart.options['text-margin'];
  var height = this.text.getBBox().height + 2 * chart.options['text-margin'];
  var startX = chart.options['text-margin'];
  var startY = height/2;

  var start = {x: startX, y: startY};
  var points = [
    {x: startX - chart.options['text-margin'], y: height},
    {x: startX - chart.options['text-margin'] + width, y: height},
    {x: startX - chart.options['text-margin'] + width + 2 * chart.options['text-margin'], y: 0},
    {x: startX - chart.options['text-margin'] + 2 * chart.options['text-margin'], y: 0},
    {x: startX, y: startY}
  ];

  var symbol = drawPath(chart, start, points);

  symbol.attr({
    stroke: chart.options['element-color'],
    'stroke-width': chart.options['line-width'],
    fill: chart.options['fill']
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
  var x = this.getX() + this.chart.options['text-margin'];
  return {x: x, y: y};
};

InputOutput.prototype.getRight = function() {
  var y = this.getY() + this.group.getBBox().height/2;
  var x = this.getX() + this.group.getBBox().width - this.chart.options['text-margin'];
  return {x: x, y: y};
};