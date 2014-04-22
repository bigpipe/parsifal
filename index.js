'use strict';

/**
 * Detect various of bugs in browsers.
 *
 * @type {Object}
 * @api private
 */
var supports = (function supports() {
  var tests = {}
    , select = document.createElement('select')
    , input = document.createElement('input')
    , option = select.appendChild(document.createElement('option'));

  //
  // Older versions of WebKit return '' instead of 'on' for checked boxes that
  // have no value specified.
  //
  input.type = 'checkbox';
  tests.on = input.value !== '';

  //
  // Make sure that options inside a disabled select are not disabled. Which is
  // the case for WebKit.
  //
  select.disabled = true;
  tests.disabled = !option.disabled;

  return tests;
}());

/**
 * Get the text or inner text from a given element.
 *
 * @param {Element} element
 * @returns {String} text
 * @api public
 */
function text(element) {
  var type = element.nodeType
    , value = '';

  if (1 === type || 9 === type || 11 === type) {
    //
    // Use `textContent` instead of `innerText` as it's inconsistent with new
    // lines.
    //
    if ('string' === typeof element.textContent) return element.textContent;

    for (element = element.firstChild; element; element = element.nextSibling) {
      value += text(element);
    }
  }

  return 3 === type || 4 === type
  ? element.nodeValue
  : value;
}

/**
 * Trim a given string.
 *
 * @param {String} value
 * @returns {String}
 * @api public
 */
function trim(value) {
  return ((value || '') +'').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * Get the value from a given element.
 *
 * @param {Element} element The HTML element we need to extract the value from.
 * @returns {Mixed} The value of the element.
 * @api public
 */
function get(element) {
  var parser = get.parser[element.type] || get.parser[element.nodeName.toLowerCase()]
    , value;

  if (parser && (value = parser(element)) !== undefined) return value;

  value = element.value;

  return 'string' === typeof value
  ? value.replace(/\r/g, '')
  : value === null ? '' : value;
}

/**
 * Dedicated value parsers to combat all the edge cases.
 *
 * @type {Object}
 * @private
 */
get.parser = {
  option: function option(element) {
    var value = element.value;    // @TODO use attribute parser.

    return value === null
    ? trim(text(element))
    : value;
  },

  select: function select(element) {
    var values = []
      , options = element.options
      , index = element.selectedIndex
      , one = element.type === 'select-one' || index < 0;

    for (
      var length = one ? index + 1 : options.length
          , i = index < 0 ? length : one ? index : 0;
      i < length;
      i++
    ) {
      var opt = options[i]
        , value;

      //
      // IE 6-9 doesn't update the selected after a form reset. And don't return
      // options that are disabled or have an disabled option group.
      //
      if (
           (opt.selected || index === i)
        && (
           !supports.disabled
           ? opt.getAttribute('disabled') === null
           : !opt.disabled
        )
        && (
           !opt.parentNode.disabled
        || (opt.parentNode.nodeName || '').toLowerCase() !== 'optgroup'
        )
      ) {
        value = get(opt);
        if (one) return value;

        values.push(value);
      }
    }

    return values;
  }
};

//
// Parsers that require feature detection in order to work:
//
if (!supports.on) {
  get.parser.radio = get.parser.checkbox = function input(element) {
    return element.getAttribute('value') !== null
    ? element.value
    : 'on';
  };
}

//
// Expose the methods.
//
exports.get = get;
exports.trim = trim;
exports.text = text;
