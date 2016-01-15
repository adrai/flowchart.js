if (typeof jQuery != 'undefined') {
	var parse = require('./flowchart.parse');
	(function( $ ) {
		$.fn.flowChart = function( options ) {
			return this.each(function() {
				var $this = $(this);
				var chart = parse($this.text());
				$this.html('');
				chart.drawSVG(this, options);
			});
		};
	})(jQuery); // eslint-disable-line
}
