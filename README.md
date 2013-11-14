#Example

[example](https://github.com/adrai/flowchart.js/blob/master/example/index.html)

#Requirements
You will need [Raphaël](http://raphaeljs.com/)

#Usage

On your page you need to include raphael like so:

```html
<script src="raphael-min.js"></script>
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
                                'io=>inputoutput: catch something...\n' + 
                                '' +
                                'st->op1->cond\n' + 
                                'cond(yes)->io->e\n' + // conditions can also be redirected like cond(yes, bottom) or cond(yes, right)
                                'cond(no)->sub1->op1');
  diagram.drawSVG('diagram');

  // you can also try to pass options:
  
  diagram.drawSVG('diagram', {
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
                                'arrow-end': 'block'
                              });
</script>
```


#Contributors

via [GitHub](https://github.com/adrai/flowchart.js/graphs/contributors)

#Thanks

Many thanks to [js-sequence-diagrams](http://bramp.github.io/js-sequence-diagrams/) which greatly inspired this project, and forms the basis for the syntax.

#Licence

Copyright (c) 2013 Adriano Raiano

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
