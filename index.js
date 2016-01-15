require('./src/flowchart.shim');
var parse = require('./src/flowchart.parse');
require('./src/jquery-plugin');

var FlowChart = {
	parse: parse
};

if (typeof window !== 'undefined') {
	window.flowchart = FlowChart;
}

module.exports = FlowChart;
