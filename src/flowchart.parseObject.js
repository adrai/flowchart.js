var FlowChart = require('./flowchart.chart');
var Start = require('./flowchart.symbol.start');
var End = require('./flowchart.symbol.end');
var Operation = require('./flowchart.symbol.operation');
var InputOutput = require('./flowchart.symbol.inputoutput');
var Subroutine = require('./flowchart.symbol.subroutine');
var Condition = require('./flowchart.symbol.condition');


function parseJson(symbolsArray, directionsArray) {


    var chart = {
        symbols: symbolsArray,
        start: null,
        drawSVG: function (container, options) {
            var self = this;

            if (this.diagram) {
                this.diagram.clean();
            }

            var diagram = new FlowChart(container, options);
            this.diagram = diagram;
            var dispSymbols = {};

            function getDisplaySymbol(s) {

                if (dispSymbols[s.key]) {
                    return dispSymbols[s.key];
                }

                switch (s.symbolType) {
                    case 'start':
                        dispSymbols[s.key] = new Start(diagram, s);
                        break;
                    case 'end':
                        dispSymbols[s.key] = new End(diagram, s);
                        break;
                    case 'operation':
                        dispSymbols[s.key] = new Operation(diagram, s);
                        break;
                    case 'inputoutput':
                        dispSymbols[s.key] = new InputOutput(diagram, s);
                        break;
                    case 'subroutine':
                        dispSymbols[s.key] = new Subroutine(diagram, s);
                        break;
                    case 'condition':
                        dispSymbols[s.key] = new Condition(diagram, s);
                        break;
                    default:
                        return new Error('Wrong symbol type!');
                }

                return dispSymbols[s.key];
            }

            (function constructChart(s, prevDisp, prev) {
                var dispSymb = getDisplaySymbol(s);

                if (self.start === s) {
                    diagram.startWith(dispSymb);
                } else if (prevDisp && prev && !prevDisp.pathOk) {
                    if (prevDisp instanceof (Condition)) {
                        if (prev.yes === s) {
                            prevDisp.yes(dispSymb);
                        }
                        if (prev.no === s) {
                            prevDisp.no(dispSymb);
                        }
                    } else {
                        prevDisp.then(dispSymb);
                    }
                }

                if (dispSymb.pathOk) {
                    return dispSymb;
                }

                if (dispSymb instanceof (Condition)) {
                    if (s.yes) {
                        constructChart(s.yes, dispSymb, s);
                    }
                    if (s.no) {
                        constructChart(s.no, dispSymb, s);
                    }
                } else if (s.next) {
                    constructChart(s.next, dispSymb, s);
                }

                return dispSymb;
            })(this.start);

            diagram.render();
        },
        clean: function () {
            this.diagram.clean();
        }
    };


    for (var key in directionsArray) {

        var direction = directionsArray[key];

        var symbol = symbolsArray[direction.key];
        var nextSymbol = symbolsArray[direction.nextKey];

        symbol[direction.next] = nextSymbol;
        symbol['direction_' + direction.next] = direction.direction;

        if (!chart.start) {
            chart.start = symbol;
        }

        // console.log(symbol.symbolType + " --> " + nextSymbol.symbolType);
        // console.log('direction_' + direction.next + " -->  " + symbol['direction_' + direction.next]);
        // console.log("\n");
    }

    return chart;
}

module.exports = parseJson;
