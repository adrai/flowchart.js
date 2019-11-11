if (typeof jQuery != 'undefined') {
	var parse = require('./flowchart.parse');

	(function( $ ) {
		function paramFit(needle, haystack) {
			return needle == haystack ||
			( Array.isArray(haystack) && (haystack.includes(needle) || haystack.includes(Number(needle)) ))
		}
		var methods = {
			init : function(options) {
				return this.each(function() {
					var $this = $(this);
					this.chart = parse($this.text());
					$this.html('');
					this.chart.drawSVG(this, options);
				});
			},
			setFlowStateByParam : function(param, paramValue, newFlowState) {
				return this.each(function() {
					var chart = this.chart;

					// @todo this should be part of Symbol API
					var nextSymbolKeys = ['next', 'yes', 'no', 'path1', 'path2', 'path3'];

					for (var property in chart.symbols) {
						if (chart.symbols.hasOwnProperty(property)) {
							var symbol = chart.symbols[property];
							var val = symbol.params[param];
							if (paramFit(val, paramValue)) {
								symbol.flowstate = newFlowState;
								for (var nski = 0; nski < nextSymbolKeys.length; nski++) {
									var nextSymbolKey = nextSymbolKeys[nski];
									if (
										symbol[nextSymbolKey] &&
										symbol[nextSymbolKey]['params'] &&
										symbol[nextSymbolKey]['params'][param] &&
										paramFit(symbol[nextSymbolKey]['params'][param], paramValue)
									) {
										symbol.lineStyle[symbol[nextSymbolKey]['key']] = {stroke: chart.options()['flowstate'][newFlowState]['fill']};
									}
								}
							}
						}
					}

					chart.clean();
					chart.drawSVG(this);
				});

			},
			clearFlowState: function () {
				return this.each(function() {
					var chart = this.chart;

					for (var property in chart.symbols) {
						if (chart.symbols.hasOwnProperty(property)) {
							var node = chart.symbols[property];
							node.flowstate = '';
						}
					}

					chart.clean();
					chart.drawSVG(this);
				});
			}
		};

		$.fn.flowChart = function(methodOrOptions) {
			if ( methods[methodOrOptions] ) {
				return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
				// Default to "init"
				return methods.init.apply( this, arguments );
			} else {
				$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.flowChart' );
			}
		};

	})(jQuery); // eslint-disable-line
}
