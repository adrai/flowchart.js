var Symbol = require('./flowchart.symbol');
var inherits = require('./flowchart.helpers').inherits;
var drawAPI = require('./flowchart.functions');
var drawPath = drawAPI.drawPath;

function InputOutput(chart, options) {
  options = options || {};
  Symbol.call(this, chart, options);
  this.textMargin = this.getAttr('text-margin');

  this.text.attr({
    x: this.textMargin * 3
  });

  var width = this.text.getBBox().width + 4 * this.textMargin;
  var height = this.text.getBBox().height + 2 * this.textMargin;
  var startX = this.textMargin;
  var startY = height/2;

  var start = {x: startX, y: startY};
  var points = [
    {x: startX - this.textMargin, y: height},
    {x: startX - this.textMargin + width, y: height},
    {x: startX - this.textMargin + width + 2 * this.textMargin, y: 0},
    {x: startX - this.textMargin + 2 * this.textMargin, y: 0},
    {x: startX, y: startY}
  ];

  var symbol = drawPath(chart, start, points);

  symbol.attr({
    stroke: this.getAttr('element-color'),
    'stroke-width': this.getAttr('line-width'),
    fill: this.getAttr('fill')
  });
  if (options.link) { symbol.attr('href', options.link); }
  if (options.target) { symbol.attr('target', options.target); }
  if (options.key) { symbol.node.id = options.key; }
  symbol.node.setAttribute('class', this.getAttr('class'));

  this.text.attr({
    y: symbol.getBBox().height/2
  });

  this.group.push(symbol);
  symbol.insertBefore(this.text);
  this.symbol = symbol

  this.initialize();
}
inherits(InputOutput, Symbol);

InputOutput.prototype.getLeft = function() {
  var y = this.getY() + this.group.getBBox().height/2;
  var x = this.getX() + this.textMargin;
  return {x: x, y: y};
};

InputOutput.prototype.getRight = function() {
  var y = this.getY() + this.group.getBBox().height/2;
  var x = this.getX() + this.group.getBBox().width - this.textMargin;
  return {x: x, y: y};
};

module.exports = InputOutput;
