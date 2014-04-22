# Parsifal

Parsifal is a pure JavaScript port of jQuery's `.val()` method which is used to
retrieve values from from elements.

## Installation

The package can be used through browserify as the module contents are exposes
through the `module.exports` interface. Therefor this package is installable
using npm:

```
npm install --save parsifal
```

## Usage

This module exposes the parser as a single function. To use it in your library
simple require the module:

```js
'use strict';

var val = require('parsifal');
```

Now that we have access to the method, we can simply start parsing the value's
out of elements:

```js
var value = val(document.getElementByTagName('input')[0]);
```

And that's it. Super simple, super effective.

### parsifal.parser

We expose dedicated parsers for elements based on their `type` or `nodeName`. If
you wish to add more or change a parser simply add or override the property
with a new method. Check the source for the current dedicated parsers.

```js
//
// EXAMPLE: Simple override or introduction of the radio button parser so it
// returns booleans instead of strings.
//
parsifal.parser.radio = function radio(element) {
  return ((element.getAttribute('value') !== null ? element.value : 'on') === 'on';
};
```

---

The following methods are mostly internally but are to useful for other to not
expose them.

### parsifal.trim()

```js
parsifal.trim(string)
```

Trim the whitespace of a string from the right and left side.

```js
var str = parsifal.trim('  fooo   ');
// str is now 'foo'
```

### parsifal.text()

```js
parsifal.text(element)
```

Get the text from a given element without all the nasty HTML.

```js
var text = parsifal.text(document.getElementById('example'));
```

## License

MIT
