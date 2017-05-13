[![JS.ORG](https://img.shields.io/badge/js.org-flowchart-ffb400.svg?style=flat-square)](http://js.org)

# flowchart.js

## Example

[example](https://github.com/adrai/flowchart.js/blob/master/example/index.html)

## Requirements
You will need [Raphaël](http://www.raphaeljs.com/)

## CDN
flowchart.js is on [CDNJS](https://cdnjs.com/libraries/flowchart), feel free to use it

## Usage

On your page you need to include raphael like so:

```html
<script src="raphael-min.js"></script>
```

or

```node.js
npm install flowchart.js
```

and then

```html
<div id="diagram">Diagram will be placed here</div>
<script src="flowchart.js"></script>
<script>
  var diagram = flowchart.parse('st=>start: Start:>http://www.google.com[blank]\n' +
                                'e=>end:>http://www.google.com\n' +
                                'op1=>operation: My Operation\n' +
                                'sub1=>subroutine: My Subroutine\n' +
                                'cond=>condition: Yes \n' +
                                'or No?\n:>http://www.google.com' +
                                'io=>inputoutput|request: catch something...\n' +
                                '' +
                                'st->op1->cond\n' +
                                'cond(yes)->io->e\n' + // conditions can also be redirected like cond(yes, bottom) or cond(yes, right)
                                'cond(no)->sub1(right)->op1');// the other symbols too...
  diagram.drawSVG('diagram');

  // you can also try to pass options:

  diagram.drawSVG('diagram', {
                                'x': 0,
                                'y': 0,
                                'line-width': 3,
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
                                'scale': 1,
                                // style symbol types
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
                                // even flowstate support ;-)
                                'flowstate' : {
                                    // 'past' : { 'fill' : '#CCCCCC', 'font-size' : 12},
                                    // 'current' : {'fill' : 'yellow', 'font-color' : 'red', 'font-weight' : 'bold'},
                                    // 'future' : { 'fill' : '#FFFF99'},
                                    'request' : { 'fill' : 'blue'}//,
                                    // 'invalid': {'fill' : '#444444'},
                                    // 'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
                                    // 'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
                                  }
                              });
</script>
```

## Advice
Symbols that should possibly not be used in the text: '=>' and '->' and ':>' and '|'

## Contributors

via [GitHub](https://github.com/adrai/flowchart.js/graphs/contributors)

## Thanks

Many thanks to [js-sequence-diagrams](http://bramp.github.io/js-sequence-diagrams/) which greatly inspired this project, and forms the basis for the syntax.

## Licence

Copyright (c) 2017 Adriano Raiano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
