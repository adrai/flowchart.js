if (typeof jQuery != 'undefined') {
    (function($) {
        
        $.fn.flowChart = function(options) {
            options = options || {};

            var defaults = {
                'x': 0,
                'y': 0,
                'line-width': 2,
                'line-length': 50,
                'text-margin': 10,
                'font-size': 14,
                'font-color': 'black',
                'line-color': 'black',
                'element-color': 'black',
                'fill': 'white',
                'yes-text': 'yes',
                'no-text': 'no',
                'arrow-end': 'block',
                'symbols': {
                    'start': {
                        'font-color': 'red',
                        'element-color': 'green',
                        'fill': 'yellow'
                    },
                    'end':{
                        'class': 'end-element'
                    }
                },
                'flowstate' : {
                    'past' : { 'fill' : '#CCCCCC', 'font-size' : 12},
                    'current' : {'fill' : 'yellow', 'font-color' : 'red', 'font-weight' : 'bold'},
                    'future' : { 'fill' : '#FFFF99'},
                    'request' : { 'fill' : 'blue'},
                    'invalid': {'fill' : '#444444'},
                    'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
                    'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
                }
            };

            return this.each(function() {
                var $this    = $(this);
                var diagram  = flowchart.parse($this.text());
                var settings = $.extend(true, defaults, options);

                $this.html('');
                
                diagram.drawSVG(this, settings);
            });
        };
        
    })(jQuery);
}
