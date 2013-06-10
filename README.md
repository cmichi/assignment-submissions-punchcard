# When do most students submit their solution for an assignment?

A visualization to answer this question. Clone the repository and
open the file `visualization.html`. You should then see the generated
svg:

![visualization](http://micha.elmueller.net/media/uni-submissions.png)


# Data

The saved HTML pages with student submissions have each been processed using

	$ /bin/sh ./process.sh raw/grn/ue6.html > data/grn12\-13/u06.processed

The data is from the course _Introduction to Computer Networking_ (WS12/13)
and _Mobile and Ubiquitous Computing_ (SS13). The second MUC assignment has
been left out of the visualization because the deadline was on a Tuesday,
not a Monday.


# Libraries

 * jQuery
 * raphael.js
 * [color-js](https://github.com/brehaut/color-js)


# License

Code under MIT. Rendered SVG under CC-BY 3.0.

	Copyright (c) 2013

		Michael Mueller <http://micha.elmueller.net/>

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


