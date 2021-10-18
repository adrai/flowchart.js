var FlowChart = require('./flowchart.chart');
var Start = require('./flowchart.symbol.start');
var End = require('./flowchart.symbol.end');
var Operation = require('./flowchart.symbol.operation');
var InputOutput = require('./flowchart.symbol.inputoutput');
var Subroutine = require('./flowchart.symbol.subroutine');
var Condition = require('./flowchart.symbol.condition');
var Parallel = require('./flowchart.symbol.parallel');

function parse(input) {
  input = input || '';
  input = input.trim();

  var chart = {
    symbols: {},
    start: null,
    drawSVG: function(container, options) {
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
          case 'parallel':
            dispSymbols[s.key] = new Parallel(diagram, s);
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
          if (prevDisp instanceof(Condition)) {
            if (prev.yes === s) {
              prevDisp.yes(dispSymb);
            }
            if (prev.no === s) {
              prevDisp.no(dispSymb);
            }
          } else if (prevDisp instanceof(Parallel)) {
            if (prev.path1 === s) {
              prevDisp.path1(dispSymb);
            }
            if (prev.path2 === s) {
              prevDisp.path2(dispSymb);
            }
            if (prev.path3 === s) {
              prevDisp.path3(dispSymb);
            }
          } else {
            prevDisp.then(dispSymb);
          }
        }

        if (dispSymb.pathOk) {
          return dispSymb;
        }

        if (dispSymb instanceof(Condition)) {
          if (s.yes) {
            constructChart(s.yes, dispSymb, s);
          }
          if (s.no) {
            constructChart(s.no, dispSymb, s);
          }
        } else if (dispSymb instanceof(Parallel)) {
          if (s.path1) {
            constructChart(s.path1, dispSymb, s);
          }
          if (s.path2) {
            constructChart(s.path2, dispSymb, s);
          }
          if (s.path3) {
            constructChart(s.path3, dispSymb, s);
          }
        } else if (s.next) {
          constructChart(s.next, dispSymb, s);
        }

        return dispSymb;
      })(this.start);

      diagram.render();
    },
    clean: function() {
      this.diagram.clean();
    },
    options: function() {
      return this.diagram.options;
    }
  };

  var lines = [];
  var prevBreak = 0;
  for (var i0 = 1, i0len = input.length; i0 < i0len; i0++) {
    if(input[i0] === '\n' && input[i0 - 1] !== '\\') {
      var line0 = input.substring(prevBreak, i0);
      prevBreak = i0 + 1;
      lines.push(line0.replace(/\\\n/g, '\n'));
    }
  }

  if (prevBreak < input.length) {
    lines.push(input.substr(prevBreak));
  }

  for (var l = 1, len = lines.length; l < len;) {
    var currentLine = lines[l];

    if (currentLine.indexOf('->') < 0 && currentLine.indexOf('=>') < 0 && currentLine.indexOf('@>') < 0) {
      lines[l - 1] += '\n' + currentLine;
      lines.splice(l, 1);
      len--;
    } else {
      l++;
    }
  }

  function getStyle(s){
    var startIndex = s.indexOf('(') + 1;
    var endIndex = s.indexOf(')');
    if (startIndex >= 0 && endIndex >= 0) {
      return s.substring(startIndex,endIndex);
    }
    return '{}';
  }

  function getSymbValue(s){
    var startIndex = s.indexOf('(') + 1;
    var endIndex = s.indexOf(')');
    if (startIndex >= 0 && endIndex >= 0) {
      return s.substring(startIndex,endIndex);
    }
    return '';
  }

  function getSymbol(s) {
    var startIndex = s.indexOf('(') + 1;
    var endIndex = s.indexOf(')');
    if (startIndex >= 0 && endIndex >= 0) {
      return chart.symbols[s.substring(0, startIndex - 1)];
    }
    return chart.symbols[s];
  }

  function getNextPath(s) {
    var next = 'next';
    var startIndex = s.indexOf('(') + 1;
    var endIndex = s.indexOf(')');
    if (startIndex >= 0 && endIndex >= 0) {
      next = flowSymb.substring(startIndex, endIndex);
      if (next.indexOf(',') < 0) {
        if (next !== 'yes' && next !== 'no') {
          next = 'next, ' + next;
        }
      }
    }
    return next;
  }
  
  function getAnnotation(s) {
	var startIndex = s.indexOf("(") + 1, endIndex = s.indexOf(")");
	var tmp = s.substring(startIndex, endIndex);
	if(tmp.indexOf(",") > 0) { tmp = tmp.substring(0, tmp.indexOf(",")); }
	var tmp_split = tmp.split("@");
	if(tmp_split.length > 1)
		return startIndex >= 0 && endIndex >= 0 ? tmp_split[1] : "";
  }

  while (lines.length > 0) {
    var line = lines.splice(0, 1)[0].trim();

    if (line.indexOf('=>') >= 0) {
      // definition
      var parts = line.split('=>');
      var symbol = {
        key: parts[0].replace(/\(.*\)/, ''),
        symbolType: parts[1],
        text: null,
        link: null,
        target: null,
        flowstate: null,
        function: null,
        lineStyle: {},
        params: {}
      };

      //parse parameters
      var params = parts[0].match(/\((.*)\)/);
      if (params && params.length > 1){
        var entries = params[1].split(',');
        for(var i = 0; i < entries.length; i++) {
          var entry = entries[i].split('=');
          if (entry.length == 2) {
            symbol.params[entry[0]] = entry[1];
          }
        }
      }

      var sub;

      if (symbol.symbolType.indexOf(': ') >= 0) {
        sub = symbol.symbolType.split(': ');
        symbol.symbolType = sub.shift();
        symbol.text = sub.join(': ');
      }

      if (symbol.text && symbol.text.indexOf(':$') >= 0) {
        sub = symbol.text.split(':$');
        symbol.text = sub.shift();
        symbol.function = sub.join(':$');
      } else if (symbol.symbolType.indexOf(':$') >= 0) {
        sub = symbol.symbolType.split(':$');
        symbol.symbolType = sub.shift();
        symbol.function = sub.join(':$');
      } else if (symbol.text && symbol.text.indexOf(':>') >= 0) {
        sub = symbol.text.split(':>');
        symbol.text = sub.shift();
        symbol.link = sub.join(':>');
      } else if (symbol.symbolType.indexOf(':>') >= 0) {
        sub = symbol.symbolType.split(':>');
        symbol.symbolType = sub.shift();
        symbol.link = sub.join(':>');
      }

      if (symbol.symbolType.indexOf('\n') >= 0) {
        symbol.symbolType = symbol.symbolType.split('\n')[0];
      }

      /* adding support for links */
      if (symbol.link) {
        var startIndex = symbol.link.indexOf('[') + 1;
        var endIndex = symbol.link.indexOf(']');
        if (startIndex >= 0 && endIndex >= 0) {
          symbol.target = symbol.link.substring(startIndex, endIndex);
          symbol.link = symbol.link.substring(0, startIndex - 1);
        }
      }
      /* end of link support */

      /* adding support for flowstates */
      if (symbol.text) {
        if (symbol.text.indexOf('|') >= 0) {
          var txtAndState = symbol.text.split('|');
          symbol.flowstate = txtAndState.pop().trim();
          symbol.text = txtAndState.join('|');
        }
      }
      /* end of flowstate support */

      chart.symbols[symbol.key] = symbol;

    } else if (line.indexOf('->') >= 0) {
      var ann = getAnnotation(line);
      if (ann) {
        line = line.replace('@' + ann, ''); 
      }
      // flow
      var flowSymbols = line.split('->');
      for (var iS = 0, lenS = flowSymbols.length; iS < lenS; iS++) {
        var flowSymb = flowSymbols[iS];
        var symbVal = getSymbValue(flowSymb);

        if (symbVal === 'true' || symbVal === 'false') {
          // map true or false to yes or no respectively
          flowSymb = flowSymb.replace('true', 'yes');
          flowSymb = flowSymb.replace('false', 'no');
        }
        
        var next = getNextPath(flowSymb);
        var realSymb = getSymbol(flowSymb);

        var direction = null;
        if (next.indexOf(',') >= 0) {
          var condOpt = next.split(',');
          next = condOpt[0];
          direction = condOpt[1].trim();
        }

        if (ann) {
          if (realSymb.symbolType === 'condition') {
            if (next === "yes" || next === "true") {
              realSymb.yes_annotation = ann;
            } else {
              realSymb.no_annotation = ann;
            }
          } else if (realSymb.symbolType === 'parallel') {
            if (next === 'path1') {
              realSymb.path1_annotation = ann;
            } else if (next === 'path2') {
              realSymb.path2_annotation = ann;
            } else if (next === 'path3') {
              realSymb.path3_annotation = ann;
            }
          }
          ann = null;
        }

        if (!chart.start) {
          chart.start = realSymb;
        }

        if (iS + 1 < lenS) {
          var nextSymb = flowSymbols[iS + 1];
          realSymb[next] = getSymbol(nextSymb);
          realSymb['direction_' + next] = direction;
          direction = null;
        }
      }
    } else if (line.indexOf('@>') >= 0) {

      // line style
      var lineStyleSymbols = line.split('@>');
      for (var iSS = 0, lenSS = lineStyleSymbols.length; iSS < lenSS; iSS++) {
        if ((iSS + 1) !== lenSS) {
          var curSymb = getSymbol(lineStyleSymbols[iSS]);
          var nextSymbol = getSymbol(lineStyleSymbols[iSS+1]);

          curSymb['lineStyle'][nextSymbol.key] = JSON.parse(getStyle(lineStyleSymbols[iSS + 1]));
        }
      }
    }

  }
  return chart;
}

module.exports = parse;
