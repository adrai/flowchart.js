(function (root, factory) {
  if (typeof exports === 'object') {

    module.exports = factory();

  } else if (typeof define === 'function' && define.amd) {

    define([], factory);

  }
}(this, function () {

  //= flowchart.shim.js

  var root = this,
      flowchart = {};

  //= flowchart.defaults.js
  //= flowchart.helpers.js
  //= flowchart.functions.js
  //= flowchart.chart.js
  //= flowchart.symbol.js
  //= flowchart.symbol.start.js
  //= flowchart.symbol.end.js
  //= flowchart.symbol.operation.js
  //= flowchart.symbol.subroutine.js
  //= flowchart.symbol.inputoutput.js
  //= flowchart.symbol.condition.js
  //= flowchart.parse.js
  //= flowchart.api.js

  return flowchart;

}));