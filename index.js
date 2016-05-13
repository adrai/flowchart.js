require('./src/flowchart.shim');
var parse = require('./src/flowchart.parse');
var parseObject = require('./src/flowchart.parseObject');
require('./src/jquery-plugin');

var FlowChart = {
	parse: parse,
	parseObject: parseObject
};

if (typeof window !== 'undefined') {
	window.flowchart = FlowChart;
}

module.exports = FlowChart;
