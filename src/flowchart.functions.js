function drawPath(chart, location, points) {
  var path = 'M{0},{1}';
  for (var i = 2, len = 2 * points.length + 2; i < len; i+=2) {
    path += ' L{' + i + '},{' + (i + 1) + '}';
  }
  var pathValues = [location.x, location.y];
  for (var j = 0, len = points.length; j < len; j++) {
    pathValues.push(points[j].x);
    pathValues.push(points[j].y);
  }
  var symbol = chart.paper.path(path, pathValues);
  symbol.attr('stroke', chart.options['element-color']);
  symbol.attr('stroke-width', chart.options['line-width']);
  return symbol;
}

function drawLine(chart, from, to, text) {
  if (Object.prototype.toString.call(to) !== '[object Array]') {
    to = [to];
  }

  var path = 'M{0},{1}';
  for (var i = 2, len = 2 * to.length + 2; i < len; i+=2) {
    path += ' L{' + i + '},{' + (i + 1) + '}';
  }
  var pathValues = [from.x, from.y];
  for (var j = 0, len = to.length; j < len; j++) {
    pathValues.push(to[j].x);
    pathValues.push(to[j].y);
  }

  var line = chart.paper.path(path, pathValues);
  line.attr({
    stroke: chart.options['line-color'],
    'stroke-width': chart.options['line-width'],
    'arrow-end': 'block'
  });

  if (text) {
    var textPath = chart.paper.text(0, 0, text);

    var isHorizontal = false;
    var firstTo = to[0];

    if (from.y === firstTo.y) {
      isHorizontal = true;
    }

    var x = 0;
    if (from.x > firstTo.x) {
      x = from.x - (from.x - firstTo.x)/2;
    } else {
      x = firstTo.x - (firstTo.x - from.x)/2;
    }

    var y = 0;
    if (from.y > firstTo.y) {
      y = from.y - (from.y - firstTo.y)/2;
    } else {
      y = firstTo.y - (firstTo.y - from.y)/2;
    }

    if (isHorizontal) {
      x -= textPath.getBBox().width/2;
      y -= chart.options['text-margin'];
    } else {
      x += chart.options['text-margin'];
      y -= textPath.getBBox().height/2;
    }

    textPath.attr({
      'text-anchor': 'start',
      'font-size': chart.options['font-size'],
      stroke: chart.options['font-color'],
      x: x,
      y: y
    });

    return line;
  }
}