function drawPath(chart, location, points) {
  var i, len;
  var path = 'M{0},{1}';
  for (i = 2, len = 2 * points.length + 2; i < len; i+=2) {
    path += ' L{' + i + '},{' + (i + 1) + '}';
  }
  var pathValues = [location.x, location.y];
  for (i = 0, len = points.length; i < len; i++) {
    pathValues.push(points[i].x);
    pathValues.push(points[i].y);
  }
  var symbol = chart.paper.path(path, pathValues);
  symbol.attr('stroke', chart.options['element-color']);
  symbol.attr('stroke-width', chart.options['line-width']);

  var font = chart.options.font;
  var fontF = chart.options['font-family'];
  var fontW = chart.options['font-weight'];

  if (font) symbol.attr({ 'font': font });
  if (fontF) symbol.attr({ 'font-family': fontF });
  if (fontW) symbol.attr({ 'font-weight': fontW });

  return symbol;
}

function drawLine(chart, from, to, text) {
  var i, len;

  if (Object.prototype.toString.call(to) !== '[object Array]') {
    to = [to];
  }

  var path = 'M{0},{1}';
  for (i = 2, len = 2 * to.length + 2; i < len; i+=2) {
    path += ' L{' + i + '},{' + (i + 1) + '}';
  }
  var pathValues = [from.x, from.y];
  for (i = 0, len = to.length; i < len; i++) {
    pathValues.push(to[i].x);
    pathValues.push(to[i].y);
  }

  var line = chart.paper.path(path, pathValues);
  line.attr({
    stroke: chart.options['line-color'],
    'stroke-width': chart.options['line-width'],
    'arrow-end': chart.options['arrow-end']
  });

  var font = chart.options.font;
  var fontF = chart.options['font-family'];
  var fontW = chart.options['font-weight'];

  if (font) line.attr({ 'font': font });
  if (fontF) line.attr({ 'font-family': fontF });
  if (fontW) line.attr({ 'font-weight': fontW });

  if (text) {

    var centerText = false;

    var textPath = chart.paper.text(0, 0, text);
    var textAnchor = 'start';

    var isHorizontal = false;
    var firstTo = to[0];

    if (from.y === firstTo.y) {
      isHorizontal = true;
    }

    var x = 0,
        y = 0;

    if (centerText) {
      if (from.x > firstTo.x) {
        x = from.x - (from.x - firstTo.x)/2;
      } else {
        x = firstTo.x - (firstTo.x - from.x)/2;
      }

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
    } else {
      x = from.x;
      y = from.y;

      if (isHorizontal) {
        if (from.x > firstTo.x) {
          x -= chart.options['text-margin']/2;
          textAnchor = 'end';
        } else {
          x += chart.options['text-margin']/2;
        }
        y -= chart.options['text-margin'];
      } else {
        x += chart.options['text-margin']/2;
        y += chart.options['text-margin'];
        if (from.y > firstTo.y) {
          y -= chart.options['text-margin']*2;
        }
      }
    }

    textPath.attr({
      'text-anchor': textAnchor,
      'font-size': chart.options['font-size'],
      'fill': chart.options['font-color'],
      x: x,
      y: y
    });

    if (font) textPath.attr({ 'font': font });
    if (fontF) textPath.attr({ 'font-family': fontF });
    if (fontW) textPath.attr({ 'font-weight': fontW });
  }

  return line;
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  var denominator, a, b, numerator1, numerator2, result = {
    x: null,
    y: null,
    onLine1: false,
    onLine2: false
  };
  denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
  if (denominator === 0) {
    return result;
  }
  a = line1StartY - line2StartY;
  b = line1StartX - line2StartX;
  numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
  numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = line1StartX + (a * (line1EndX - line1StartX));
  result.y = line1StartY + (a * (line1EndY - line1StartY));
  /*
  // it is worth noting that this should be the same as:
  x = line2StartX + (b * (line2EndX - line2StartX));
  y = line2StartX + (b * (line2EndY - line2StartY));
  */
  // if line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }
  // if line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }
  // if line1 and line2 are segments, they intersect if both of the above are true
  return result;
}

module.exports = {
	drawPath: drawPath,
	drawLine: drawLine,
	checkLineIntersection: checkLineIntersection
};
