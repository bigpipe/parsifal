'use strict';
/**
 * Cache the hasOwnProperty method.
 *
 * @type {Function}
 * @private
 */
var hasOwn = Object.prototype.hasOwnProperty;

/**
 * Detect various of bugs in browsers.
 *
 * @type {Object}
 * @api private
 */
var supports = (function supports() {
  var tests = {}
    , doc = document
    , div = doc.createElement('div')
    , select = doc.createElement('select')
    , input = doc.createElement('input')
    , option = select.appendChild(doc.createElement('option'))
    , documentElement = doc && (doc.ownerDocument || doc).documentElement;

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

  //
  // Verify that getAttribute really returns attributes and not properties.
  //
  div.className = 'i';
  tests.attributes = !div.getAttribute('className');

  tests.xml = documentElement ? documentElement.nodeName !== "HTML" : false;
  tests.html = !tests.xml;

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
 *
 *
 * @param {Element} element
 * @returns {String} The `.value` of the element.
 * @api private
 */
function attribute(element, name, val) {
  return supports.attributes || !supports.html
  ? element.getAttribute(name)
  : (val = element.getAttributeNode(name)) && val.specified ? val.value : '';
}

/**
 * Get the value from a given element.
 *
 * @param {Element} element The HTML element we need to extract the value from.
 * @returns {Mixed} The value of the element.
 * @api public
 */
function get(element) {
  var name = element.nodeName.toLowerCase()
    , value;

  if (get.parser[element.type] && hasOwn.call(get.parser, element.type)) {
    value = get.parser[element.type](element);
  } else if (get.parser[name] && hasOwn.call(get.parser, name)) {
    value = get.parser[name](element);
  }

  if (value !== undefined) return value;

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
    var value = attribute(element, 'value');

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
get.trim = trim;
get.text = text;

module.exports = get;
