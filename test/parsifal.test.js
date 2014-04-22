describe('parsifal', function () {
  'use strict';

  var parsifal = require('../')
    , assert = require('assert');

  it('is exported as a function', function () {
    assert.ok('function' === typeof parsifal);
  });

  describe('.trim', function () {
    it('trims right', function () {
      assert.equal('foo', parsifal.trim('foo   '));
    });

    it('trims left', function () {
      assert.equal('foo', parsifal.trim('   foo'));
    });

    it('trims both sides', function () {
      assert.equal('foo', parsifal.trim('   foo   '));
    });
  });

  describe('.text', function () {
    it('can retrieve text from text nodes', function () {
      assert.equal('foo', parsifal.text(document.createTextNode('foo')));
    });

    it('can retrieve text from fragments', function () {
      var frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('bar'));

      assert.equal('bar', parsifal.text(frag));
    });
  });
});
