(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/* globals window, HTMLElement */
/**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toStr = objProto.toString;
var symbolValueOf;
if (typeof Symbol === 'function') {
  symbolValueOf = Symbol.prototype.valueOf;
}
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  'boolean': 1,
  number: 1,
  string: 1,
  undefined: 1
};

var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
var hexRegex = /^[A-Fa-f0-9]+$/;

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a = is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return typeof value !== 'undefined';
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toStr.call(value);
  var key;

  if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
    return value.length === 0;
  }

  if (type === '[object Object]') {
    for (key in value) {
      if (owns.call(value, key)) { return false; }
    }
    return true;
  }

  return !value;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function equal(value, other) {
  if (value === other) {
    return true;
  }

  var type = toStr.call(value);
  var key;

  if (type !== toStr.call(other)) {
    return false;
  }

  if (type === '[object Object]') {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if (type === '[object Array]') {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if (type === '[object Function]') {
    return value.prototype === other.prototype;
  }

  if (type === '[object Date]') {
    return value.getTime() === other.getTime();
  }

  return false;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.nil / is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is.nil = is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef / is.undefined
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is.undefined = function (value) {
  return typeof value === 'undefined';
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is.arguments = function (value) {
  var isStandardArguments = toStr.call(value) === '[object Arguments]';
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = Array.isArray || function (value) {
  return toStr.call(value) === '[object Array]';
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.bool(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.bool
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.bool = is['boolean'] = function (value) {
  return toStr.call(value) === '[object Boolean]';
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.bool(value) && Boolean(Number(value)) === false;
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.bool(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return toStr.call(value) === '[object Date]';
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return toStr.call(value) === '[object Error]';
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || toStr.call(value) === '[object Function]';
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return toStr.call(value) === '[object Number]';
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.integer
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.integer = is['int'] = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return toStr.call(value) === '[object Object]';
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return toStr.call(value) === '[object RegExp]';
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return toStr.call(value) === '[object String]';
};

/**
 * Test base64 string.
 */

/**
 * is.base64
 * Test if `value` is a valid base64 encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */

is.base64 = function (value) {
  return is.string(value) && (!value.length || base64Regex.test(value));
};

/**
 * Test base64 string.
 */

/**
 * is.hex
 * Test if `value` is a valid hex encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */

is.hex = function (value) {
  return is.string(value) && (!value.length || hexRegex.test(value));
};

/**
 * is.symbol
 * Test if `value` is an ES6 Symbol
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */

is.symbol = function (value) {
  return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
};

},{}],3:[function(require,module,exports){
module.exports = require('./lib/extend');


},{"./lib/extend":4}],4:[function(require,module,exports){
/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
var is = require('is');

function extend() {
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !is.fn(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options != null) {
      if (typeof options === 'string') {
          options = options.split('');
      }
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
          if (copy_is_array) {
            copy_is_array = false;
            clone = src && is.array(src) ? src : [];
          } else {
            clone = src && is.hash(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/**
 * @public
 */
extend.version = '1.1.3';

/**
 * Exports module.
 */
module.exports = extend;


},{"is":2}],5:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _videojsSoundcloud = require('./videojs-soundcloud');

var _videojsSoundcloud2 = _interopRequireDefault(_videojsSoundcloud);

/**
 * The video.js Soundcloud plugin.
 *
 * @param {Object} options
 */
var plugin = function plugin(options) {
  Soundcloud(this, options);
};

_videoJs2['default'].plugin('soundcloud', plugin);

exports['default'] = plugin;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./videojs-soundcloud":6}],6:[function(require,module,exports){
(function (global){
/**
 * @file videojs-soundcloud.js
 * Soundcloud Media Controller - Wrapper for HTML5 Media API
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _vendorAudiomanager = require('../vendor/audiomanager');

var _vendorAudiomanager2 = _interopRequireDefault(_vendorAudiomanager);

var _vendorScaudio = require('../vendor/scaudio');

var _vendorScaudio2 = _interopRequireDefault(_vendorScaudio);

/**
 * Soundcloud Media Controller - Wrapper for HTML5 Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Soundcloud
 */

var Component = _videoJs2['default'].getComponent('Component');
var Tech = _videoJs2['default'].getComponent('Tech');

var audioManager = new _vendorAudiomanager2['default']({
    flashAudioPath: '//connect.soundcloud.com/sdk/flashAudio.swf'
});

var Soundcloud = (function (_Tech) {
    _inherits(Soundcloud, _Tech);

    function Soundcloud(options, ready) {
        _classCallCheck(this, Soundcloud);

        _get(Object.getPrototypeOf(Soundcloud.prototype), 'constructor', this).call(this, options, ready);

        this.params = {
            id: this.options_.techId,
            autoplay: options.autoplay ? 1 : 0,
            url: options.source.src,
            client_id: options.clientId ? options.clientId : null,
            secret_token: options.secret_token ? options.secret_token : null
        };

        // If we are not on a server, don't specify the origin (it will crash)
        if (window.location.protocol !== 'file:') {
            this.params.origin = window.location.protocol + '//' + window.location.hostname;
        }

        this.videoId = this.parseSrc(options.source.src);
        this.src_ = options.source.src;

        // Parent is not set yet so we have to wait a tick
        setTimeout((function () {
            if (Soundcloud.isApiReady) {
                this.loadApi();
            } else {
                // Add to the queue because the Soundcloud API is not ready
                Soundcloud.apiReadyQueue.push(this);
            }
        }).bind(this));
    }

    _createClass(Soundcloud, [{
        key: 'createEl',
        value: function createEl() {
            var el = _videoJs2['default'].createEl('div', {}, {
                'class': 'vjs-tech vjs-tech-soundcloud'
            });
            return el;
        }
    }, {
        key: 'loadApi',
        value: function loadApi() {
            this.ended_ = false;
            SC.initialize({
                client_id: this.params.client_id
            });
            // get track infos from Soundcloud, then launch player
            SC.get('/tracks/' + this.videoId, this.params).then((function (track) {
                this.videoId = track.id;
                this.trackData = track;

                var streamsEndpoint = 'https://api.soundcloud.com/tracks/' + track.id + '/streams?client_id=' + this.params.client_id;
                var registerEndpoint = 'https://api.soundcloud.com/tracks/' + track.id + '/plays?client_id=' + this.params.client_id;

                if (this.params.secret_token) {
                    streamsEndpoint += '&secret_token=' + this.params.secret_token;
                    registerEndpoint += '&secret_token=' + this.params.secret_token;
                }

                if (!this.poster() && track.artwork_url) {
                    this.setPoster(track.artwork_url);
                } else if (!this.poster() && track.waveform_url) {
                    this.setPoster(track.waveform_url);
                }

                this.scPlayer = new _vendorScaudio2['default'](audioManager, {
                    soundId: track.id,
                    duration: track.duration,
                    streamUrlsEndpoint: streamsEndpoint,
                    registerEndpoint: registerEndpoint,
                    forceHTML5: true
                });

                this.setupTriggers();
                this.scPlayer.vjsTech = this;
                this.triggerReady();
                this.firstPlay = true;
            }).bind(this))['catch'](function (el) {
                this.eventHandler('error', e);
            });
        }
    }, {
        key: 'parseSrc',
        value: function parseSrc(src) {
            if (src) {
                var trackUrl = /^https?:\/\/(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/tracks\/([a-zA-Z0-9-]*)(\/.*)?$/;
                var match = src.match(trackUrl);
                if (match) {
                    return match ? match[2] : null;
                }

                // Regex that parse the video ID for any Soundcloud URL
                var regExp = /^https?:\/\/(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/([a-zA-Z0-9-]*)(\/.*)?$/;
                var match = src.match(regExp);
                return match ? match[2] : null;
            }
        }
    }, {
        key: 'setupTriggers',
        value: function setupTriggers() {
            this.scPlayer.listeners = [];
            for (var i = Soundcloud.Events.length - 1; i >= 0; i--) {
                //videojs.on(this.scPlayer, Soundcloud.Events[i], videojs.bind(this, this.eventHandler));
                var listener = _videoJs2['default'].bind(this, this.eventHandler);
                this.scPlayer.listeners.push({ event: Soundcloud.Events[i], func: listener });
                this.scPlayer.on(Soundcloud.Events[i], listener.bind(this, Soundcloud.Events[i])); // add arg type to handler
            }
        }
    }, {
        key: 'eventHandler',
        value: function eventHandler(type, e) {
            if (!e || !type) return false;
            this.onStateChange(type, e);
            //this.trigger(e);
        }
    }, {
        key: 'onStateChange',
        value: function onStateChange(type, event) {
            var state = type;
            if (state !== this.lastState) {
                switch (state) {
                    case -1:
                        break;
                    case 'created':
                        this.trigger('waiting');
                        this.trigger('loadstart');
                        break;
                    case 'destroyed':
                    case 'finish':
                        this.ended_ = true;
                        this.trigger('ended');
                        break;
                    case 'loading':
                        this.trigger('waiting');
                        break;
                    case 'metadata':
                        this.trigger('loadedmetadata');
                        this.trigger('volumechange');
                        this.trigger('durationchange');
                        break;
                    case 'play-start':
                        if (this.firstPlay) {
                            this.firstPlay = false;
                            this.eventHandler('created', {});
                            this.eventHandler('metadata', {});
                        }
                        this.trigger('loadeddata');
                        this.trigger('canplay');
                    case 'play-resume':
                    case 'play':
                        this.trigger('playing');
                        this.trigger('play');
                        break;
                    case 'pause':
                        this.trigger('pause');
                        break;
                    case 'reset':
                        this.trigger('pause');
                        break;
                    case 'seek':
                    case 'seeked':
                        this.trigger('timeupdate');
                        break;
                    case 'state-change':
                        if (event == 'initialize') this.eventHandler('created', {});else if (event == 'error') this.eventHandler('error', { message: 'Unable to load audio from Soundcloud, sorry.', code: 0 });else if (event == 'dead') this.eventHandler('pause', {});
                        break;
                    case 'time':
                        this.trigger('timeupdate');
                        break;
                    case 'geo_blocked':
                        this.trigger('error', { message: 'Sorry, this audio content cannot be played in your country.', code: 0 });
                        break;
                    case 'buffering_start':
                        this.trigger('progress');
                    case 'buffering_end':
                        this.trigger('canplaythrough');
                        this.trigger('progress');
                        break;
                    case 'audio_error':
                        this.trigger('error', { code: 3 });
                        break;
                    case 'no_streams':
                        this.trigger('error', { code: 4 });
                        break;
                    case 'no_protocol':
                    case 'no_connection':
                        this.trigger('error', { code: 2 });
                        break;

                }
                this.lastState = state;
            }
        }
    }, {
        key: 'poster',
        value: function poster() {
            return this.poster_;
        }
    }, {
        key: 'setPoster',
        value: function setPoster(poster) {
            this.poster_ = poster;
            this.trigger('posterchange');
        }

        /**
        * Set video
        *
        * @param {Object=} src Source object
        * @method setSrc
        */
    }, {
        key: 'src',
        value: function src(_src) {
            if (typeof _src !== 'undefined' && this.src_ != _src) {
                this.src_ = _src;
                this.videoId = this.parseSrc(_src);
                this.dispose();
                this.loadApi();
            }
            return this.src_;
        }
    }, {
        key: 'currentSrc',
        value: function currentSrc() {
            return this.src_;
        }
    }, {
        key: 'play',
        value: function play() {
            if (this.isReady_) {
                this.scPlayer.play();
            } else {
                // Keep the big play button until it plays for real
                this.player_.bigPlayButton.show();
            }
        }
    }, {
        key: 'ended',
        value: function ended() {
            if (this.isReady_) {
                return this.ended_;
            } else {
                // We will play it when the API will be ready
                return false;
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.scPlayer.pause();
        }
    }, {
        key: 'paused',
        value: function paused() {
            return this.scPlayer.isPaused();
        }
    }, {
        key: 'currentTime',
        value: function currentTime() {
            return this.scPlayer && this.scPlayer.currentTime ? this.scPlayer.currentTime() / 1000 : 0; // sc player returns ms
        }
    }, {
        key: 'setCurrentTime',
        value: function setCurrentTime(position) {
            this.scPlayer.seek(position * 1000); // sc player takes ms
        }
    }, {
        key: 'duration',
        value: function duration() {
            return this.scPlayer && this.scPlayer.streamInfo && this.scPlayer.streamInfo.duration ? this.scPlayer.streamInfo.duration / 1000 : 0;
        }
    }, {
        key: 'volume',
        value: function volume() {
            if (isNaN(this.volume_)) {
                this.volume_ = this.scPlayer.getVolume();
            }

            return this.volume_;
        }

        /**
        * Request to enter fullscreen
        *
        * @method enterFullScreen
        */
    }, {
        key: 'enterFullScreen',
        value: function enterFullScreen() {
            return false;
        }

        /**
        * Request to exit fullscreen
        *
        * @method exitFullScreen
        */
    }, {
        key: 'exitFullScreen',
        value: function exitFullScreen() {
            return false;
        }
    }, {
        key: 'setVolume',
        value: function setVolume(percentAsDecimal) {
            if (typeof percentAsDecimal !== 'undefined' && percentAsDecimal !== this.volume_) {
                this.scPlayer.setVolume(percentAsDecimal);
                this.volume_ = percentAsDecimal;
                this.player_.trigger('volumechange');
            }
        }
    }, {
        key: 'buffered',
        value: function buffered() {
            var _end = this.scPlayer.buffered() / 1000;
            return {
                length: this.duration(),
                start: function start() {
                    return 0;
                },
                end: function end() {
                    return _end;
                }
            };
        }
    }, {
        key: 'controls',
        value: function controls() {
            return false;
        }
    }, {
        key: 'muted',
        value: function muted() {
            return this.scPlayer.isMuted();
        }
    }, {
        key: 'setMuted',
        value: function setMuted(muted) {
            this.scPlayer.toggleMute(muted);

            this.setTimeout(function () {
                this.player_.trigger('volumechange');
            });
        }
    }, {
        key: 'supportsFullScreen',
        value: function supportsFullScreen() {
            return false;
        }
    }, {
        key: 'resetSrc_',
        value: function resetSrc_(callback) {
            this.scPlayer.dispose();
            callback();
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.resetSrc_(Function.prototype);
            _get(Object.getPrototypeOf(Soundcloud.prototype), 'dispose', this).call(this, this);
        }
    }]);

    return Soundcloud;
})(Tech);

Soundcloud.prototype.options_ = {};

Soundcloud.apiReadyQueue = [];

Soundcloud.makeQueryString = function (args) {
    var querys = [];
    for (var key in args) {
        if (args.hasOwnProperty(key)) {
            querys.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
        }
    }

    return querys.join('&');
};

// Called when Soundcloud API is ready to be used
window.scAsyncInit = function () {
    var sc;
    while (sc = Soundcloud.apiReadyQueue.shift()) {
        sc.loadApi();
    }
    Soundcloud.apiReadyQueue = [];
    Soundcloud.isApiReady = true;
};

var injectJs = function injectJs() {
    var tag = document.createElement('script');
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    tag.onload = window.scAsyncInit;
    tag.src = '//connect.soundcloud.com/sdk/sdk-3.0.0.js';
};

/* Soundcloud Support Testing -------------------------------------------------------- */

Soundcloud.isSupported = function () {
    return true;
};

// Add Source Handler pattern functions to this tech
Tech.withSourceHandlers(Soundcloud);

/*
 * The default native source handler.
 * This simply passes the source to the video element. Nothing fancy.
 *
 * @param  {Object} source   The source object
 * @param  {Flash} tech  The instance of the Flash tech
 */
Soundcloud.nativeSourceHandler = {};

/**
 * Check if Flash can play the given videotype
 * @param  {String} type    The mimetype to check
 * @return {String}         'probably', 'maybe', or '' (empty string)
 */
Soundcloud.nativeSourceHandler.canPlayType = function (source) {

    var dashExtRE = /^video\/(soundcloud)/i;

    if (dashExtRE.test(source)) {
        return 'maybe';
    } else {
        return '';
    }
};

/*
 * Check Flash can handle the source natively
 *
 * @param  {Object} source  The source object
 * @return {String}         'probably', 'maybe', or '' (empty string)
 */
Soundcloud.nativeSourceHandler.canHandleSource = function (source) {

    // If a type was provided we should rely on that
    if (source.type) {
        return Soundcloud.nativeSourceHandler.canPlayType(source.type);
    } else if (source.src) {
        return Soundcloud.nativeSourceHandler.canPlayType(source.src);
    }

    return '';
};

/*
 * Pass the source to the flash object
 * Adaptive source handlers will have more complicated workflows before passing
 * video data to the video element
 *
 * @param  {Object} source    The source object
 * @param  {Flash} tech   The instance of the Flash tech
 */
Soundcloud.nativeSourceHandler.handleSource = function (source, tech) {
    tech.src(source.src);
};

/*
 * Clean up the source handler when disposing the player or switching sources..
 * (no cleanup is needed when supporting the format natively)
 */
Soundcloud.nativeSourceHandler.dispose = function () {};

// Register the native source handler
Soundcloud.registerSourceHandler(Soundcloud.nativeSourceHandler);

/*
 * Set the tech's volume control support status
 *
 * @type {Boolean}
 */
Soundcloud.prototype['featuresVolumeControl'] = true;

/*
 * Set the tech's playbackRate support status
 *
 * @type {Boolean}
 */
Soundcloud.prototype['featuresPlaybackRate'] = false;

/*
 * Set the tech's status on moving the video element.
 * In iOS, if you move a video element in the DOM, it breaks video playback.
 *
 * @type {Boolean}
 */
Soundcloud.prototype['movingMediaElementInDOM'] = false;

/*
 * Set the the tech's fullscreen resize support status.
 * HTML video is able to automatically resize when going to fullscreen.
 * (No longer appears to be used. Can probably be removed.)
 */
Soundcloud.prototype['featuresFullscreenResize'] = false;

/*
 * Set the tech's timeupdate event support status
 * (this disables the manual timeupdate events of the Tech)
 */
Soundcloud.prototype['featuresTimeupdateEvents'] = false;

/*
 * Set the tech's progress event support status
 * (this disables the manual progress events of the Tech)
 */
Soundcloud.prototype['featuresProgressEvents'] = false;

/*
 * Sets the tech's status on native text track support
 *
 * @type {Boolean}
 */
Soundcloud.prototype['featuresNativeTextTracks'] = false;

/*
 * Sets the tech's status on native audio track support
 *
 * @type {Boolean}
 */
Soundcloud.prototype['featuresNativeAudioTracks'] = true;

/*
 * Sets the tech's status on native video track support
 *
 * @type {Boolean}
 */
Soundcloud.prototype['featuresNativeVideoTracks'] = false;

Soundcloud.Events = 'created,destroyed,finish,loading,metadata,play-start,play-resume,play,pause,reset,seek,seeked,state-change,time,geo_blocked,buffering_start,buffering_end,audio_error,no_streams,no_protocol,no_connection'.split(',');

_videoJs2['default'].options.Soundcloud = {};

// Older versions of VJS5 doesn't have the registerTech function
if (typeof _videoJs2['default'].registerTech !== 'undefined') {
    Tech.registerTech('Soundcloud', Soundcloud);
} else {
    Component.registerComponent('Soundcloud', Soundcloud);
}

injectJs();

exports['default'] = Soundcloud;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../vendor/audiomanager":10,"../vendor/scaudio":11}],7:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nodeExtend = require('node.extend');

var _nodeExtend2 = _interopRequireDefault(_nodeExtend);

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var proxy = function proxy(props) {
  var player = (0, _nodeExtend2['default'])(true, {}, _videoJs2['default'].EventTarget.prototype, {
    play: Function.prototype,
    paused: Function.prototype,
    ended: Function.prototype,
    poster: Function.prototype,
    src: Function.prototype,
    addRemoteTextTrack: Function.prototype,
    removeRemoteTextTrack: Function.prototype,
    remoteTextTracks: Function.prototype,
    currentSrc: Function.prototype,
    soundcloud: {}
  }, props);

  player.constructor = _videoJs2['default'].getComponent('Player');
  player.chromecast.player_ = player;

  return player;
};

exports['default'] = proxy;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"node.extend":3}],8:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _sinon = (typeof window !== "undefined" ? window['sinon'] : typeof global !== "undefined" ? global['sinon'] : null);

var _sinon2 = _interopRequireDefault(_sinon);

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var _srcPlugin = require('../src/plugin');

var _srcPlugin2 = _interopRequireDefault(_srcPlugin);

_qunit2['default'].test('the environment is sane', function (assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof _sinon2['default'], 'object', 'sinon exists');
  assert.strictEqual(typeof _videoJs2['default'], 'function', 'videojs exists');
  assert.strictEqual(typeof _srcPlugin2['default'], 'function', 'plugin is a function');
});

_qunit2['default'].test('registers itself with video.js', function (assert) {
  assert.expect(1);
  assert.strictEqual(_videoJs2['default'].getComponent('Player').prototype.soundcloud, _srcPlugin2['default'], 'videojs-soundcloud plugin was registered');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/plugin":5}],9:[function(require,module,exports){
(function (global){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _qunit = (typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null);

var _qunit2 = _interopRequireDefault(_qunit);

var _srcVideojsSoundcloud = require('../src/videojs-soundcloud');

var _srcVideojsSoundcloud2 = _interopRequireDefault(_srcVideojsSoundcloud);

var _playerProxy = require('./player-proxy');

var _playerProxy2 = _interopRequireDefault(_playerProxy);

_qunit2['default'].module('soundcloud', {

  beforeEach: function beforeEach() {
    this.oldTimeout = _globalWindow2['default'].setTimeout;
    _globalWindow2['default'].setTimeout = Function.prototype;
  },

  afterEach: function afterEach() {
    _globalWindow2['default'].setTimeout = this.oldTimeout;
  }
});

_qunit2['default'].test('chromecastMaker takes a player and returns a soundcloud plugin', function (assert) {
  var chromecast = (0, _srcVideojsSoundcloud2['default'])((0, _playerProxy2['default'])(), {});

  assert.equal(typeof chromecast, 'object', 'soundcloud is an object');
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/videojs-soundcloud":6,"./player-proxy":7,"global/window":1}],10:[function(require,module,exports){
"use strict";module.exports = (function(t){function e(i){if(r[i])return r[i].exports;var n=r[i] = {exports:{},id:i,loaded:!1};return t[i].call(n.exports,n,n.exports,e),n.loaded = !0,n.exports;}var r={};return e.m = t,e.c = r,e.p = "",e(0);})((function(t){for(var e in t) if(Object.prototype.hasOwnProperty.call(t,e))switch(typeof t[e]){case "function":break;case "object":t[e] = (function(e){var r=e.slice(1),i=t[e[0]];return function(t,e,n){i.apply(this,[t,e,n].concat(r));};})(t[e]);break;default:t[e] = t[t[e]];}return t;})([function(t,e,r){var i,n=r(1),o=r(12),s=r(14),a=r(38),u=r(43),h=r(39),l=r(16),c=r(42),f=r(128),d=r(129);t.exports = i = function(t){t = t || {},this._players = {},this._volume = 1,this._mute = !1,this.States = a,this.Errors = u,this._settings = o({},t,i.defaults);},i.MimeTypes = d,i.Protocols = f,i.Events = h,i.States = a,i.Errors = u,i.BrowserUtils = l,i.defaults = {flashAudioPath:"flashAudio.swf",flashLoadTimeout:2e3,flashObjectID:"flashAudioObject",audioObjectID:"html5AudioObject",updateInterval:300,bufferTime:8e3,bufferingDelay:800,streamUrlProvider:null,debug:!1},i.capabilities = c.names,i.createDefaultMediaDescriptor = function(t,e,r){if(!t || !e || !e.length)throw new Error("invalid input to create media descriptor");return r || (r = 0),{id:t,src:e,duration:r,forceSingle:!1,forceFlash:!1,forceHTML5:!1,forceCustomHLS:!1,mimeType:void 0};},i.prototype.getAudioPlayer = function(t){return this._players[t];},i.prototype.hasAudioPlayer = function(t){return void 0 !== this._players[t];},i.prototype.removeAudioPlayer = function(t){this.hasAudioPlayer(t) && delete this._players[t];},i.prototype.setVolume = function(t){t = Math.min(1,t),this._volume = Math.max(0,t);for(var e in this._players) this._players.hasOwnProperty(e) && this._players[e].setVolume(this._volume);},i.prototype.getVolume = function(){return this._volume;},i.prototype.setMute = function(t){this._muted = t;for(var e in this._players) this._players.hasOwnProperty(e) && this._players[e].setMute(this._muted);},i.prototype.getMute = function(){return this._muted;},i.prototype.createAudioPlayer = function(t,e){var r,i=n({},this._settings,e);if(!t)throw "AudioManager: No media descriptor object passed, can`t build any player";if((t.id || (t.id = Math.floor(1e10 * Math.random()).toString() + new Date().getTime().toString()),!t.src))throw new Error("AudioManager: You need to pass a valid media source URL");if(!this._players[t.id]){if((r = s.createAudioPlayer(t,i),!r))throw new Error("AudioManager: No player could be created from the given descriptor");this._players[t.id] = r;}return this._players[t.id].setVolume(this._volume),this._players[t.id].setMute(this._muted),this._players[t.id].on(h.STATE_CHANGE,this._onStateChange,this),this._players[t.id];},i.prototype._onStateChange = function(t,e){e.getState() === a.DEAD && this.removeAudioPlayer(e.getId());};},[130,2,8,4],[131,3,4],function(t,e){function r(t,e,r){r || (r = {});for(var i=-1,n=e.length;++i < n;) {var o=e[i];r[o] = t[o];}return r;}t.exports = r;},[132,5,6,7],function(t,e){function r(t){return !!t && "object" == typeof t;}function i(t,e){var r=null == t?void 0:t[e];return s(r)?r:void 0;}function n(t){return o(t) && f.call(t) == a;}function o(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}function s(t){return null == t?!1:n(t)?d.test(l.call(t)):r(t) && u.test(t);}var a="[object Function]",u=/^\[object .+?Constructor\]$/,h=Object.prototype,l=Function.prototype.toString,c=h.hasOwnProperty,f=h.toString,d=RegExp("^" + l.call(c).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?") + "$");t.exports = i;},function(t,e){function r(t){return !!t && "object" == typeof t;}function i(t){return function(e){return null == e?void 0:e[t];};}function n(t){return null != t && o(c(t));}function o(t){return "number" == typeof t && t > -1 && t % 1 == 0 && l >= t;}function s(t){return r(t) && n(t) && u.call(t,"callee") && !h.call(t,"callee");}var a=Object.prototype,u=a.hasOwnProperty,h=a.propertyIsEnumerable,l=9007199254740991,c=i("length");t.exports = s;},function(t,e){function r(t){return !!t && "object" == typeof t;}function i(t,e){var r=null == t?void 0:t[e];return a(r)?r:void 0;}function n(t){return "number" == typeof t && t > -1 && t % 1 == 0 && y >= t;}function o(t){return s(t) && p.call(t) == h;}function s(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}function a(t){return null == t?!1:o(t)?g.test(f.call(t)):r(t) && l.test(t);}var u="[object Array]",h="[object Function]",l=/^\[object .+?Constructor\]$/,c=Object.prototype,f=Function.prototype.toString,d=c.hasOwnProperty,p=c.toString,g=RegExp("^" + f.call(d).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?") + "$"),_=i(Array,"isArray"),y=9007199254740991,m=_ || function(t){return r(t) && n(t.length) && p.call(t) == u;};t.exports = m;},[133,9,10,11],function(t,e){function r(t,e,r){if("function" != typeof t)return i;if(void 0 === e)return t;switch(r){case 1:return function(r){return t.call(e,r);};case 3:return function(r,i,n){return t.call(e,r,i,n);};case 4:return function(r,i,n,o){return t.call(e,r,i,n,o);};case 5:return function(r,i,n,o,s){return t.call(e,r,i,n,o,s);};}return function(){return t.apply(e,arguments);};}function i(t){return t;}t.exports = r;},function(t,e){function r(t){return function(e){return null == e?void 0:e[t];};}function i(t){return null != t && s(l(t));}function n(t,e){return t = "number" == typeof t || u.test(t)?+t:-1,e = null == e?h:e,t > -1 && t % 1 == 0 && e > t;}function o(t,e,r){if(!a(r))return !1;var o=typeof e;if("number" == o?i(r) && n(e,r.length):"string" == o && e in r){var s=r[e];return t === t?t === s:s !== s;}return !1;}function s(t){return "number" == typeof t && t > -1 && t % 1 == 0 && h >= t;}function a(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}var u=/^\d+$/,h=9007199254740991,l=r("length");t.exports = o;},function(t,e){function r(t,e){if("function" != typeof t)throw new TypeError(i);return e = n(void 0 === e?t.length - 1:+e || 0,0),function(){for(var r=arguments,i=-1,o=n(r.length - e,0),s=Array(o);++i < o;) s[i] = r[e + i];switch(e){case 0:return t.call(this,s);case 1:return t.call(this,r[0],s);case 2:return t.call(this,r[0],r[1],s);}var a=Array(e + 1);for(i = -1;++i < e;) a[i] = r[i];return a[e] = s,t.apply(this,a);};}var i="Expected a function",n=Math.max;t.exports = r;},function(t,e,r){function i(t,e){return void 0 === t?e:t;}function n(t,e){return s(function(r){var i=r[0];return null == i?i:(r.push(e),t.apply(void 0,r));});}var o=r(1),s=r(13),a=n(o,i);t.exports = a;},11,function(t,e,r){t.exports = r(15);},function(t,e,r){var i,n=r(16),o=r(17),s=r(45),a=r(49),u=r(46),h=r(48),l=r(50),c=r(129);t.exports = i = function(){},i.createAudioPlayer = function(t,e){var r;if((r = t.src.split(":")[0],("rtmp" === r || "rtmpt" === r || t.forceFlash) && !t.forceHTML5))return new o(t,e);if((t.mimeType = i.getMimeType(t),t.mimeType === c.M3U8)){if(n.isMSESupportMPEG() || n.isMSESupportMP4())return new l(t,e);if(n.isNativeHlsSupported() && !t.forceCustomHLS)return n.isMobile() || t.forceSingle?new a(t,e):new s(t,e);}else {if(n.supportHTML5Audio() && n.canPlayType(t.mimeType) || t.forceHTML5)return n.isMobile() || t.forceSingle?new h(t,e):new u(t,e);if(t.mimeType === c.MP3)return new o(t,e);}return null;},i.getMimeType = function(t){if(t.mimeType)return t.mimeType;var e=t.src.split("?")[0];return e = e.substring(e.lastIndexOf(".") + 1,e.length),c.getTypeByExtension(e);};},function(t,e){function r(){return !(!window.MediaSource && !window.WebKitMediaSource);}t.exports = {supportHTML5Audio:function supportHTML5Audio(){var t;try{if(window.HTMLAudioElement && "undefined" != typeof Audio)return t = new Audio(),!0;}catch(e) {return !1;}},createAudioElement:function createAudioElement(){var t=document.createElement("audio");return t.setAttribute("msAudioCategory","BackgroundCapableMedia"),t.mozAudioChannelType = "content",t;},isMobile:function isMobile(t){var e=window.navigator.userAgent,r=["mobile","iPhone","iPad","iPod","Android","Skyfire"];return r.some(function(t){return t = new RegExp(t,"i"),t.test(e);});},isIE10Mobile:function isIE10Mobile(){return (/IEmobile\/10\.0/gi.test(navigator.userAgent));},canPlayType:function canPlayType(t){var e=document.createElement("audio");return e && e.canPlayType && e.canPlayType(t).match(/maybe|probably/i)?!0:!1;},isNativeHlsSupported:function isNativeHlsSupported(){var t,e,r,i=navigator.userAgent,n=["iPhone","iPad","iPod"];return t = function(t){return t.test(i);},e = !t(/chrome/i) && !t(/opera/i) && t(/safari/i),r = n.some(function(e){return t(new RegExp(e,"i"));}),r || e;},isMSESupported:r,isMSESupportMPEG:function isMSESupportMPEG(){return r() && MediaSource.isTypeSupported("audio/mpeg");},isMSESupportMP4:function isMSESupportMP4(){return r() && MediaSource.isTypeSupported("audio/mp4");}};},function(t,e,r){function i(t,e){a.call(this,"FlashAudioProxy",t,e),i.players[t.id] = this,this._errorMessage = null,this._errorID = null,this._volume = 1,this._muted = !1,i.creatingFlashAudio || (i.flashAudio?this._createFlashAudio():i.createFlashObject(e));}var n=r(1),o=r(18),s=r(29),a=r(35),u=r(39),h=r(43),l=r(38),c=r(44);t.exports = i,n(i.prototype,a.prototype),i.players = {},i.createFlashObject = function(t){i.creatingFlashAudio = !0,i.containerElement = document.createElement("div"),i.containerElement.setAttribute("id",t.flashObjectID + "-container"),i.flashElementTarget = document.createElement("div"),i.flashElementTarget.setAttribute("id",t.flashObjectID + "-target"),i.containerElement.appendChild(i.flashElementTarget),document.body.appendChild(i.containerElement);var e=function e(_e){if(_e.success)i.flashAudio = document.getElementById(t.flashObjectID),window.setTimeout(function(){if(i.flashAudio && !("PercentLoaded" in i.flashAudio))for(var t in i.players) i.players.hasOwnProperty(t) && (i.players[t]._errorID = h.FLASH_PROXY_FLASH_BLOCKED,i.players[t]._errorMessage = "Flash object blocked",i.players[t]._setState(l.ERROR),i.players[t]._logger.type = i.players[t].getType(),i.players[t]._logger.log(i.players[t]._errorMessage));},t.flashLoadTimeout),i.flashAudio.triggerEvent = function(t,e){i.players[t]._triggerEvent(e);},i.flashAudio.onPositionChange = function(t,e,r,n){i.players[t]._onPositionChange(e,r,n);},i.flashAudio.onDebug = function(t,e,r){i.players[t]._logger.type = e,i.players[t]._logger.log(r);},i.flashAudio.onStateChange = function(t,e){i.players[t]._setState(e),e === l.DEAD && delete i.players[t];},i.flashAudio.onInit = function(t){i.creatingFlashAudio = !1,o(s(i.players),"_createFlashAudio");};else for(var r in i.players) i.players.hasOwnProperty(r) && (i.players[r]._errorID = h.FLASH_PROXY_CANT_LOAD_FLASH,i.players[r]._errorMessage = "Cannot create flash object",i.players[r]._setState(l.ERROR));};document.getElementById(t.flashObjectID) || c.embedSWF(t.flashAudioPath,t.flashObjectID + "-target","1","1","9.0.24","",{json:encodeURIComponent(JSON.stringify(t))},{allowscriptaccess:"always"},{id:t.flashObjectID,tabIndex:"-1"},e);},i._ready = function(){return i.flashAudio && !i.creatingFlashAudio;},i.prototype._createFlashAudio = function(){i.flashAudio.createAudio(this.getDescriptor()),this._state = i.flashAudio.getState(this.getId()),this.setVolume(this._volume),this.setMute(this._muted);},i.prototype._triggerEvent = function(t){this._logger.log("Flash element triggered event: " + t),this.trigger(t,this);},i.prototype._setState = function(t){this._state !== t && (this._state = t,this.trigger(u.STATE_CHANGE,t,this));},i.prototype._onPositionChange = function(t,e,r){this.trigger(u.POSITION_CHANGE,t,e,r,this);},i.prototype.getType = function(){return i._ready()?i.flashAudio.getType(this.getId()):this._type;},i.prototype.getContainerElement = function(){return i.containerElement;},i.prototype.play = function(t){if(i._ready()){if(this.getState() === l.PAUSED)return void this.resume();t = void 0 === t?0:t,i.flashAudio.playAudio(this.getId(),t);}},i.prototype.pause = function(){i._ready() && i.flashAudio.pauseAudio(this.getId());},i.prototype.seek = function(t){i._ready() && i.flashAudio.seekAudio(this.getId(),t);},i.prototype.resume = function(){i._ready() && i.flashAudio.resumeAudio(this.getId());},i.prototype.setVolume = function(t){this._volume = t,i._ready() && i.flashAudio.setVolume(this.getId(),t);},i.prototype.getVolume = function(){return i._ready()?i.flashAudio.getVolume(this.getId()):this._volume;},i.prototype.setMute = function(t){this._muted = t,i._ready() && i.flashAudio.setMute(this.getId(),t);},i.prototype.getMute = function(){return i._ready()?i.flashAudio.getMute(this.getId()):this._muted;},i.prototype.getState = function(){return this._state;},i.prototype.getCurrentPosition = function(){return i._ready()?i.flashAudio.getCurrentPosition(this.getId()):0;},i.prototype.getLoadedPosition = function(){return i._ready()?i.flashAudio.getLoadedPosition(this.getId()):0;},i.prototype.getDuration = function(){return i._ready()?i.flashAudio.getDuration(this.getId()):0;},i.prototype.kill = function(){return i._ready()?void i.flashAudio.killAudio(this.getId()):0;},i.prototype.getErrorMessage = function(){return this._errorMessage?this._errorMessage:i.flashAudio.getErrorMessage(this.getId());},i.prototype.getErrorID = function(){return this._errorID?this._errorID:i.flashAudio.getErrorID(this.getId());},i.prototype.getLevelNum = function(){return i._ready()?i.flashAudio.getLevelNum(this.getId()):0;},i.prototype.getLevel = function(){return i._ready()?i.flashAudio.getLevel(this.getId()):0;},i.prototype.setLevel = function(t){return i._ready()?i.flashAudio.setLevel(this.getId(),t):0;};},function(t,e,r){function i(t){return function(e){return null == e?void 0:e[t];};}function n(t){return null != t && s(_(t));}function o(t,e){var r=typeof t;if("string" == r && p.test(t) || "number" == r)return !0;if(c(t))return !1;var i=!d.test(t);return i || null != e && t in a(e);}function s(t){return "number" == typeof t && t > -1 && t % 1 == 0 && g >= t;}function a(t){return u(t)?t:Object(t);}function u(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}var h=r(19),l=r(24),c=r(23),f=r(28),d=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,p=/^\w*$/,g=9007199254740991,_=i("length"),y=f(function(t,e,r){var i=-1,s="function" == typeof e,a=o(e),u=n(t)?Array(t.length):[];return h(t,function(t){var n=s?e:a && null != t?t[e]:void 0;u[++i] = n?n.apply(t,r):l(t,e,r);}),u;});t.exports = y;},[134,20],[132,21,22,23],5,6,7,function(t,e,r){function i(t,e,r){null == t || n(e,t) || (e = l(e),t = 1 == e.length?t:u(t,h(e,0,-1)),e = s(e));var i=null == t?t:t[e];return null == i?void 0:i.apply(t,r);}function n(t,e){var r=typeof t;if("string" == r && d.test(t) || "number" == r)return !0;if(c(t))return !1;var i=!f.test(t);return i || null != e && t in o(e);}function o(t){return a(t)?t:Object(t);}function s(t){var e=t?t.length:0;return e?t[e - 1]:void 0;}function a(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}var u=r(25),h=r(26),l=r(27),c=r(23),f=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,d=/^\w*$/;t.exports = i;},function(t,e){function r(t,e,r){if(null != t){void 0 !== r && r in i(t) && (e = [r]);for(var n=0,o=e.length;null != t && o > n;) t = t[e[n++]];return n && n == o?t:void 0;}}function i(t){return n(t)?t:Object(t);}function n(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}t.exports = r;},function(t,e){function r(t,e,r){var i=-1,n=t.length;e = null == e?0:+e || 0,0 > e && (e = -e > n?0:n + e),r = void 0 === r || r > n?n:+r || 0,0 > r && (r += n),n = e > r?0:r - e >>> 0,e >>>= 0;for(var o=Array(n);++i < n;) o[i] = t[i + e];return o;}t.exports = r;},function(t,e,r){function i(t){return null == t?"":t + "";}function n(t){if(o(t))return t;var e=[];return i(t).replace(s,function(t,r,i,n){e.push(i?n.replace(a,"$1"):r || t);}),e;}var o=r(23),s=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,a=/\\(\\)?/g;t.exports = n;},11,function(t,e,r){function i(t){return n(t,o(t));}var n=r(30),o=r(31);t.exports = i;},function(t,e){function r(t,e){for(var r=-1,i=e.length,n=Array(i);++r < i;) n[r] = t[e[r]];return n;}t.exports = r;},[132,32,33,34],5,6,7,function(t,e,r){function i(t,e,r,i){this._type = t,this._id = e.id,this._descriptor = e,this._settings = r,this._currentPosition = this._loadedPosition = this._duration = 0,this._capabilities = n({},h.createDefaults(),i),this._logger = new u(this.getType(),this.getId(),e.title,r);try{h.validate(this.getCapabilities());}catch(o) {return this.getLogger().log("Bad caps: " + o),void this.updateState(s.ERROR);}this.updateState(s.INITIALIZE);}var n=r(1),o=r(36),s=r(38),a=r(39),u=r(40),h=r(42);t.exports = i,n(i.prototype,o),i.prototype.canPlay = function(){return !1;},i.prototype.getCapabilities = function(){return this._capabilities;},i.prototype.getLogger = function(){return this._logger;},i.prototype.getSettings = function(){return this._settings;},i.prototype.getDescriptor = function(){return this._descriptor;},i.prototype.getType = function(){return this._type;},i.prototype.getId = function(){return this._id + "";},i.prototype.beforeStateChange = function(t,e){return !0;},i.prototype.notifyStateChange = function(t,e){return !0;},i.prototype.afterStateChange = function(t,e){},i.prototype.updateState = function(t){var e=this._state;e !== t && e !== s.DEAD && this.beforeStateChange(e,t) && (this._state = t,this._logger.log('state changed "' + this.getState() + '", position: ' + this.getCurrentPosition() + ", duration: " + this.getDuration()),this.notifyStateChange(e,t) && this.trigger(a.STATE_CHANGE,t,this),this.afterStateChange(e,t));},i.prototype.getState = function(){return this._state;},i.prototype._isInOneOfStates = function(){for(var t in arguments) if(arguments[t] === this.getState())return !0;return !1;},i.prototype.getCurrentPosition = function(){return this._currentPosition;},i.prototype.getLoadedPosition = function(){return this._loadedPosition;},i.prototype.getDuration = function(){return this._duration;};},function(t,e,r){t.exports = r(37);},function(t,e,r){!(function(){function r(){return {keys:Object.keys || function(t){if("object" != typeof t && "function" != typeof t || null === t)throw new TypeError("keys() called on a non-object");var e,r=[];for(e in t) t.hasOwnProperty(e) && (r[r.length] = e);return r;},uniqueId:function uniqueId(t){var e=++a + "";return t?t + e:e;},has:function has(t,e){return o.call(t,e);},each:function each(t,e,r){if(null != t)if(n && t.forEach === n)t.forEach(e,r);else if(t.length === +t.length)for(var i=0,o=t.length;o > i;i++) e.call(r,t[i],i,t);else for(var s in t) this.has(t,s) && e.call(r,t[s],s,t);},once:function once(t){var e,r=!1;return function(){return r?e:(r = !0,e = t.apply(this,arguments),t = null,e);};}};}var i,n=Array.prototype.forEach,o=Object.prototype.hasOwnProperty,s=Array.prototype.slice,a=0,u=r();i = {on:function on(t,e,r){if(!l(this,"on",t,[e,r]) || !e)return this;this._events || (this._events = {});var i=this._events[t] || (this._events[t] = []);return i.push({callback:e,context:r,ctx:r || this}),this;},once:function once(t,e,r){if(!l(this,"once",t,[e,r]) || !e)return this;var i=this,n=u.once(function(){i.off(t,n),e.apply(this,arguments);});return n._callback = e,this.on(t,n,r);},off:function off(t,e,r){var i,n,o,s,a,h,c,f;if(!this._events || !l(this,"off",t,[e,r]))return this;if(!t && !e && !r)return this._events = {},this;for(s = t?[t]:u.keys(this._events),a = 0,h = s.length;h > a;a++) if((t = s[a],o = this._events[t])){if((this._events[t] = i = [],e || r))for(c = 0,f = o.length;f > c;c++) n = o[c],(e && e !== n.callback && e !== n.callback._callback || r && r !== n.context) && i.push(n);i.length || delete this._events[t];}return this;},trigger:function trigger(t){if(!this._events)return this;var e=s.call(arguments,1);if(!l(this,"trigger",t,e))return this;var r=this._events[t],i=this._events.all;return r && c(r,e),i && c(i,arguments),this;},stopListening:function stopListening(t,e,r){var i=this._listeners;if(!i)return this;var n=!e && !r;"object" == typeof e && (r = this),t && ((i = {})[t._listenerId] = t);for(var o in i) i[o].off(e,r,this),n && delete this._listeners[o];return this;}};var h=/\s+/,l=function l(t,e,r,i){if(!r)return !0;if("object" == typeof r){for(var n in r) t[e].apply(t,[n,r[n]].concat(i));return !1;}if(h.test(r)){for(var o=r.split(h),s=0,a=o.length;a > s;s++) t[e].apply(t,[o[s]].concat(i));return !1;}return !0;},c=function c(t,e){var r,i=-1,n=t.length,o=e[0],s=e[1],a=e[2];switch(e.length){case 0:for(;++i < n;) (r = t[i]).callback.call(r.ctx);return;case 1:for(;++i < n;) (r = t[i]).callback.call(r.ctx,o);return;case 2:for(;++i < n;) (r = t[i]).callback.call(r.ctx,o,s);return;case 3:for(;++i < n;) (r = t[i]).callback.call(r.ctx,o,s,a);return;default:for(;++i < n;) (r = t[i]).callback.apply(r.ctx,e);}},f={listenTo:"on",listenToOnce:"once"};u.each(f,function(t,e){i[e] = function(e,r,i){var n=this._listeners || (this._listeners = {}),o=e._listenerId || (e._listenerId = u.uniqueId("l"));return n[o] = e,"object" == typeof r && (i = this),e[t](r,i,this),this;};}),i.bind = i.on,i.unbind = i.off,i.mixin = function(t){var e=["on","once","off","trigger","stopListening","listenTo","listenToOnce","bind","unbind"];return u.each(e,function(e){t[e] = this[e];},this),t;},"undefined" != typeof t && t.exports && (e = t.exports = i),e.BackboneEvents = i;})(this);},function(t,e){t.exports = {PLAYING:"playing",LOADING:"loading",SEEKING:"seeking",PAUSED:"paused",ERROR:"error",IDLE:"idle",INITIALIZE:"initialize",ENDED:"ended",DEAD:"dead"};},function(t,e){t.exports = {POSITION_CHANGE:"position-change",STATE_CHANGE:"state-change",DATA:"data",NETWORK_TIMEOUT:"network-timeout",METADATA:"metadata"};},function(t,e,r){var i,n=r(41),o=null;t.exports = function(t,e,r,s){if(!i && (i = n(!!s.debug,"audiomanager"),o)){var a=i;i = function(){a(o(arguments[0] + "%s",Array.prototype.slice.call(arguments,1)));};}return r = r && r.length?" [" + r.replace(/\s/g,"").substr(0,6) + "]":"",{log:i.bind(null,"%s (%s)%s",t,e,r)};};},function(t,e){function r(){function t(t,r){for(var i,n=arguments.length,o=Array(n > 2?n - 2:0),s=2;n > s;s++) o[s - 2] = arguments[s];"string" == typeof r?r = " " + r:(o.unshift(r),r = ""),(i = window.console)[t].apply(i,[e() + " |" + l + "%c" + r].concat(c,o));}function e(){var t=new Date(),e=null === h?0:t - h;return h = +t,"%c" + n(t.getHours()) + ":" + n(t.getMinutes()) + ":" + n(t.getSeconds()) + "." + i(t.getMilliseconds(),"0",3) + "%c (%c" + i("+" + e + "ms"," ",8) + "%c)";}var r=arguments.length <= 0 || void 0 === arguments[0]?!0:arguments[0],o=arguments.length <= 1 || void 0 === arguments[1]?"":arguments[1];if(!r)return s;var h=null,l=a(o),c=["color: green","color: grey","color: blue","color: grey",u(o),""],f=t.bind(null,"log");return f.log = f,["info","warn","error"].forEach(function(e){f[e] = t.bind(null,e);}),f;}function i(t,e,r){return o(e,r - ("" + t).length) + t;}function n(t){return i(t,"0",2);}function o(t,e){return e > 0?new Array(e + 1).join(t):"";}function s(){}function a(t){return t?"%c" + t:"%c";}t.exports = r,s.log = s.info = s.warn = s.error = s;var u=(function(){var t=["#51613C","#447848","#486E5F","#787444","#6E664E"],e=0;return function(r){return r?"background-color:" + t[e++ % t.length] + ";color:#fff;border-radius:3px;padding:2px 4px;font-family:sans-serif;text-transform:uppercase;font-size:9px;margin:0 4px":"";};})();},function(t,e){function r(t){for(var e in n) if(n.hasOwnProperty(e) && void 0 === t[n[e]])throw new Error("Caps lack required field: " + e);if(!(t[n.PROTOCOLS] instanceof Array))throw new Error("Caps protocols must be an array");if(!(t[n.MIMETYPES] instanceof Array))throw new Error("Caps mimetypes must be an array");return !0;}function i(){var t={};return t[n.MIMETYPES] = [],t[n.PROTOCOLS] = [],t[n.AUDIO_ONLY] = !0,t[n.CAN_SEEK_ALWAYS] = !0,t[n.NEEDS_URL_REFRESH] = !0,t;}var n={MIMETYPES:"mimetypes",PROTOCOLS:"protocols",AUDIO_ONLY:"audioOnly",CAN_SEEK_ALWAYS:"canSeekAlways",NEEDS_URL_REFRESH:"needsUrlRefresh"},o={createDefaults:i,names:n,validate:r};t.exports = o;},function(t,e){t.exports = {FLASH_HLS_PLAYLIST_NOT_FOUND:"HLS_PLAYLIST_NOT_FOUND",FLASH_HLS_PLAYLIST_SECURITY_ERROR:"HLS_SECURITY_ERROR",FLASH_HLS_NOT_VALID_PLAYLIST:"HLS_NOT_VALID_PLAYLIST",FLASH_HLS_NO_TS_IN_PLAYLIST:"HLS_NO_TS_IN_PLAYLIST",FLASH_HLS_NO_PLAYLIST_IN_MANIFEST:"HLS_NO_PLAYLIST_IN_MANIFEST",FLASH_HLS_TS_IS_CORRUPT:"HLS_TS_IS_CORRUPT",FLASH_HLS_FLV_TAG_CORRUPT:"HLS_FLV_TAG_CORRUPT",FLASH_HTTP_FILE_NOT_FOUND:"HTTP_FILE_NOT_FOUND",FLASH_RTMP_CONNECT_FAILED:"RTMP_CONNECT_FAILED",FLASH_RTMP_CONNECT_CLOSED:"RTMP_CONNECT_CLOSED",FLASH_RTMP_CANNOT_PLAY_STREAM:"RTMP_CANNOT_PLAY_STREAM",FLASH_PROXY_CANT_LOAD_FLASH:"CANT_LOAD_FLASH",FLASH_PROXY_FLASH_BLOCKED:"FLASH_PROXY_FLASH_BLOCKED",GENERIC_AUDIO_ENDED_EARLY:"GENERIC_AUDIO_ENDED_EARLY",GENERIC_AUDIO_OVERRUN:"GENERIC_AUDIO_OVERRUN",HTML5_AUDIO_ABORTED:"HTML5_AUDIO_ABORTED",HTML5_AUDIO_NETWORK:"HTML5_AUDIO_NETWORK",HTML5_AUDIO_DECODE:"HTML5_AUDIO_DECODE",HTML5_AUDIO_SRC_NOT_SUPPORTED:"HTML5_AUDIO_SRC_NOT_SUPPORTED",MSE_BAD_OBJECT_STATE:"MSE_BAD_OBJECT_STATE",MSE_NOT_SUPPORTED:"MSE_NOT_SUPPORTED",MSE_MP3_NOT_SUPPORTED:"MSE_MP3_NOT_SUPPORTED",MSE_HLS_NOT_VALID_PLAYLIST:"MSE_HLS_NOT_VALID_PLAYLIST",MSE_HLS_PLAYLIST_NOT_FOUND:"MSE_HLS_PLAYLIST_NOT_FOUND",MSE_HLS_SEGMENT_NOT_FOUND:"MSE_HLS_SEGMENT_NOT_FOUND"};},function(t,e){function r(){if(!q && document.getElementsByTagName("body")[0]){try{var t,e=E("span");e.style.display = "none",t = G.getElementsByTagName("body")[0].appendChild(e),t.parentNode.removeChild(t),t = null,e = null;}catch(r) {return;}q = !0;for(var i=z.length,n=0;i > n;n++) z[n]();}}function i(t){q?t():z[z.length] = t;}function n(t){if(typeof H.addEventListener != N)H.addEventListener("load",t,!1);else if(typeof G.addEventListener != N)G.addEventListener("load",t,!1);else if(typeof H.attachEvent != N)S(H,"onload",t);else if("function" == typeof H.onload){var e=H.onload;H.onload = function(){e(),t();};}else H.onload = t;}function o(){var t=G.getElementsByTagName("body")[0],e=E(k);e.setAttribute("style","visibility: hidden;"),e.setAttribute("type",F);var r=t.appendChild(e);if(r){var i=0;!(function n(){if(typeof r.GetVariable != N)try{var o=r.GetVariable("$version");o && (o = o.split(" ")[1].split(","),J.pv = [v(o[0]),v(o[1]),v(o[2])]);}catch(a) {J.pv = [8,0,0];}else if(10 > i)return i++,void window.setTimeout(n,10);t.removeChild(e),r = null,s();})();}else s();}function s(){var t=V.length;if(t > 0)for(var e=0;t > e;e++) {var r=V[e].id,i=V[e].callbackFn,n={success:!1,id:r};if(J.pv[0] > 0){var o=m(r);if(o)if(!A(V[e].swfVersion) || J.wk && J.wk < 312)if(V[e].expressInstall && u()){var s={};s.data = V[e].expressInstall,s.width = o.getAttribute("width") || "0",s.height = o.getAttribute("height") || "0",o.getAttribute("class") && (s.styleclass = o.getAttribute("class")),o.getAttribute("align") && (s.align = o.getAttribute("align"));for(var c={},f=o.getElementsByTagName("param"),d=f.length,p=0;d > p;p++) "movie" !== f[p].getAttribute("name").toLowerCase() && (c[f[p].getAttribute("name")] = f[p].getAttribute("value"));h(s,c,r,i);}else l(o),i && i(n);else T(r,!0),i && (n.success = !0,n.ref = a(r),n.id = r,i(n));}else if((T(r,!0),i)){var g=a(r);g && typeof g.SetVariable != N && (n.success = !0,n.ref = g,n.id = g.id),i(n);}}}function a(t){var e=null,r=m(t);return r && "OBJECT" === r.nodeName.toUpperCase() && (e = typeof r.SetVariable !== N?r:r.getElementsByTagName(k)[0] || r),e;}function u(){return !$ && A("6.0.65") && (J.win || J.mac) && !(J.wk && J.wk < 312);}function h(t,e,r,i){var n=m(r);if((r = y(r),$ = !0,L = i || null,R = {success:!1,id:r},n)){"OBJECT" === n.nodeName.toUpperCase()?(P = c(n),D = null):(P = n,D = r),t.id = B,(typeof t.width == N || !/%$/.test(t.width) && v(t.width) < 310) && (t.width = "310"),(typeof t.height == N || !/%$/.test(t.height) && v(t.height) < 137) && (t.height = "137");var o=J.ie?"ActiveX":"PlugIn",s="MMredirectURL=" + encodeURIComponent(H.location.toString().replace(/&/g,"%26")) + "&MMplayerType=" + o + "&MMdoctitle=" + encodeURIComponent(G.title.slice(0,47) + " - Flash Player Installation");if((typeof e.flashvars != N?e.flashvars += "&" + s:e.flashvars = s,J.ie && 4 !== n.readyState)){var a=E("div");r += "SWFObjectNew",a.setAttribute("id",r),n.parentNode.insertBefore(a,n),n.style.display = "none",g(n);}d(t,e,r);}}function l(t){if(J.ie && 4 !== t.readyState){t.style.display = "none";var e=E("div");t.parentNode.insertBefore(e,t),e.parentNode.replaceChild(c(t),e),g(t);}else t.parentNode.replaceChild(c(t),t);}function c(t){var e=E("div");if(J.win && J.ie)e.innerHTML = t.innerHTML;else {var r=t.getElementsByTagName(k)[0];if(r){var i=r.childNodes;if(i)for(var n=i.length,o=0;n > o;o++) 1 === i[o].nodeType && "PARAM" === i[o].nodeName || 8 === i[o].nodeType || e.appendChild(i[o].cloneNode(!0));}}return e;}function f(t,e){var r=E("div");return r.innerHTML = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" + t + "'>" + e + "</object>",r.firstChild;}function d(t,e,r){var i,n=m(r);if((r = y(r),J.wk && J.wk < 312))return i;if(n){var o,s,a,u=E(J.ie?"div":k);typeof t.id == N && (t.id = r);for(a in e) e.hasOwnProperty(a) && "movie" !== a.toLowerCase() && p(u,a,e[a]);J.ie && (u = f(t.data,u.innerHTML));for(o in t) t.hasOwnProperty(o) && (s = o.toLowerCase(),"styleclass" === s?u.setAttribute("class",t[o]):"classid" !== s && "data" !== s && u.setAttribute(o,t[o]));J.ie?K[K.length] = t.id:(u.setAttribute("type",F),u.setAttribute("data",t.data)),n.parentNode.replaceChild(u,n),i = u;}return i;}function p(t,e,r){var i=E("param");i.setAttribute("name",e),i.setAttribute("value",r),t.appendChild(i);}function g(t){var e=m(t);e && "OBJECT" === e.nodeName.toUpperCase() && (J.ie?(e.style.display = "none",(function r(){if(4 === e.readyState){for(var t in e) "function" == typeof e[t] && (e[t] = null);e.parentNode.removeChild(e);}else window.setTimeout(r,10);})()):e.parentNode.removeChild(e));}function _(t){return t && t.nodeType && 1 === t.nodeType;}function y(t){return _(t)?t.id:t;}function m(t){if(_(t))return t;var e=null;try{e = G.getElementById(t);}catch(r) {}return e;}function E(t){return G.createElement(t);}function v(t){return parseInt(t,10);}function S(t,e,r){t.attachEvent(e,r),W[W.length] = [t,e,r];}function A(t){t += "";var e=J.pv,r=t.split(".");return r[0] = v(r[0]),r[1] = v(r[1]) || 0,r[2] = v(r[2]) || 0,e[0] > r[0] || e[0] === r[0] && e[1] > r[1] || e[0] === r[0] && e[1] === r[1] && e[2] >= r[2]?!0:!1;}function w(t,e,r,i){var n=G.getElementsByTagName("head")[0];if(n){var o="string" == typeof r?r:"screen";if((i && (O = null,M = null),!O || M !== o)){var s=E("style");s.setAttribute("type","text/css"),s.setAttribute("media",o),O = n.appendChild(s),J.ie && typeof G.styleSheets != N && G.styleSheets.length > 0 && (O = G.styleSheets[G.styleSheets.length - 1]),M = o;}O && (typeof O.addRule != N?O.addRule(t,e):typeof G.createTextNode != N && O.appendChild(G.createTextNode(t + " {" + e + "}")));}}function T(t,e){if(X){var r=e?"visible":"hidden",i=m(t);q && i?i.style.visibility = r:"string" == typeof t && w("#" + t,"visibility:" + r);}}function b(t){var e=/[\\\"<>\.;]/,r=null != e.exec(t);return r && typeof encodeURIComponent != N?encodeURIComponent(t):t;} /*!    SWFObject v2.3.20130521 <http://github.com/swfobject/swfobject>
	    is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
	*/var I,P,D,L,R,O,M,N="undefined",k="object",x="Shockwave Flash",C="ShockwaveFlash.ShockwaveFlash",F="application/x-shockwave-flash",B="SWFObjectExprInst",U="onreadystatechange",H=window,G=document,Y=navigator,j=!1,z=[],V=[],K=[],W=[],q=!1,$=!1,X=!0,Z=!1,J=(function(){var t=typeof G.getElementById != N && typeof G.getElementsByTagName != N && typeof G.createElement != N,e=Y.userAgent.toLowerCase(),r=Y.platform.toLowerCase(),i=r?/win/.test(r):/win/.test(e),n=r?/mac/.test(r):/mac/.test(e),o=/webkit/.test(e)?parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,s="Microsoft Internet Explorer" === Y.appName,a=[0,0,0],u=null;if(typeof Y.plugins != N && typeof Y.plugins[x] == k)u = Y.plugins[x].description,u && typeof Y.mimeTypes != N && Y.mimeTypes[F] && Y.mimeTypes[F].enabledPlugin && (j = !0,s = !1,u = u.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),a[0] = v(u.replace(/^(.*)\..*$/,"$1")),a[1] = v(u.replace(/^.*\.(.*)\s.*$/,"$1")),a[2] = /[a-zA-Z]/.test(u)?v(u.replace(/^.*[a-zA-Z]+(.*)$/,"$1")):0);else if(typeof H.ActiveXObject != N)try{var h=new ActiveXObject(C);h && (u = h.GetVariable("$version"),u && (s = !0,u = u.split(" ")[1].split(","),a = [v(u[0]),v(u[1]),v(u[2])]));}catch(l) {}return {w3:t,pv:a,wk:o,ie:s,win:i,mac:n};})();(function(){J.w3 && ((typeof G.readyState != N && ("complete" === G.readyState || "interactive" === G.readyState) || typeof G.readyState == N && (G.getElementsByTagName("body")[0] || G.body)) && r(),q || (typeof G.addEventListener != N && G.addEventListener("DOMContentLoaded",r,!1),J.ie && (G.attachEvent(U,function t(){"complete" === G.readyState && (G.detachEvent(U,t),r());}),H === top && !(function e(){if(!q){try{G.documentElement.doScroll("left");}catch(t) {return void window.setTimeout(e,0);}r();}})()),J.wk && !(function i(){return q?void 0:/loaded|complete/.test(G.readyState)?void r():void window.setTimeout(i,0);})()));})();z[0] = function(){j?o():s();};(function(){J.ie && window.attachEvent("onunload",function(){for(var t=W.length,e=0;t > e;e++) W[e][0].detachEvent(W[e][1],W[e][2]);for(var r=K.length,i=0;r > i;i++) g(K[i]);for(var n in J) J[n] = null;J = null;for(var o in I) I[o] = null;I = null;});})();t.exports = I = {registerObject:function registerObject(t,e,r,i){if(J.w3 && t && e){var n={};n.id = t,n.swfVersion = e,n.expressInstall = r,n.callbackFn = i,V[V.length] = n,T(t,!1);}else i && i({success:!1,id:t});},getObjectById:function getObjectById(t){return J.w3?a(t):void 0;},embedSWF:function embedSWF(t,e,r,n,o,s,a,l,c,f){var p=y(e),g={success:!1,id:p};J.w3 && !(J.wk && J.wk < 312) && t && e && r && n && o?(T(p,!1),i(function(){r += "",n += "";var i={};if(c && typeof c === k)for(var _ in c) i[_] = c[_];i.data = t,i.width = r,i.height = n;var y={};if(l && typeof l === k)for(var m in l) y[m] = l[m];if(a && typeof a === k)for(var E in a) if(a.hasOwnProperty(E)){var v=Z?encodeURIComponent(E):E,S=Z?encodeURIComponent(a[E]):a[E];typeof y.flashvars != N?y.flashvars += "&" + v + "=" + S:y.flashvars = v + "=" + S;}if(A(o)){var w=d(i,y,e);i.id === p && T(p,!0),g.success = !0,g.ref = w,g.id = w.id;}else {if(s && u())return i.data = s,void h(i,y,e,f);T(p,!0);}f && f(g);})):f && f(g);},switchOffAutoHideShow:function switchOffAutoHideShow(){X = !1;},enableUriEncoding:function enableUriEncoding(t){Z = typeof t === N?!0:t;},ua:J,getFlashPlayerVersion:function getFlashPlayerVersion(){return {major:J.pv[0],minor:J.pv[1],release:J.pv[2]};},hasFlashPlayerVersion:A,createSWF:function createSWF(t,e,r){return J.w3?d(t,e,r):void 0;},showExpressInstall:function showExpressInstall(t,e,r,i){J.w3 && u() && h(t,e,r,i);},removeSWF:function removeSWF(t){J.w3 && g(t);},createCSS:function createCSS(t,e,r,i){J.w3 && w(t,e,r,i);},addDomLoadEvent:i,addLoadEvent:n,getQueryParamValue:function getQueryParamValue(t){var e=G.location.search || G.location.hash;if(e){if((/\?/.test(e) && (e = e.split("?")[1]),null == t))return b(e);for(var r=e.split("&"),i=0;i < r.length;i++) if(r[i].substring(0,r[i].indexOf("=")) === t)return b(r[i].substring(r[i].indexOf("=") + 1));}return "";},expressInstallCallback:function expressInstallCallback(){if($){var t=m(B);t && P && (t.parentNode.replaceChild(P,t),D && (T(D,!0),J.ie && (P.style.display = "block")),L && L(R)),$ = !1;}},version:"2.3"};},function(t,e,r){function i(t,e,r,i){if(r !== s && r !== o && void 0 !== r)throw new Error("Can not use the provided base class");this._baseclass = r || o,this._baseclass.call(this,t,e,i || "HLSAudioPlayer"),this._seekPosition = 0;}var n=r(1),o=r(46),s=r(48),a=r(38);t.exports = i,n(i.prototype,o.prototype),i.prototype.seek = function(t){this._baseclass.prototype.seek.apply(this,arguments),this._isInOneOfStates(a.LOADING,a.SEEKING) && (this._seekPosition = t);},i.prototype.getCurrentPosition = function(){if(this._isInOneOfStates(a.LOADING) && this._seekPosition > 0)return this._seekPosition;if(this._isInOneOfStates(a.PLAYING,a.SEEKING)){if(this._seekPosition >= this._currentPosition)return this._seekPosition;this._seekPosition = 0;}return this._baseclass.prototype.getCurrentPosition.apply(this,arguments);};},function(t,e,r){function i(t,e,r){this._duration = 0,this._currentPosition = 0,this._loadedPosition = 0,h.prototype.constructor.call(this,r || "HTML5AudioPlayer",t,e),this._isLoaded = !1,this._prevCurrentPosition = 0,this._prevCheckTime = 0,this._positionUpdateTimer = 0,this._playRequested = !1,this._startFromPosition = 0,this.getDescriptor().duration && (this._duration = this.getDescriptor().duration),this._bindHandlers(),this._initMediaElement(),this.updateState(s.IDLE);}var n=r(1),o=r(47).bindAll,s=r(38),a=r(39),u=r(43),h=r(35),l=r(16);t.exports = i,n(i.prototype,h.prototype),i.MediaAPIEvents = ["ended","play","playing","pause","seeking","waiting","seeked","error","loadeddata","loadedmetadata"],i.prototype.play = function(t){return this._isInOneOfStates(s.ERROR,s.DEAD)?void this._logger.log("play called but state is ERROR or DEAD"):(this._logger.log("play from " + t),this._startFromPosition = t || 0,this._playRequested = !0,this._isInOneOfStates(s.PAUSED,s.ENDED)?void this.resume():(this.updateState(s.LOADING),this._html5Audio.readyState > 0 && this._onLoadedMetadata(),this._html5Audio.readyState > 1 && this._onLoaded(),void (this._isLoaded?this._playAfterLoaded():this.once(a.DATA,this._playAfterLoaded))));},i.prototype.pause = function(){this._isInOneOfStates(s.ERROR,s.DEAD) || (this._logger.log("pause"),this._playRequested = !1,this._html5Audio && this._html5Audio.pause());},i.prototype.seek = function(t){var e,r=!1,i=t / 1e3,n=this._html5Audio.seekable;if(!this._isInOneOfStates(s.ERROR,s.DEAD)){if(!this._isLoaded)return this.once(a.DATA,function(){this.seek(t);}),void this._logger.log("postponing seek for when loaded");if(l.isIE10Mobile)r = !0;else for(e = 0;e < n.length;e++) if(i <= n.end(e) && i >= n.start(e)){r = !0;break;}if(!r)return void this._logger.log("can not seek");this._logger.log("seek"),this.updateState(s.SEEKING),this._html5Audio.currentTime = i,this._currentPosition = t,this._lastMediaClockCheck = null;}},i.prototype.resume = function(){return this._isInOneOfStates(s.ERROR,s.DEAD)?void this._logger.log("resume called but state is ERROR or DEAD"):(this._logger.log("resume"),void (this.getState() === s.PAUSED?(this.updateState(s.PLAYING),this._html5Audio.play(this._html5Audio.currentTime)):this.getState() === s.ENDED && this._html5Audio.play(0)));},i.prototype.setVolume = function(t){this._html5Audio && (this._html5Audio.volume = t);},i.prototype.getVolume = function(){return this._html5Audio?this._html5Audio.volume:1;},i.prototype.setMute = function(t){this._html5Audio && (this._html5Audio.muted = t);},i.prototype.getMute = function(){return this._html5Audio?this._html5Audio.muted:!1;},i.prototype.kill = function(){this._state !== s.DEAD && (this._logger.log("killing ..."),this._resetPositionInterval(!1),this._playRequested = !1,this._toggleEventListeners(!1),this.pause(),delete this._html5Audio,this.updateState(s.DEAD),this._logger.log("dead"));},i.prototype.getErrorMessage = function(){return this._errorMessage;},i.prototype.getErrorID = function(){return this._errorID;},i.prototype._bindHandlers = function(){o(this,["_onPositionChange","_onHtml5MediaEvent","_onLoaded","_onLoadedMetadata"]);},i.prototype._initMediaElement = function(){this._html5Audio = l.createAudioElement(),this._html5Audio.id = this.getSettings().audioObjectID + "_" + this.getId(),this._html5Audio.preload = "auto",this._html5Audio.type = this.getDescriptor().mimeType,this._html5Audio.src = this.getDescriptor().src,this._html5Audio.load(),this._toggleEventListeners(!0);},i.prototype._playAfterLoaded = function(){this._playRequested && (this._trySeekToStartPosition(),this._html5Audio.play());},i.prototype._isInOneOfStates = function(){for(var t in arguments) if(arguments[t] === this._state)return !0;return !1;},i.prototype._toggleEventListeners = function(t){if(this._html5Audio){var e=t?"addEventListener":"removeEventListener";i.MediaAPIEvents.forEach(function(t){switch(t){case "loadeddata":this._html5Audio[e]("loadeddata",this._onLoaded);break;case "loadedmetadata":this._html5Audio[e]("loadedmetadata",this._onLoadedMetadata);break;default:this._html5Audio[e](t,this._onHtml5MediaEvent);}},this);}},i.prototype._trySeekToStartPosition = function(){var t;return this._startFromPosition > 0 && (this._logger.log("seek to start position: " + this._startFromPosition),t = this._startFromPosition / 1e3,this._html5Audio.currentTime = t,this._html5Audio.currentTime === t)?(this._lastMediaClockCheck = null,this._currentPosition = this._startFromPosition,this._startFromPosition = 0,!0):!1;},i.prototype._onLoaded = function(){this._logger.log("HTML5 media loadeddata event"),this.trigger(a.DATA,this);},i.prototype._onLoadedMetadata = function(){this._logger.log("HTML5 media loadedmetadata event"),(void 0 === this._duration || 0 === this._duration) && (this._duration = 1e3 * this._html5Audio.duration),this._loadedPosition = this._duration,this._isLoaded = !0,this.trigger(a.METADATA,this);},i.prototype._resetPositionInterval = function(t){window.clearInterval(this._positionUpdateTimer),t && (this._positionUpdateTimer = window.setInterval(this._onPositionChange,this.getSettings().updateInterval));},i.prototype._onPositionChange = function(){if(!this._isInOneOfStates(s.DEAD)){var t;Date.now();return this._currentPosition = 1e3 * this._html5Audio.currentTime,this.trigger(a.POSITION_CHANGE,this.getCurrentPosition(),this._loadedPosition,this._duration,this),this._isInOneOfStates(s.PLAYING,s.LOADING)?0 !== this._duration && (this._currentPosition > this._duration || this._currentPosition > this._loadedPosition && !l.isIE10Mobile)?void this._onHtml5MediaEvent({type:"ended"}):this.getState() !== s.PLAYING || this._mediasHasProgressed()?void (this.getState() !== s.PLAYING && this._mediasHasProgressed() && this.updateState(s.PLAYING)):(this._logger.log("media clock check failed, playhead is not advancing anymore"),void this.updateState(s.LOADING)):void (this._state === s.SEEKING && t > 0 && this.updateState(s.PLAYING));}},i.prototype._mediasHasProgressed = function(){var t=!1,e=Date.now();if(this._lastMediaClockCheck){var r=e - this._lastMediaClockCheck,i=this._currentPosition - this._lastMediaClockValue;if(.1 * r > i){if(0 === i && 50 > r)return !0;t = !0;}}return this._lastMediaClockValue = this._currentPosition,this._lastMediaClockCheck = e,!t;},i.prototype._onHtml5MediaEvent = function(t){switch((this._logger.log("HTML5 media event: " + t.type),t.type)){case "playing":if(this._trySeekToStartPosition())break;this._onPositionChange(),this._resetPositionInterval(!0),this.updateState(s.PLAYING);break;case "pause":this._onPositionChange(),this._resetPositionInterval(!1),this.updateState(s.PAUSED);break;case "ended":this._currentPosition = this._loadedPosition = this._duration,this._resetPositionInterval(!1),this.updateState(s.ENDED);break;case "waiting":if(this.getState() === s.SEEKING)break;this.updateState(s.LOADING);break;case "seeking":this.updateState(s.SEEKING);break;case "seeked":this._html5Audio.paused?this.updateState(s.PAUSED):this.updateState(s.PLAYING),this._onPositionChange(t);break;case "error":this._error(this._html5AudioErrorCodeToErrorId(),!0);}},i.prototype._html5AudioErrorCodeToErrorId = function(){return ({1:u.HTML5_AUDIO_ABORTED,2:u.HTML5_AUDIO_NETWORK,3:u.HTML5_AUDIO_DECODE,4:u.HTML5_AUDIO_SRC_NOT_SUPPORTED})[this._html5Audio.error.code];},i.prototype._error = function(t,e){var r="error: ";e && (r = "error (native): "),this._errorID = t,this._errorMessage = this._getErrorMessage(this._errorID),this._logger.log(r + this._errorID + " " + this._errorMessage),this.updateState(s.ERROR),this._toggleEventListeners(!1);},i.prototype._getErrorMessage = function(t){var e={};return e[u.HTML5_AUDIO_ABORTED] = "The fetching process for the media resource was aborted by the user agent at the user's request.",e[u.HTML5_AUDIO_NETWORK] = "A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.",e[u.HTML5_AUDIO_DECODE] = "An error of some description occurred while decoding the media resource, after the resource was established to be usable.",e[u.HTML5_AUDIO_SRC_NOT_SUPPORTED] = "The media resource indicated by the src attribute was not suitable.",e[t];};},function(t,e){function r(t,e){var r=new Uint8Array(t.byteLength + e.byteLength);return r.set(new Uint8Array(t),0),r.set(new Uint8Array(e),t.byteLength),r;}t.exports = {bindAll:function bindAll(t,e){e.forEach(function(e){t[e] = t[e].bind(t);});},concatBuffersToUint8Array:r};},function(t,e,r){function i(t,e,r){u.prototype.constructor.call(this,t,e,r || "HTML5SingleAudioPlayer");}var n,o=r(1),s=r(16),a=r(39),u=r(46),h=r(38),l={};t.exports = i,o(i.prototype,u.prototype),i._onLoaded = function(t){i._pauseOthersAndForwardEvent("_onLoaded",t);},i._onLoadedMetadata = function(t){i._pauseOthersAndForwardEvent("_onLoadedMetadata",t);},i._onHtml5MediaEvent = function(t){i._pauseOthersAndForwardEvent("_onHtml5MediaEvent",t);},i._pauseOthersAndForwardEvent = function(t,e){Object.keys(l).forEach(function(r){var i=l[r];r === n?i[t](e):i.pause();});},i.prototype._initMediaElement = function(){i._html5Audio || (i._html5Audio = s.createAudioElement(),i._html5Audio.id = this.getSettings().audioObjectID + "_Single",u.prototype._toggleEventListeners.call(i,!0)),this._toggleEventListeners(!0),this._html5Audio = i._html5Audio,this._logger.log("initialized player for use with: " + this.getDescriptor().src);},i.prototype._toggleEventListeners = function(t){t?l[this.getId()] = this:delete l[this.getId()];},i.prototype.play = function(t){this._logger.log("singleton play at: " + t),(0 === this._html5Audio.readyState || this.getDescriptor().src !== this._html5Audio.src) && (this._logger.log("setting up audio element for use with: " + this.getDescriptor().src),n = this.getId(),this._isInOneOfStates(h.PAUSED) && (this._logger.log("state was paused"),t = this._currentPosition || 0),this._toggleEventListeners(!0),this._html5Audio.preload = "auto",this._html5Audio.type = this.getDescriptor().mimeType,this._html5Audio.src = this.getDescriptor().src,this._html5Audio.load()),u.prototype.play.call(this,t);},i.prototype.resume = function(){return this._isInOneOfStates(h.ERROR,h.DEAD)?void 0:n !== this.getId()?void this.play(this._currentPosition):void u.prototype.resume.apply(this,arguments);},i.prototype.pause = function(){this._isInOneOfStates(h.ERROR,h.DEAD) || (this._logger.log("singleton pause"),n === this.getId()?u.prototype.pause.apply(this,arguments):(this._toggleEventListeners(!1),this._isInOneOfStates(h.PAUSED) || this.updateState(h.PAUSED),this._resetPositionInterval(!1)));},i.prototype.seek = function(t){return n !== this.getId()?(this._currentPosition = t,void this.trigger(a.POSITION_CHANGE,this._currentPosition,this._loadedPosition,this._duration,this)):void u.prototype.seek.apply(this,arguments);};},function(t,e,r){function i(t,e){o.call(this,t,e,s,"HLSSingleAudioPlayer");}var n=r(1),o=r(45),s=r(48);t.exports = i,n(i.prototype,s.prototype,o.prototype);},function(t,e,r){function i(t,e){return u.prototype.constructor.call(this,"HLSMSEPlayer",t,e,w()),o(this,["_onPositionChange","_onPlaylistLoaded","_onPlaylistFailed","_onSegmentLoaded","_onSegmentProgress","_onSegmentFailed","_onHtml5MediaEvent","_onLoadedData","_onLoadedMetadata","_onMediaSourceAppend","_onMediaSourceReady","_onMediaSourceDestroy","_onMediaSourceError"]),this._streamUrlProvider = this.getSettings().streamUrlProvider || null,this._minPreBufferLengthForPlayback = 5e3,this._maxBufferLength = 3e4,this._streamUrlRetryTimer = null,this._streamUrlTimesFailed = 0,this._playlistRetryTimer = null,this._playlistTimesFailed = 0,this._playlistRefreshInProgress = !1,this._isPlaylistLoaded = !1,this._loadOnInit = !1,this._schedulingSegmentIndex = -1,this._segmentsDownloading = [],this._nextSchedulingTimeout = null,this._mimeType = T(),this._mimeType?(this._mseToolkit = new c(this._logger,this._mimeType),this._mseToolkit.on(c.Events.SEGMENT_APPENDED,this._onMediaSourceAppend),this._mseToolkit.on(c.Events.SOURCE_READY,this._onMediaSourceReady),this._mseToolkit.on(c.Events.SOURCE_DESTROY,this._onMediaSourceDestroy),this._mseToolkit.on(c.Events.SOURCE_ERROR,this._onMediaSourceError),this._hlsToolkit = new l(this._logger,this.getDescriptor().src),this._hlsToolkit.on(l.Events.SEGMENT_LOADED,this._onSegmentLoaded),this._hlsToolkit.on(l.Events.SEGMENT_PROGRESS,this._onSegmentProgress),this._hlsToolkit.on(l.Events.SEGMENT_FAILED,this._onSegmentFailed),this._hlsToolkit.on(l.Events.PLAYLIST_LOADED,this._onPlaylistLoaded),this._hlsToolkit.on(l.Events.PLAYLIST_FAILED,this._onPlaylistFailed),this._hlsToolkit.on(l.Events.PLAYLIST_PARSE_ERROR,this._onPlaylistFailed),this._html5Audio = this._mseToolkit.media(),void this._toggleEventListeners(!0)):void this._error(a.MSE_NOT_SUPPORTED);}var n=r(1),o=r(47).bindAll,s=r(39),a=r(43),u=r(35),h=r(46),l=r(51),c=r(66),f=r(67),d=r(38),p=r(42),g=r(128),_=r(129),y=r(16),m=200,E=500,v=3,S=1e4,A=function A(t){var e=t / v,r=E * (Math.pow(Math.E,e) / Math.E);return r += Math.random() * m,r > S && (r = S),r;},w=function w(){var t={};return t[p.names.PROTOCOLS] = [g.HLS],t[p.names.MIMETYPES] = [_.HLS,_.M3U8,_.MP3],t[p.names.NEEDS_URL_REFRESH] = !1,t;},T=function T(){return y.isMSESupportMPEG() && !y.isNativeHlsSupported()?"audio/mpeg":y.isMSESupportMP4()?"audio/mp4":null;};t.exports = i,n(i.prototype,u.prototype),i.prototype._onLoadedData = function(){this._logger.log("loadeddata event handler"),this.trigger(s.DATA);},i.prototype._onLoadedMetadata = function(){this._logger.log("loadedmetadata event handler");},i.prototype._mediasHasProgressed = function(){var t=!1,e=Date.now();if(this._lastMediaClockCheck){var r=e - this._lastMediaClockCheck,i=this._currentPosition - this._lastMediaClockValue;if(.1 * r > i){if(0 === i && 50 > r)return !0;t = !0;}}return this._lastMediaClockValue = this._currentPosition,this._lastMediaClockCheck = e,!t;},i.prototype._onPositionChange = function(){return this._html5Audio && this.getState() !== d.SEEKING?(this._currentPosition = 1e3 * this._html5Audio.currentTime,this.getState() !== d.PLAYING || this._mediasHasProgressed()?(this.getState() !== d.PLAYING && this._mediasHasProgressed() && this.updateState(d.PLAYING),this._triggerPositionEvent(),this._currentPosition >= this._duration?void this.updateState(d.ENDED):void 0):(this._logger.log("media clock check failed, playhead is not advancing anymore"),void this.updateState(d.LOADING))):void 0;},i.prototype._onMediaSourceReady = function(){this.getDescriptor().duration && (this._setDuration(this.getDescriptor().duration),this._logger.log("duration set from descriptor to " + this._duration)),this.updateState(d.IDLE),this._loadOnInit && this._loadInitialPlaylist();},i.prototype._onMediaSourceDestroy = function(){this.kill();},i.prototype._onMediaSourceError = function(t){this._logger.log("MediaSource API error: " + t.message),this._error(a.MSE_BAD_OBJECT_STATE),this.kill();},i.prototype._onMediaSourceAppend = function(t){this._logger.log("segment appended: " + t.index),this.trigger(s.DATA,t),this._loadedPosition = t.endPosition,this._playRequested && (this._logger.log("triggering playback after appending enough segments"),this._html5Audio.play(this._currentPosition));},i.prototype._onSegmentProgress = function(t){var e=Math.round(t.loaded / t.total * 100);this._logger.log("segment " + t.index + " loaded " + t.loaded + " of " + t.total + " bytes (" + e + "%)"),this._loadedPosition = t.endPosition - t.duration * (t.loaded / t.total);},i.prototype._onSegmentLoaded = function(t){return this._mseToolkit.sourceIsReady()?void this._appendSegments():void this._logger.log("we have been disposed while loading a segment, noop");},i.prototype._onSegmentFailed = function(t){switch((this._logger.log("segment loading failed handler: " + t.status),t.status)){case l.Status.NOT_FOUND:case l.Status.FORBIDDEN:this._cancelNextScheduling(),this._cancelAllInFlightRequests(),this._refreshPlaylist();break;case l.Status.TIMEOUT:this.trigger(s.NETWORK_TIMEOUT);case l.Status.SERVER_ERROR:if(t.aborted){this._logger.log("aborted segment has been prevented from being retried");break;}t.scheduleRetry(A(t.timesFailed),this._hlsToolkit.loadSegment,this._hlsToolkit);break;case l.Status.FAILED:this._logger.log("WARNING: segment loading failed for unknown reason!");break;default:throw new Error("Invalid status on failed segment: " + t.status);}},i.prototype._onPlaylistLoaded = function(){return this._logger.log("playlist loaded handler"),this._mseToolkit.sourceIsReady()?(this._playlistRefreshInProgress && (this._cancelNextScheduling(),this._runScheduling()),this._playlistRefreshInProgress = !1,this._playlistTimesFailed = 0,this._isPlaylistLoaded = !0,this._inspectEncryptionData(),this._setDuration(this._hlsToolkit.getDuration()),this._logger.log("duration set from playlist info to " + this._duration),void this.trigger(s.METADATA)):void this._logger.log("we have been disposed while loading the playlist, noop");},i.prototype._onPlaylistFailed = function(t){return this._logger.log("playlist loading failed handler. HTTP status code is " + t),this._mseToolkit.sourceIsReady()?(this._logger.log("Playlist loading failed  " + this._playlistTimesFailed + " times before"),this._playlistTimesFailed++,this._playlistRetryTimer = window.setTimeout((function(){this.hasStreamUrlProvider()?this._refreshPlaylist():this._hlsToolkit.updatePlaylist();}).bind(this),A(this._playlistTimesFailed)),void (0 === t && this.trigger(s.NETWORK_TIMEOUT))):void this._logger.log("we have been disposed while loading the playlist, noop");},i.prototype.afterStateChange = function(t,e){switch(e){case d.PLAYING:this._runScheduling();break;case d.PAUSED:this._cancelNextScheduling();}},i.prototype._onHtml5MediaEvent = function(t){switch((this._logger.log('HTML5 media event "' + t.type + '"'),this._waitingToPause = !1,t.type)){case "playing":this._playRequested = !1,this._triggerPositionEvent(),this._resetPositionTimer(!0),this.updateState(d.PLAYING);break;case "pause":this._triggerPositionEvent(),this._resetPositionTimer(!1),this.updateState(d.PAUSED);break;case "ended":this._currentPosition = this._loadedPosition = this._duration,this._triggerPositionEvent(),this._resetPositionTimer(!1),this.updateState(d.ENDED);break;case "waiting":if(this.getState() === d.SEEKING)break;this.updateState(d.LOADING);break;case "seeking":this._triggerPositionEvent(),this.updateState(d.SEEKING);break;case "seeked":this._html5Audio.paused?this.updateState(d.PAUSED):this.updateState(d.PLAYING),this._onPositionChange();break;case "error":this._error(this._html5AudioErrorCodeToErrorId(),!0);}},i.prototype._toggleEventListeners = function(t){if(this._html5Audio){var e=t?"addEventListener":"removeEventListener";h.MediaAPIEvents.forEach(function(t){switch(t){case "loadeddata":this._html5Audio[e]("loadeddata",this._onLoadedData);break;case "loadedmetadata":this._html5Audio[e]("loadedmetadata",this._onLoadedMetadata);break;case "timeupdate":default:this._html5Audio[e](t,this._onHtml5MediaEvent);}},this);}},i.prototype._loadInitialPlaylist = function(){this.updateState(d.LOADING),this._hlsToolkit.updatePlaylist();},i.prototype._refreshPlaylist = function(){this.hasStreamUrlProvider() && (this._playlistRefreshfInProgress || (this._playlistRefreshInProgress = !0,this._streamUrlProvider().done((function(t){this._logger.log("got new M3u8 URL: " + t),this._streamUrlTimesFailed = 0,this._hlsToolkit.setUri(t),this._hlsToolkit.updatePlaylist();}).bind(this)).fail((function(){this._logger.log("failed to retrieve stream URL :("),this._streamUrlRetryTimer = window.setTimeout((function(){this._playlistRefreshInProgress = !1,this._refreshPlaylist();}).bind(this),A(++this._streamUrlTimesFailed));}).bind(this))));},i.prototype._setDuration = function(t){this._duration = t;try{this._mseToolkit.duration(this._duration);}catch(e) {this._onMediaSourceError(e);}},i.prototype._resetPositionTimer = function(t){window.clearInterval(this._positionUpdateTimer),t && (this._positionUpdateTimer = window.setInterval(this._onPositionChange,this.getSettings().updateInterval));},i.prototype._triggerPositionEvent = function(){this.trigger(s.POSITION_CHANGE,this._currentPosition,this._loadedPosition,this._duration,this);},i.prototype._initTransmuxerOnce = function(t,e){if(!this._transmuxer){var r=this._mimeType !== t.mimeType?f.Configs.MP3_TO_FMP4:f.Configs.VOID;this._transmuxer = new f(r),this._transmuxer.on("segment",(function(t){this._logger.log("transmuxed data ready, " + t.data.length + " bytes for segment " + t.index),e(t);}).bind(this));}},i.prototype._transmuxSegment = function(t,e){this._logger.log("transmuxing segment " + t.index),this._initTransmuxerOnce(t,e),this._transmuxer.process(t);},i.prototype._appendSegments = function(){var t=!0;this._segmentsDownloading.slice().forEach(function(e){e.isComplete() && t?(this._decryptSegment(e),this._transmuxSegment(e,(function(t){this._mseToolkit.append(t);}).bind(this)),this._segmentsDownloading.shift()):t = !1;},this);},i.prototype._cancelNextScheduling = function(){this._logger.log("cancelling next scheduling"),window.clearTimeout(this._nextSchedulingTimeout),this._nextSchedulingTimeout = null;},i.prototype._getBufferUntilTime = function(){return this._currentPosition + this._maxBufferLength;},i.prototype._getCurrentSegment = function(){return this._schedulingSegmentIndex > 0?this._hlsToolkit.getSegment(this._schedulingSegmentIndex):this._hlsToolkit.getSegmentForTime(this._currentPosition);},i.prototype._runScheduling = function(){function t(){var e=!1,r=this._getBufferUntilTime(),i=this._getCurrentSegment(),n=i?i.duration:Math.Infinity;if((this._logger.log("scheduling next requests, current buffer-until time: " + r + " ms"),!i))return void this._logger.log("no segment to schedule, closing loop");for(this._logger.log("current segment index: " + i.index);i.endPosition <= r;) {if((this._logger.log("scheduling loop at " + this._currentPosition + " ms, current segment " + i.index),this._requestSegment(i),i.isLast)){e = !0,this._logger.log("end of playlist reached");break;}this._schedulingSegmentIndex = i.index + 1,i = this._hlsToolkit.getSegment(this._schedulingSegmentIndex);}this._isInOneOfStates(d.DEAD,d.PAUSED) || e?(this._logger.log("not re-scheduling"),this._nextSchedulingTimeout = null):(this._logger.log("timing next check for more data in " + n + " ms"),this._nextSchedulingTimeout = window.setTimeout(t.bind(this),n));}this._nextSchedulingTimeout || t.call(this);},i.prototype._cancelAllInFlightRequests = function(){this._schedulingSegmentIndex = -1,this._segmentsDownloading.forEach(function(t){t.isComplete() || t.cancel();}),this._segmentsDownloading = [];},i.prototype._requestSegment = function(t){return this._segmentsDownloading.push(t),t.isComplete()?(this._logger.log("requested data is already loaded from segment " + t.index),void this._onSegmentLoaded(t)):t.hasBeenRequested() || t.hasFailed()?void this._logger.log("segment already in flight or failed (will retry): " + t.timesFailed + " times"):void this._hlsToolkit.loadSegment(t);},i.prototype._decryptSegment = function(t){this._hlsToolkit.isAES128Encrypted() && this._hlsToolkit.decryptSegmentAES128(t);},i.prototype._inspectEncryptionData = function(){this._hlsToolkit.isAES128Encrypted() && (this._logger.log("got key of byte length " + this._hlsToolkit.getEncryptionKey().byteLength),this._hlsToolkit.getEncryptionIv()?this._logger.log("got IV of byte length " + this._hlsToolkit.getEncryptionIv().byteLength):this._logger.log("no IV found in header, will use per-segment-index IV"));},i.prototype._html5AudioErrorCodeToErrorId = function(){return ({1:a.HTML5_AUDIO_ABORTED,2:a.HTML5_AUDIO_NETWORK,3:a.HTML5_AUDIO_DECODE,4:a.HTML5_AUDIO_SRC_NOT_SUPPORTED})[this._html5Audio.error.code];},i.prototype._error = function(t,e){this._errorID = t,this._errorMessage = this._getErrorMessage(this._errorID),e && this._html5Audio.error && (this._errorMessage += " (native message: " + this._html5Audio.error.message + ")"),this._logger.log(this._errorID + " " + this._errorMessage),this.updateState(d.ERROR),this._toggleEventListeners(!1);},i.prototype._getErrorMessage = function(t){var e={};return e[a.MSE_NOT_SUPPORTED] = "The browser does not support MediaSource API",e[a.MSE_BAD_OBJECT_STATE] = "MediaSource API has thrown an exception",e[t]?"Error: " + t + " (" + e[t] + ")":"Error: " + t;},i.prototype.setVolume = function(t){this._html5Audio && (this._html5Audio.volume = t);},i.prototype.getVolume = function(){return this._html5Audio?this._html5Audio.volume:1;},i.prototype.setMute = function(t){this._html5Audio && (this._html5Audio.muted = t);},i.prototype.getMute = function(){return this._html5Audio?this._html5Audio.muted:!1;},i.prototype.getErrorID = function(){return this._errorID;},i.prototype.play = function(t){return this._isInOneOfStates(d.ERROR,d.DEAD)?void this._logger.log("play called but state is ERROR or DEAD"):this._isInOneOfStates(d.IDLE,d.INITIALIZE)?(t = t || 0,this._logger.log("play from " + t),this._playRequested = !0,this.seek(t),this.getState() === d.INITIALIZE?void (this._loadOnInit = !0):void this._loadInitialPlaylist()):void this.resume();},i.prototype.pause = function(){this._html5Audio && (this._playRequested = !1,this._html5Audio.pause());},i.prototype.seek = function(t){if(!this._isInOneOfStates(d.ERROR,d.DEAD)){if(!this._isPlaylistLoaded)return void this.once(s.METADATA,(function(){this.seek(t);}).bind(this));if(t > this._duration)return void this._logger.log("can not seek to position over duration");this._logger.log("seek to " + t + " ms"),this.updateState(d.SEEKING),this._lastMediaClockCheck = null,this._currentPosition = t;try{this._html5Audio.currentTime = t / 1e3;}catch(e) {this._logger.log("error seeking: " + e.message);}this._cancelAllInFlightRequests(),this._cancelNextScheduling(),this._runScheduling();}},i.prototype.resume = function(){this._html5Audio && (this._logger.log("resume from " + this._currentPosition),this._html5Audio.play(1e3 * this._currentPosition));},i.prototype.kill = function(){this.getState() !== d.DEAD && (this._logger.log("kill"),this._resetPositionTimer(!1),this._cancelNextScheduling(),this._cancelAllInFlightRequests(),window.clearTimeout(this._playlistRetryTimer),window.clearTimeout(this._streamUrlRetryTimer),this._playRequested = !1,this._toggleEventListeners(!1),this._html5Audio.pause(),this.updateState(d.DEAD));},i.prototype.getErrorMessage = function(){return this._errorMessage;},i.prototype.hasStreamUrlProvider = function(){return !!this._streamUrlProvider;};},function(t,e,r){var i,n=r(1),o=r(52),s=r(58),a=null,u=r(36),h={NEW:"new",REQUESTED:"requested",COMPLETE:"complete",TIMEOUT:"timeout",FORBIDDEN:"forbidden",NOT_FOUND:"not-found",SERVER_ERROR:"server-error",FAILED:"failed"},l={FIRST:"#EXTM3U",PLAYLIST:"#EXT-X-STREAM-INF:",SEGMENT:"#EXTINF:",END_TAG:"#EXT-X-ENDLIST",ENCRYPTION:"#EXT-X-KEY:"};t.exports = i = function(t,e){this._logger = t,this._duration = 0,this.setUri(e);},i.Events = {PLAYLIST_LOADED:"playlist-loaded",PLAYLIST_PARSE_ERROR:"playlist-parse-error",PLAYLIST_FAILED:"playlist-failed",SEGMENT_LOADED:"segment-loaded",SEGMENT_PROGRESS:"segment-progress",SEGMENT_FAILED:"segment-failed",SEGMENT_CANCELED:"segment-canceled"},i.Status = h,n(i.prototype,u),i.Segment = function(t,e,r,i,o){n(this,{toolkit:t,uri:e,startPosition:r,endPosition:r + i,duration:i,index:o,data:null,status:h.NEW,isLast:!1,timesFailed:0,loaded:0,total:-1,aborted:!1,xhr:null,mimeType:"audio/mpeg"}),this._logger = t._logger;},i.Segment.prototype.containsTime = function(t){return t >= this.startPosition && t <= this.endPosition;},i.Segment.prototype.isComplete = function(){return this.status === h.COMPLETE;},i.Segment.prototype.hasFailed = function(){return this.status === h.TIMEOUT || this.status === h.FORBIDDEN || this.status === h.NOT_FOUND || this.status === h.SERVER_ERROR || this.status === h.FAILED;},i.Segment.prototype.isNew = function(){return this.status === h.NEW;},i.Segment.prototype.hasBeenRequested = function(){return this.status === h.REQUESTED;},i.Segment.prototype.scheduleRetry = function(t,e,r){var i=this;this._retryTimer = window.setTimeout(function(){e.call(r,i);},t);},i.Segment.prototype.cancel = function(){this._logger.log("segment cancelled, clearing timeout: " + this.index),window.clearTimeout(this._retryTimer),this.xhr && (this._logger.log("will abort & reset segment: " + this.index),this.status = h.NEW,this.aborted = !0,this.data = null,this.timesFailed = 0,this.xhr.abort(),this.xhr = null,this.toolkit.trigger(i.Events.SEGMENT_CANCELED,this));},i.prototype.setUri = function(t){var e=this._uri = t;e.indexOf("?") > -1 && (e = e.substr(0,e.indexOf("?"))),this._baseURI = e.substr(0,e.lastIndexOf("/") + 1);},i.prototype.updatePlaylist = function(){var t=!1,e=new XMLHttpRequest();e.open("GET",this._uri,!0),e.responseType = "text",this._logger.log("downloading playlist");var r=(function(r){t || (t = !0,this.trigger(i.Events.PLAYLIST_FAILED,e.status));}).bind(this);e.onload = (function(t){return 200 !== e.status?void r():(this._segments = [],this._duration = 0,this._parsePlaylist(e.responseText)?(this.getLastSegment().isLast = !0,this._logger.log("playlist download complete"),void this._retrieveEncryptionKey(function(){this.trigger(i.Events.PLAYLIST_LOADED);})):(this._logger.log("error parsing playlist"),void this.trigger(i.Events.PLAYLIST_PARSE_ERROR)));}).bind(this),e.onerror = (function(t){r(t);}).bind(this),e.send();},i.prototype._parsePlaylist = function(t){for(var e,r,n,o=t.split("\n"),s=!1,a=0,u=0;a < o.length;) e = o[a++],0 === e.indexOf(l.SEGMENT)?(n = 1e3 * Number(e.substr(8,e.indexOf(",") - 8)),r = this._createSegmentURL(o[a]),this._addSegment(new i.Segment(this,r,this._duration,n,u++)),a++):0 === e.indexOf(l.ENCRYPTION)?this._parsePlaylistEncryptionHeader(e):0 === e.indexOf(l.END_TAG) && (s = !0);return 0 !== this.getNumSegments() && s?!0:!1;},i.prototype._addSegment = function(t){this._segments.push(t),this._duration += t.duration;},i.prototype._parsePlaylistEncryptionHeader = function(t){var e,r,i,n=t.substr(l.ENCRYPTION.length).split(",");if((s(n,function(t){t.indexOf("METHOD") >= 0?r = t.split("=")[1]:t.indexOf("URI") >= 0?e = t.split("=")[1]:t.indexOf("IV") >= 0 && (i = t.split("=")[1]);}),!(r && e && r.length && e.length)))throw new Error("Failed to parse M3U8 encryption header");r = r.trim(),e = e.trim().replace(/"/g,""),this._encryptionMethod = r,this._encryptionKeyUri = e,i && i.length?(this._encryptionIvHexString = i.trim(),this._parseEncryptionIvHexString()):this._encryptionIv = null;},i.prototype._parseEncryptionIvHexString = function(){var t,e=this._encryptionIvHexString.replace("0x",""),r=new Uint16Array(8),i=0;if(e.length % 4 !== 0)throw new Error("Failed to parse M3U8 encryption IV (length is not multiple of 4)");for(;i < e.length;i += 4) {if((t = parseInt(e.substr(i,4),16),isNaN(t)))throw new Error("Failed to parse hex number in IV string");r[i / 4] = t;}this._encryptionIv = r;},i.prototype._encryptionIvForSegment = function(t){var e=new DataView(new ArrayBuffer(16));return e.setUint32(0,t.index,!0),e.buffer;},i.prototype._retrieveEncryptionKey = function(t){if(t){if(!this._encryptionKeyUri)return void t.call(this);var e=this._encryptionKeyUri,r=new XMLHttpRequest();r.open("GET",e,!0),r.responseType = "arraybuffer",r.onload = o(function(i){200 === r.status?this._encryptionKey = new Uint8Array(r.response):this._logger.log("Failed to retrieve encryption key from " + e + ", returned status " + r.status),t.call(this);},this),r.send(),this._logger.log("Downloading encryption key from " + e);}},i.prototype._removeEncryptionPaddingBytes = function(t){var e=t.data[t.data.byteLength - 1];e?(this._logger.log("Detected PKCS7 padding length of " + e + " bytes, slicing segment."),t.data = t.data.subarray(0,t.data.byteLength - e)):this._logger.log("No padding detected (last byte is zero)");},i.prototype.decryptSegmentAES128 = function(t){if((this._logger.log("Decrypting AES-128 cyphered segment ..."),!a))throw new Error("AES decryption not built-in");var e=a.cipher.createDecipher("AES-CBC",a.util.createBuffer(this._encryptionKey)),r=0,i=t.data.byteLength,n=this._encryptionIv || this._encryptionIvForSegment(t);for(this._logger.log("Using IV ->"),e.start({iv:a.util.createBuffer(n)}),e.update(a.util.createBuffer(t.data)),e.finish(),t.data = new Uint8Array(i);i > r;r++) t.data[r] = e.output.getByte();this._removeEncryptionPaddingBytes(t);},i.prototype.isAES128Encrypted = function(){return "AES-128" === this._encryptionMethod;},i.prototype.getEncryptionKeyUri = function(){return this._encryptionKeyUri;},i.prototype.getEncryptionIv = function(){return this._encryptionIv;},i.prototype.getEncryptionKey = function(){return this._encryptionKey;},i.prototype._createSegmentURL = function(t){return "http://" === t.substr(0,7) || "https://" === t.substr(0,8) || "/" === t.substr(0,1)?t:this._baseURI + t;},i.prototype._handleLoadSegmentFailure = function(t,e,r){t.aborted || (this._logger.log("segment aborted: " + t.aborted),this._logger.log("segment loading failure: HTTP response status: " + e.status),0 === e.status?t.status = h.TIMEOUT:403 === e.status?t.status = h.FORBIDDEN:404 === e.status?t.status = h.NOT_FOUND:e.status >= 500?t.status = h.SERVER_ERROR:t.status = h.FAILED,t.timesFailed++,this.trigger(i.Events.SEGMENT_FAILED,t));},i.prototype.loadSegment = function(t){var e=!1,r=new XMLHttpRequest(),n=t.uri,o=(function(i){e || (e = !0,this._handleLoadSegmentFailure(t,r,i));}).bind(this);(t.hasBeenRequested() || t.isComplete()) && this._logger.log("segment cant be loaded, requested: ",!!t.hasBeenRequested()," complete: ",t.isComplete()),r.open("GET",n,!0),r.responseType = "arraybuffer",r.onload = (function(){if(!t.aborted){if(200 !== r.status)return void o();this._logger.log("download of segment " + t.index + " complete"),t.status = h.COMPLETE,t.data = new Uint8Array(r.response),t.downloadTime = Date.now() - t.downloadStartTime,this.trigger(i.Events.SEGMENT_LOADED,t);}}).bind(this),r.onprogress = (function(e){t.aborted || e.loaded && e.total && (t.loaded = e.loaded,t.total = e.total,this.trigger(i.Events.SEGMENT_PROGRESS,t));}).bind(this),r.onerror = (function(t){o(t);}).bind(this),this._logger.log("requesting segment " + t.index + " from " + n),t.xhr = r,t.aborted = !1,t.downloadStartTime = Date.now(),t.status = h.REQUESTED,r.send();},i.prototype.getSegment = function(t){return this._segments && this._segments[t]?this._segments[t]:null;},i.prototype.getSegmentIndexForTime = function(t){var e,r;if(t > this._duration || 0 > t || !this._segments || 0 === this._segments.length)return -1;for(e = Math.floor(this._segments.length * (t / this._duration)),r = this._segments[e];!(r.startPosition <= t && r.startPosition + r.duration > t);) r.startPosition + r.duration >= t?e--:e++,r = this._segments[e];return e;},i.prototype.getSegmentForTime = function(t){var e=this.getSegmentIndexForTime(t);return e >= 0?this._segments[e]:null;},i.prototype.getDuration = function(){return this._duration;},i.prototype.getNumSegments = function(){return this._segments.length;},i.prototype.getLastSegment = function(){return this._segments.length?this._segments[this._segments.length - 1]:null;};},function(t,e,r){var i=r(53),n=r(56),o=r(57),s=1,a=32,u=o(function(t,e,r){var o=s;if(r.length){var h=n(r,u.placeholder);o |= a;}return i(t,o,e,r,h);});u.placeholder = {},t.exports = u;},function(t,e,r){(function(e){function i(t,e,r){for(var i=r.length,n=-1,o=I(t.length - i,0),s=-1,a=e.length,u=Array(a + o);++s < a;) u[s] = e[s];for(;++n < i;) u[r[n]] = t[n];for(;o--;) u[s++] = t[n++];return u;}function n(t,e,r){for(var i=-1,n=r.length,o=-1,s=I(t.length - n,0),a=-1,u=e.length,h=Array(s + u);++o < s;) h[o] = t[o];for(var l=o;++a < u;) h[l + a] = e[a];for(;++i < n;) h[l + r[i]] = t[o++];return h;}function o(t,r){function i(){var o=this && this !== e && this instanceof i?n:t;return o.apply(r,arguments);}var n=s(t);return i;}function s(t){return function(){var e=arguments;switch(e.length){case 0:return new t();case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3]);case 5:return new t(e[0],e[1],e[2],e[3],e[4]);case 6:return new t(e[0],e[1],e[2],e[3],e[4],e[5]);case 7:return new t(e[0],e[1],e[2],e[3],e[4],e[5],e[6]);}var r=p(t.prototype),i=t.apply(r,e);return f(i)?i:r;};}function a(t,r,o,u,h,l,f,p,T,b){function P(){for(var m=arguments.length,E=m,v=Array(m);E--;) v[E] = arguments[E];if((u && (v = i(v,u,h)),l && (v = n(v,l,f)),O || N)){var w=P.placeholder,x=g(v,w);if((m -= x.length,b > m)){var C=p?d(p):void 0,F=I(b - m,0),B=O?x:void 0,U=O?void 0:x,H=O?v:void 0,G=O?void 0:v;r |= O?S:A,r &= ~(O?A:S),M || (r &= ~(_ | y));var Y=a(t,r,o,H,B,G,U,C,T,F);return Y.placeholder = w,Y;}}var j=L?o:this,z=R?j[t]:t;return p && (v = c(v,p)),D && T < v.length && (v.length = T),this && this !== e && this instanceof P && (z = k || s(t)),z.apply(j,v);}var D=r & w,L=r & _,R=r & y,O=r & E,M=r & m,N=r & v,k=R?void 0:s(t);return P;}function u(t,r,i,n){function o(){for(var r=-1,s=arguments.length,h=-1,l=n.length,c=Array(l + s);++h < l;) c[h] = n[h];for(;s--;) c[h++] = arguments[++r];var f=this && this !== e && this instanceof o?u:t;return f.apply(a?i:this,c);}var a=r & _,u=s(t);return o;}function h(t,e,r,i,n,s,h,l){var c=e & y;if(!c && "function" != typeof t)throw new TypeError(T);var f=i?i.length:0;if((f || (e &= ~(S | A),i = n = void 0),f -= n?n.length:0,e & A)){var d=i,p=n;i = n = void 0;}var g=[t,e,r,i,n,d,p,s,h,l];if((g[9] = null == l?c?0:t.length:I(l - f,0) || 0,e == _))var m=o(g[0],g[2]);else m = e != S && e != (_ | S) || g[4].length?a.apply(void 0,g):u.apply(void 0,g);return m;}function l(t,e){return t = "number" == typeof t || b.test(t)?+t:-1,e = null == e?D:e,t > -1 && t % 1 == 0 && e > t;}function c(t,e){for(var r=t.length,i=P(e.length,r),n=d(t);i--;) {var o=e[i];t[i] = l(o,r)?n[o]:void 0;}return t;}function f(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}var d=r(54),p=r(55),g=r(56),_=1,y=2,m=4,E=8,v=16,S=32,A=64,w=128,T="Expected a function",b=/^\d+$/,I=Math.max,P=Math.min,D=9007199254740991;t.exports = h;}).call(e,(function(){return this;})());},function(t,e){function r(t,e){var r=-1,i=t.length;for(e || (e = Array(i));++r < i;) e[r] = t[r];return e;}t.exports = r;},function(t,e){function r(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}var i=(function(){function t(){}return function(e){if(r(e)){t.prototype = e;var i=new t();t.prototype = void 0;}return i || {};};})();t.exports = i;},function(t,e){function r(t,e){for(var r=-1,n=t.length,o=-1,s=[];++r < n;) t[r] === e && (t[r] = i,s[++o] = r);return s;}var i="__lodash_placeholder__";t.exports = r;},11,function(t,e,r){function i(t,e){return function(r,i,n){return "function" == typeof i && void 0 === n && a(r)?t(r,i):e(r,s(i,n,3));};}var n=r(59),o=r(60),s=r(65),a=r(64),u=i(n,o);t.exports = u;},function(t,e){function r(t,e){for(var r=-1,i=t.length;++r < i && e(t[r],r,t) !== !1;);return t;}t.exports = r;},[134,61],[132,62,63,64],5,6,7,9,function(t,e,r){var i,n=r(36),o=r(16),s=r(47).bindAll,a=r(1);t.exports = i = function(t,e){s(this,["_onMSEInit","_onMSEDispose","_onSourceBufferUpdate"]),this.mimeType = e,this._logger = t,this._isBufferPrepared = !1,this._sourceBufferPtsOffset = 0,this._segmentsAwaitingAppendance = [],this._isNotReady = !0,this._sourceBuffer = null,this._mediaSource = new MediaSource(),this._mediaSource.addEventListener("sourceopen",this._onMSEInit,!1),this._mediaSource.addEventListener("sourceclose",this._onMSEDispose,!1),this._mediaElem = o.createAudioElement(),this._mediaElem.src = window.URL.createObjectURL(this._mediaSource);},i.Events = {SOURCE_READY:"source-ready",SOURCE_DESTROYED:"source-destroy",SOURCE_ERROR:"source-error",SEGMENT_APPENDED:"segment-appended"},a(i.prototype,n),a(i.prototype,{_onMSEInit:function _onMSEInit(){this._logger.log("source open handler"),this._isNotReady = !1,this._mediaSource.removeEventListener("sourceopen",this._onMSEInit,!1),this._sourceBuffer = this._mediaSource.addSourceBuffer(this.mimeType),this._sourceBuffer.addEventListener("update",this._onSourceBufferUpdate),this.trigger(i.Events.SOURCE_READY);},_onMSEDispose:function _onMSEDispose(){this._isNotReady = !0,this._logger.log("source dispose handler"),this._mediaSource.removeEventListener("sourceclose",this._onMSEDispose,!1);},_appendNextSegment:function _appendNextSegment(t){try{if(this._sourceBuffer.updating)return this._logger.log("source buffer is busy updating already, enqueuing data for later appending"),void this._segmentsAwaitingAppendance.unshift(t);t.isLast && this._logger.log("about to append last segment"),this._currentSegmentAppending = t,this._sourceBuffer.timestampOffset = t.startPosition / 1e3,this._sourceBuffer.appendBuffer(t.data),this._logger.log("appending segment " + t.index);}catch(e) {this._logger.log("error while appending to SourceBuffer: " + e.message + ")"),this.trigger(i.Events.SOURCE_ERROR,e);}},_tryAppendEos:function _tryAppendEos(){this._logger.log("attempting to finalize stream");try{"open" !== this._mediaSource.readyState || this._sourceBuffer.updating?this._logger.log("couldn't call endOfStream because SourceBuffer is still updating, we'll call it once its done"):(this._mediaSource.endOfStream(),this._logger.log("called endOfStream"));}catch(t) {this._logger.log("SourceBuffer endOfStream() call failed with error: " + t.message),this.trigger(i.Events.SOURCE_ERROR,t);}},_onSourceBufferUpdate:function _onSourceBufferUpdate(){(this._currentSegmentAppending || this._sourceBuffer.updating) && (this._logger.log("done updating SourceBuffer with segment " + this._currentSegmentAppending.index),this.trigger(i.Events.SEGMENT_APPENDED,this._currentSegmentAppending),this._currentSegmentAppending.isLast && (this._logger.log("was last segment, setting on EOS on SourceBuffer"),this._tryAppendEos()),this._segmentsAwaitingAppendance.length && !this._sourceBuffer.updating && this._appendNextSegment(this._segmentsAwaitingAppendance.pop()));},append:function append(t){if(!this.sourceIsReady())throw new Error("MediaSource is not ready yet");this._appendNextSegment(t);},media:function media(){return this._mediaElem;},sourceIsReady:function sourceIsReady(){return !this._isNotReady;},duration:function duration(t){return this._mediaSource.duration = t / 1e3,1e3 * this._mediaSource.duration;}});},function(t,e,r){var i,n=r(47).concatBuffersToUint8Array,o=r(1),s=r(36),a=r(68);t.exports = i = function(t){this.config = t,this.reset(),this.segments = [],this.pushedInitData = !1;},o(i.prototype,s),i.prototype.process = function(t){switch((this.segments.push(t),this.config)){case i.Configs.VOID:this.trigger("segment",t);break;case i.Configs.MP3_TO_FMP4:this.src.enqueue(new a.Unit.Transfer(t.data,"binary")),this.src.enqueue(a.Unit.Transfer.Flush());break;default:throw new Error("Config " + this.config + " not supported");}},i.prototype.dequeue = function(){return this.segments.shift();},i.prototype.reset = function(){switch(this.config){case i.Configs.VOID:break;case i.Configs.MP3_TO_FMP4:this.gotInitData = !1,this.src = new a.Unit.BasePushSrc(),this.parser = new a.Units.MP3Parser(),this.muxer = new a.Units.MP4Mux(a.Units.MP4Mux.Profiles.MP3_AUDIO_ONLY),this.sink = new a.Unit.BaseSink(),this.sink._onData = (function(){var t,e=this.sink.dequeue().data;return this.gotInitData?(t = this.dequeue(),t.mimeType = "audio/mp4",this.gotInitData && !this.pushedInitData?(t.data = n(this.initData,e),this.pushedInitData = !0):t.data = e,this.trigger("segment",t),void this.reset()):(this.gotInitData = !0,void (this.initData = e));}).bind(this),a.Unit.link(this.src,this.parser,this.muxer,this.sink);break;default:throw new Error("Config " + this.config + " not supported");}},i.Configs = {VOID:"VOID",MP3_TO_FMP4:"MP3_TO_FMP4"};},function(t,e,r){var i,n=r(69),o=r(115),s=r(118),a=r(121),u=r(124),h=r(125);t.exports = i = {Unit:n,Units:{File:h,MP4Mux:o,MP3Parser:s,MSESink:a,XHR:u}};},function(t,e,r){(function(e){var i,n,o,s,a,u,h,l,c,f,d=r(74),p=r(76),g=r(85),_=r(96),y=r(97);t.exports = i = function(){_.call(this),this.inputs || (this.inputs = []),this.outputs || (this.outputs = []);},i.create = function(t){return p(i.prototype,t);},i.createBaseSrc = function(t){return p(u.prototype,t);},i.createBasePushSrc = function(t){return p(h.prototype,t);},i.createBaseSink = function(t){return p(l.prototype,t);},i.createBaseTransform = function(t){return p(a.prototype,t);},i.createBaseParser = function(t){return p(c.prototype,t);},i.link = function(t,e){if(arguments.length > 2)return i.linkArray(arguments);for(var r=0;r < Math.min(t.numberOfOuts(),e.numberOfIns());r++) t.out(r).pipe(e["in"](r));return e;},i.linkArray = function(t){var e,r,n;for(n = 0;n < t.length;n++) e = t[n],t.length > n + 1 && (r = t[n + 1],i.link(e,r));return r;};var m=i.Event = {CHAIN:"chain",NEED_DATA:"need-data",FINISH:"finish",PIPE:"pipe",UNPIPE:"unpipe",ERROR:"error",END:"end",OPEN:"open",CLOSE:"close"};i.prototype = p(_.prototype,{constructor:i,"in":function _in(t){return this.inputs[t];},out:function out(t){return this.outputs[t];},numberOfIns:function numberOfIns(){return this.inputs.length;},numberOfOuts:function numberOfOuts(){return this.outputs.length;},add:function add(t){return t instanceof n?this.addInput(t):t instanceof o && this.addOutput(t),this;},remove:function remove(t){t instanceof n?this.removeInput(t):t instanceof o && this.removeOutput(t);},addInput:function addInput(t){this._installEventForwarder(t,m.FINISH),this._installEventForwarder(t,m.OPEN),this._installEventForwarder(t,m.PIPE),this._installEventForwarder(t,m.UNPIPE),this._installEventForwarder(t,m.ERROR),this._installEventForwarder(t,m.CHAIN),this.inputs.push(t);},addOutput:function addOutput(t){this._installEventForwarder(t,m.END),this._installEventForwarder(t,m.OPEN),this._installEventForwarder(t,m.CLOSE),this._installEventForwarder(t,m.ERROR),this._installEventForwarder(t,m.NEED_DATA),this.outputs.push(t);},removeInput:function removeInput(t){removePut(this.inputs,t);},removeOutput:function removeOutput(t){removePut(this.outputs,t);},removePut:function removePut(t,e){t.slice().forEach(function(r,i){r == e && t.splice(i,1);});},_installEventForwarder:function _installEventForwarder(t,e){t.on(e,(function(r){this.emit(e,t,r);}).bind(this));}}),i.Transfer = s = function(t,r,i){r || (r = t instanceof e?"buffer":t instanceof String?"utf8":"object"),this.resolved = !1,this.data = t,this.encoding = r,this.doneCallback = i;},s.prototype = p(Object.prototype,{constructor:s,resolve:function resolve(){this.doneCallback && !this.resolved && (this.doneCallback(),this.resolved = !0);},setFlushing:function setFlushing(t){return this.data.flush = t,this;},setEmpty:function setEmpty(t){return this.data.empty = t,this;}}),s.Flush = function(){return new s({},"binary").setFlushing(!0).setEmpty(!0);},s.EOS = function(){return new s(null,"binary");},i.Input = n = function(t,e){y.Writable.prototype.constructor.call(this,{objectMode:!0,decodeStrings:!1});},n.prototype = p(y.Writable.prototype,{constructor:n,_write:function _write(t,e,r){d("_write: " + e),this.emit(i.Event.CHAIN,new s(t,e,r));}}),i.Output = o = function(t){y.Readable.prototype.constructor.call(this,{objectMode:!0}),this._dataRequested = 0,this._shouldPushMore = !0;},o.eos = function(t){t.push(null,"null");},o.prototype = p(y.Readable.prototype,{constructor:o,_read:function _read(t){this._dataRequested++,this.emit(m.NEED_DATA,this);},push:function push(t,e){return this._dataRequested--,this._shouldPushMore = y.Readable.prototype.push.call(this,t,e),this._shouldPushMore;},isPulling:function isPulling(){return this._dataRequested > 0;},eos:function eos(){y.Readable.prototype.push.call(this,null,"null");}}),i.BaseTransform = a = function(){i.prototype.constructor.apply(this,arguments),this.add(new n()).add(new o()),this.on(m.CHAIN,this._onChain.bind(this)),this.on(m.FINISH,this._onFinish.bind(this));},a.prototype = p(i.prototype,{constructor:a,_onChain:function _onChain(t,e){this._transform(e),this.out(0).push(e.data,e.encoding),e.resolve();},_onFinish:function _onFinish(t){o.eos(this.out(0));},_transform:function _transform(t){}}),i.BaseSrc = u = function(){i.prototype.constructor.apply(this,arguments),this.add(new o()),this.on(m.NEED_DATA,this.squeeze.bind(this));},u.prototype = p(i.prototype,{constructor:u,squeeze:function squeeze(){d("squeeze");var t=this._source();t && (this.out(0).push(t.data,t.encoding),t.resolve());},_source:function _source(){}}),i.BasePushSrc = h = function(){u.prototype.constructor.apply(this,arguments),this._bufferOut = [];},h.prototype = p(u.prototype,{constructor:h,_source:function _source(){return this._bufferOut.length?this._bufferOut.shift():null;},enqueue:function enqueue(t){this._bufferOut.push(t),this.out(0).isPulling && this.out(0).isPulling() && this.squeeze();}}),i.BaseSink = l = function(){i.prototype.constructor.apply(this,arguments),this.add(new n()),this.on(m.CHAIN,this._onChain.bind(this)),this._bufferIn = [];},l.prototype = p(i.prototype,{constructor:l,_onChain:function _onChain(t,e){d("BaseSink._onChain: " + e.encoding),this._bufferIn.push(e),this._onData(),e.resolve();},_onData:function _onData(){},dequeue:function dequeue(){return this._bufferIn.length?this._bufferIn.shift():null;}}),i.BaseParser = c = function(){h.prototype.constructor.apply(this,arguments),l.prototype.constructor.apply(this,arguments),this.on("finish",this._onFinish.bind(this));},g(c.prototype,i.prototype,_.prototype,u.prototype,h.prototype,l.prototype,{constructor:c,_onData:function _onData(){this._parse(this.dequeue());},_onFinish:function _onFinish(){d("BaseParser._onFinish"),o.eos(this.out(0));},_parse:function _parse(t){}}),i.InputSelector = f = function(t){for(a.prototype.constructor.apply(this,arguments),t = (t || 1) - 1;t-- > 0;) this.add(new n());this.selectedInputIndex = 0;},g(f.prototype,a.prototype,{constructor:f,_onChain:function _onChain(t,e){var r=this["in"](this.selectedInputIndex);return t !== r?void e.resolve():(this._transform(e),this.out(0).push(e.data,e.encoding),void e.resolve());},_onFinish:function _onFinish(t){var e=this["in"](this.selectedInputIndex);t === e && o.eos(this.out(0));}});}).call(e,r(70).Buffer);},function(t,e,r){(function(t,i){function n(){function t(){}try{var e=new Uint8Array(1);return e.foo = function(){return 42;},e.constructor = t,42 === e.foo() && e.constructor === t && "function" == typeof e.subarray && 0 === e.subarray(1,1).byteLength;}catch(r) {return !1;}}function o(){return t.TYPED_ARRAY_SUPPORT?2147483647:1073741823;}function t(e){return this instanceof t?(this.length = 0,this.parent = void 0,"number" == typeof e?s(this,e):"string" == typeof e?a(this,e,arguments.length > 1?arguments[1]:"utf8"):u(this,e)):arguments.length > 1?new t(e,arguments[1]):new t(e);}function s(e,r){if((e = g(e,0 > r?0:0 | _(r)),!t.TYPED_ARRAY_SUPPORT))for(var i=0;r > i;i++) e[i] = 0;return e;}function a(t,e,r){("string" != typeof r || "" === r) && (r = "utf8");var i=0 | m(e,r);return t = g(t,i),t.write(e,r),t;}function u(e,r){if(t.isBuffer(r))return h(e,r);if(X(r))return l(e,r);if(null == r)throw new TypeError("must start with number, buffer, array or string");if("undefined" != typeof ArrayBuffer){if(r.buffer instanceof ArrayBuffer)return c(e,r);if(r instanceof ArrayBuffer)return f(e,r);}return r.length?d(e,r):p(e,r);}function h(t,e){var r=0 | _(e.length);return t = g(t,r),e.copy(t,0,0,r),t;}function l(t,e){var r=0 | _(e.length);t = g(t,r);for(var i=0;r > i;i += 1) t[i] = 255 & e[i];return t;}function c(t,e){var r=0 | _(e.length);t = g(t,r);for(var i=0;r > i;i += 1) t[i] = 255 & e[i];return t;}function f(e,r){return t.TYPED_ARRAY_SUPPORT?(r.byteLength,e = t._augment(new Uint8Array(r))):e = c(e,new Uint8Array(r)),e;}function d(t,e){var r=0 | _(e.length);t = g(t,r);for(var i=0;r > i;i += 1) t[i] = 255 & e[i];return t;}function p(t,e){var r,i=0;"Buffer" === e.type && X(e.data) && (r = e.data,i = 0 | _(r.length)),t = g(t,i);for(var n=0;i > n;n += 1) t[n] = 255 & r[n];return t;}function g(e,r){t.TYPED_ARRAY_SUPPORT?(e = t._augment(new Uint8Array(r)),e.__proto__ = t.prototype):(e.length = r,e._isBuffer = !0);var i=0 !== r && r <= t.poolSize >>> 1;return i && (e.parent = Z),e;}function _(t){if(t >= o())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o().toString(16) + " bytes");return 0 | t;}function y(e,r){if(!(this instanceof y))return new y(e,r);var i=new t(e,r);return delete i.parent,i;}function m(t,e){"string" != typeof t && (t = "" + t);var r=t.length;if(0 === r)return 0;for(var i=!1;;) switch(e){case "ascii":case "binary":case "raw":case "raws":return r;case "utf8":case "utf-8":return j(t).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2 * r;case "hex":return r >>> 1;case "base64":return K(t).length;default:if(i)return j(t).length;e = ("" + e).toLowerCase(),i = !0;}}function E(t,e,r){var i=!1;if((e = 0 | e,r = void 0 === r || r === 1 / 0?this.length:0 | r,t || (t = "utf8"),0 > e && (e = 0),r > this.length && (r = this.length),e >= r))return "";for(;;) switch(t){case "hex":return O(this,e,r);case "utf8":case "utf-8":return P(this,e,r);case "ascii":return L(this,e,r);case "binary":return R(this,e,r);case "base64":return I(this,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return M(this,e,r);default:if(i)throw new TypeError("Unknown encoding: " + t);t = (t + "").toLowerCase(),i = !0;}}function v(t,e,r,i){r = Number(r) || 0;var n=t.length - r;i?(i = Number(i),i > n && (i = n)):i = n;var o=e.length;if(o % 2 !== 0)throw new Error("Invalid hex string");i > o / 2 && (i = o / 2);for(var s=0;i > s;s++) {var a=parseInt(e.substr(2 * s,2),16);if(isNaN(a))throw new Error("Invalid hex string");t[r + s] = a;}return s;}function S(t,e,r,i){return W(j(e,t.length - r),t,r,i);}function A(t,e,r,i){return W(z(e),t,r,i);}function w(t,e,r,i){return A(t,e,r,i);}function T(t,e,r,i){return W(K(e),t,r,i);}function b(t,e,r,i){return W(V(e,t.length - r),t,r,i);}function I(t,e,r){return 0 === e && r === t.length?q.fromByteArray(t):q.fromByteArray(t.slice(e,r));}function P(t,e,r){r = Math.min(t.length,r);for(var i=[],n=e;r > n;) {var o=t[n],s=null,a=o > 239?4:o > 223?3:o > 191?2:1;if(r >= n + a){var u,h,l,c;switch(a){case 1:128 > o && (s = o);break;case 2:u = t[n + 1],128 === (192 & u) && (c = (31 & o) << 6 | 63 & u,c > 127 && (s = c));break;case 3:u = t[n + 1],h = t[n + 2],128 === (192 & u) && 128 === (192 & h) && (c = (15 & o) << 12 | (63 & u) << 6 | 63 & h,c > 2047 && (55296 > c || c > 57343) && (s = c));break;case 4:u = t[n + 1],h = t[n + 2],l = t[n + 3],128 === (192 & u) && 128 === (192 & h) && 128 === (192 & l) && (c = (15 & o) << 18 | (63 & u) << 12 | (63 & h) << 6 | 63 & l,c > 65535 && 1114112 > c && (s = c));}}null === s?(s = 65533,a = 1):s > 65535 && (s -= 65536,i.push(s >>> 10 & 1023 | 55296),s = 56320 | 1023 & s),i.push(s),n += a;}return D(i);}function D(t){var e=t.length;if(J >= e)return String.fromCharCode.apply(String,t);for(var r="",i=0;e > i;) r += String.fromCharCode.apply(String,t.slice(i,i += J));return r;}function L(t,e,r){var i="";r = Math.min(t.length,r);for(var n=e;r > n;n++) i += String.fromCharCode(127 & t[n]);return i;}function R(t,e,r){var i="";r = Math.min(t.length,r);for(var n=e;r > n;n++) i += String.fromCharCode(t[n]);return i;}function O(t,e,r){var i=t.length;(!e || 0 > e) && (e = 0),(!r || 0 > r || r > i) && (r = i);for(var n="",o=e;r > o;o++) n += Y(t[o]);return n;}function M(t,e,r){for(var i=t.slice(e,r),n="",o=0;o < i.length;o += 2) n += String.fromCharCode(i[o] + 256 * i[o + 1]);return n;}function N(t,e,r){if(t % 1 !== 0 || 0 > t)throw new RangeError("offset is not uint");if(t + e > r)throw new RangeError("Trying to access beyond buffer length");}function k(e,r,i,n,o,s){if(!t.isBuffer(e))throw new TypeError("buffer must be a Buffer instance");if(r > o || s > r)throw new RangeError("value is out of bounds");if(i + n > e.length)throw new RangeError("index out of range");}function x(t,e,r,i){0 > e && (e = 65535 + e + 1);for(var n=0,o=Math.min(t.length - r,2);o > n;n++) t[r + n] = (e & 255 << 8 * (i?n:1 - n)) >>> 8 * (i?n:1 - n);}function C(t,e,r,i){0 > e && (e = 4294967295 + e + 1);for(var n=0,o=Math.min(t.length - r,4);o > n;n++) t[r + n] = e >>> 8 * (i?n:3 - n) & 255;}function F(t,e,r,i,n,o){if(e > n || o > e)throw new RangeError("value is out of bounds");if(r + i > t.length)throw new RangeError("index out of range");if(0 > r)throw new RangeError("index out of range");}function B(t,e,r,i,n){return n || F(t,e,r,4,3.4028234663852886e38,-3.4028234663852886e38),$.write(t,e,r,i,23,4),r + 4;}function U(t,e,r,i,n){return n || F(t,e,r,8,1.7976931348623157e308,-1.7976931348623157e308),$.write(t,e,r,i,52,8),r + 8;}function H(t){if((t = G(t).replace(tt,""),t.length < 2))return "";for(;t.length % 4 !== 0;) t += "=";return t;}function G(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"");}function Y(t){return 16 > t?"0" + t.toString(16):t.toString(16);}function j(t,e){e = e || 1 / 0;for(var r,i=t.length,n=null,o=[],s=0;i > s;s++) {if((r = t.charCodeAt(s),r > 55295 && 57344 > r)){if(!n){if(r > 56319){(e -= 3) > -1 && o.push(239,191,189);continue;}if(s + 1 === i){(e -= 3) > -1 && o.push(239,191,189);continue;}n = r;continue;}if(56320 > r){(e -= 3) > -1 && o.push(239,191,189),n = r;continue;}r = (n - 55296 << 10 | r - 56320) + 65536;}else n && (e -= 3) > -1 && o.push(239,191,189);if((n = null,128 > r)){if((e -= 1) < 0)break;o.push(r);}else if(2048 > r){if((e -= 2) < 0)break;o.push(r >> 6 | 192,63 & r | 128);}else if(65536 > r){if((e -= 3) < 0)break;o.push(r >> 12 | 224,r >> 6 & 63 | 128,63 & r | 128);}else {if(!(1114112 > r))throw new Error("Invalid code point");if((e -= 4) < 0)break;o.push(r >> 18 | 240,r >> 12 & 63 | 128,r >> 6 & 63 | 128,63 & r | 128);}}return o;}function z(t){for(var e=[],r=0;r < t.length;r++) e.push(255 & t.charCodeAt(r));return e;}function V(t,e){for(var r,i,n,o=[],s=0;s < t.length && !((e -= 2) < 0);s++) r = t.charCodeAt(s),i = r >> 8,n = r % 256,o.push(n),o.push(i);return o;}function K(t){return q.toByteArray(H(t));}function W(t,e,r,i){for(var n=0;i > n && !(n + r >= e.length || n >= t.length);n++) e[n + r] = t[n];return n;} /*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */var q=r(71),$=r(72),X=r(73);e.Buffer = t,e.SlowBuffer = y,e.INSPECT_MAX_BYTES = 50,t.poolSize = 8192;var Z={};t.TYPED_ARRAY_SUPPORT = void 0 !== i.TYPED_ARRAY_SUPPORT?i.TYPED_ARRAY_SUPPORT:n(),t.TYPED_ARRAY_SUPPORT && (t.prototype.__proto__ = Uint8Array.prototype,t.__proto__ = Uint8Array),t.isBuffer = function(t){return !(null == t || !t._isBuffer);},t.compare = function(e,r){if(!t.isBuffer(e) || !t.isBuffer(r))throw new TypeError("Arguments must be Buffers");if(e === r)return 0;for(var i=e.length,n=r.length,o=0,s=Math.min(i,n);s > o && e[o] === r[o];) ++o;return o !== s && (i = e[o],n = r[o]),n > i?-1:i > n?1:0;},t.isEncoding = function(t){switch(String(t).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "binary":case "base64":case "raw":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return !0;default:return !1;}},t.concat = function(e,r){if(!X(e))throw new TypeError("list argument must be an Array of Buffers.");if(0 === e.length)return new t(0);var i;if(void 0 === r)for(r = 0,i = 0;i < e.length;i++) r += e[i].length;var n=new t(r),o=0;for(i = 0;i < e.length;i++) {var s=e[i];s.copy(n,o),o += s.length;}return n;},t.byteLength = m,t.prototype.length = void 0,t.prototype.parent = void 0,t.prototype.toString = function(){var t=0 | this.length;return 0 === t?"":0 === arguments.length?P(this,0,t):E.apply(this,arguments);},t.prototype.equals = function(e){if(!t.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this === e?!0:0 === t.compare(this,e);},t.prototype.inspect = function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length > 0 && (t = this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length > r && (t += " ... ")),"<Buffer " + t + ">";},t.prototype.compare = function(e){if(!t.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this === e?0:t.compare(this,e);},t.prototype.indexOf = function(e,r){function i(t,e,r){for(var i=-1,n=0;r + n < t.length;n++) if(t[r + n] === e[-1 === i?0:n - i]){if((-1 === i && (i = n),n - i + 1 === e.length))return r + i;}else i = -1;return -1;}if((r > 2147483647?r = 2147483647:-2147483648 > r && (r = -2147483648),r >>= 0,0 === this.length))return -1;if(r >= this.length)return -1;if((0 > r && (r = Math.max(this.length + r,0)),"string" == typeof e))return 0 === e.length?-1:String.prototype.indexOf.call(this,e,r);if(t.isBuffer(e))return i(this,e,r);if("number" == typeof e)return t.TYPED_ARRAY_SUPPORT && "function" === Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,e,r):i(this,[e],r);throw new TypeError("val must be string, number or Buffer");},t.prototype.get = function(t){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(t);},t.prototype.set = function(t,e){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(t,e);},t.prototype.write = function(t,e,r,i){if(void 0 === e)i = "utf8",r = this.length,e = 0;else if(void 0 === r && "string" == typeof e)i = e,r = this.length,e = 0;else if(isFinite(e))e = 0 | e,isFinite(r)?(r = 0 | r,void 0 === i && (i = "utf8")):(i = r,r = void 0);else {var n=i;i = e,e = 0 | r,r = n;}var o=this.length - e;if(((void 0 === r || r > o) && (r = o),t.length > 0 && (0 > r || 0 > e) || e > this.length))throw new RangeError("attempt to write outside buffer bounds");i || (i = "utf8");for(var s=!1;;) switch(i){case "hex":return v(this,t,e,r);case "utf8":case "utf-8":return S(this,t,e,r);case "ascii":return A(this,t,e,r);case "binary":return w(this,t,e,r);case "base64":return T(this,t,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return b(this,t,e,r);default:if(s)throw new TypeError("Unknown encoding: " + i);i = ("" + i).toLowerCase(),s = !0;}},t.prototype.toJSON = function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr || this,0)};};var J=4096;t.prototype.slice = function(e,r){var i=this.length;e = ~ ~e,r = void 0 === r?i:~ ~r,0 > e?(e += i,0 > e && (e = 0)):e > i && (e = i),0 > r?(r += i,0 > r && (r = 0)):r > i && (r = i),e > r && (r = e);var n;if(t.TYPED_ARRAY_SUPPORT)n = t._augment(this.subarray(e,r));else {var o=r - e;n = new t(o,void 0);for(var s=0;o > s;s++) n[s] = this[s + e];}return n.length && (n.parent = this.parent || this),n;},t.prototype.readUIntLE = function(t,e,r){t = 0 | t,e = 0 | e,r || N(t,e,this.length);for(var i=this[t],n=1,o=0;++o < e && (n *= 256);) i += this[t + o] * n;return i;},t.prototype.readUIntBE = function(t,e,r){t = 0 | t,e = 0 | e,r || N(t,e,this.length);for(var i=this[t + --e],n=1;e > 0 && (n *= 256);) i += this[t + --e] * n;return i;},t.prototype.readUInt8 = function(t,e){return e || N(t,1,this.length),this[t];},t.prototype.readUInt16LE = function(t,e){return e || N(t,2,this.length),this[t] | this[t + 1] << 8;},t.prototype.readUInt16BE = function(t,e){return e || N(t,2,this.length),this[t] << 8 | this[t + 1];},t.prototype.readUInt32LE = function(t,e){return e || N(t,4,this.length),(this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];},t.prototype.readUInt32BE = function(t,e){return e || N(t,4,this.length),16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);},t.prototype.readIntLE = function(t,e,r){t = 0 | t,e = 0 | e,r || N(t,e,this.length);for(var i=this[t],n=1,o=0;++o < e && (n *= 256);) i += this[t + o] * n;return n *= 128,i >= n && (i -= Math.pow(2,8 * e)),i;},t.prototype.readIntBE = function(t,e,r){t = 0 | t,e = 0 | e,r || N(t,e,this.length);for(var i=e,n=1,o=this[t + --i];i > 0 && (n *= 256);) o += this[t + --i] * n;return n *= 128,o >= n && (o -= Math.pow(2,8 * e)),o;},t.prototype.readInt8 = function(t,e){return e || N(t,1,this.length),128 & this[t]?-1 * (255 - this[t] + 1):this[t];},t.prototype.readInt16LE = function(t,e){e || N(t,2,this.length);var r=this[t] | this[t + 1] << 8;return 32768 & r?4294901760 | r:r;},t.prototype.readInt16BE = function(t,e){e || N(t,2,this.length);var r=this[t + 1] | this[t] << 8;return 32768 & r?4294901760 | r:r;},t.prototype.readInt32LE = function(t,e){return e || N(t,4,this.length),this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;},t.prototype.readInt32BE = function(t,e){return e || N(t,4,this.length),this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];},t.prototype.readFloatLE = function(t,e){return e || N(t,4,this.length),$.read(this,t,!0,23,4);},t.prototype.readFloatBE = function(t,e){return e || N(t,4,this.length),$.read(this,t,!1,23,4);},t.prototype.readDoubleLE = function(t,e){return e || N(t,8,this.length),$.read(this,t,!0,52,8);},t.prototype.readDoubleBE = function(t,e){return e || N(t,8,this.length),$.read(this,t,!1,52,8);},t.prototype.writeUIntLE = function(t,e,r,i){t = +t,e = 0 | e,r = 0 | r,i || k(this,t,e,r,Math.pow(2,8 * r),0);var n=1,o=0;for(this[e] = 255 & t;++o < r && (n *= 256);) this[e + o] = t / n & 255;return e + r;},t.prototype.writeUIntBE = function(t,e,r,i){t = +t,e = 0 | e,r = 0 | r,i || k(this,t,e,r,Math.pow(2,8 * r),0);var n=r - 1,o=1;for(this[e + n] = 255 & t;--n >= 0 && (o *= 256);) this[e + n] = t / o & 255;return e + r;},t.prototype.writeUInt8 = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,1,255,0),t.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),this[r] = 255 & e,r + 1;},t.prototype.writeUInt16LE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,2,65535,0),t.TYPED_ARRAY_SUPPORT?(this[r] = 255 & e,this[r + 1] = e >>> 8):x(this,e,r,!0),r + 2;},t.prototype.writeUInt16BE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,2,65535,0),t.TYPED_ARRAY_SUPPORT?(this[r] = e >>> 8,this[r + 1] = 255 & e):x(this,e,r,!1),r + 2;},t.prototype.writeUInt32LE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,4,4294967295,0),t.TYPED_ARRAY_SUPPORT?(this[r + 3] = e >>> 24,this[r + 2] = e >>> 16,this[r + 1] = e >>> 8,this[r] = 255 & e):C(this,e,r,!0),r + 4;},t.prototype.writeUInt32BE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,4,4294967295,0),t.TYPED_ARRAY_SUPPORT?(this[r] = e >>> 24,this[r + 1] = e >>> 16,this[r + 2] = e >>> 8,this[r + 3] = 255 & e):C(this,e,r,!1),r + 4;},t.prototype.writeIntLE = function(t,e,r,i){if((t = +t,e = 0 | e,!i)){var n=Math.pow(2,8 * r - 1);k(this,t,e,r,n - 1,-n);}var o=0,s=1,a=0 > t?1:0;for(this[e] = 255 & t;++o < r && (s *= 256);) this[e + o] = (t / s >> 0) - a & 255;return e + r;},t.prototype.writeIntBE = function(t,e,r,i){if((t = +t,e = 0 | e,!i)){var n=Math.pow(2,8 * r - 1);k(this,t,e,r,n - 1,-n);}var o=r - 1,s=1,a=0 > t?1:0;for(this[e + o] = 255 & t;--o >= 0 && (s *= 256);) this[e + o] = (t / s >> 0) - a & 255;return e + r;},t.prototype.writeInt8 = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,1,127,-128),t.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),0 > e && (e = 255 + e + 1),this[r] = 255 & e,r + 1;},t.prototype.writeInt16LE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,2,32767,-32768),t.TYPED_ARRAY_SUPPORT?(this[r] = 255 & e,this[r + 1] = e >>> 8):x(this,e,r,!0),r + 2;},t.prototype.writeInt16BE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,2,32767,-32768),t.TYPED_ARRAY_SUPPORT?(this[r] = e >>> 8,this[r + 1] = 255 & e):x(this,e,r,!1),r + 2;},t.prototype.writeInt32LE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,4,2147483647,-2147483648),t.TYPED_ARRAY_SUPPORT?(this[r] = 255 & e,this[r + 1] = e >>> 8,this[r + 2] = e >>> 16,this[r + 3] = e >>> 24):C(this,e,r,!0),r + 4;},t.prototype.writeInt32BE = function(e,r,i){return e = +e,r = 0 | r,i || k(this,e,r,4,2147483647,-2147483648),0 > e && (e = 4294967295 + e + 1),t.TYPED_ARRAY_SUPPORT?(this[r] = e >>> 24,this[r + 1] = e >>> 16,this[r + 2] = e >>> 8,this[r + 3] = 255 & e):C(this,e,r,!1),r + 4;},t.prototype.writeFloatLE = function(t,e,r){return B(this,t,e,!0,r);},t.prototype.writeFloatBE = function(t,e,r){return B(this,t,e,!1,r);},t.prototype.writeDoubleLE = function(t,e,r){return U(this,t,e,!0,r);},t.prototype.writeDoubleBE = function(t,e,r){return U(this,t,e,!1,r);},t.prototype.copy = function(e,r,i,n){if((i || (i = 0),n || 0 === n || (n = this.length),r >= e.length && (r = e.length),r || (r = 0),n > 0 && i > n && (n = i),n === i))return 0;if(0 === e.length || 0 === this.length)return 0;if(0 > r)throw new RangeError("targetStart out of bounds");if(0 > i || i >= this.length)throw new RangeError("sourceStart out of bounds");if(0 > n)throw new RangeError("sourceEnd out of bounds");n > this.length && (n = this.length),e.length - r < n - i && (n = e.length - r + i);var o,s=n - i;if(this === e && r > i && n > r)for(o = s - 1;o >= 0;o--) e[o + r] = this[o + i];else if(1e3 > s || !t.TYPED_ARRAY_SUPPORT)for(o = 0;s > o;o++) e[o + r] = this[o + i];else e._set(this.subarray(i,i + s),r);return s;},t.prototype.fill = function(t,e,r){if((t || (t = 0),e || (e = 0),r || (r = this.length),e > r))throw new RangeError("end < start");if(r !== e && 0 !== this.length){if(0 > e || e >= this.length)throw new RangeError("start out of bounds");if(0 > r || r > this.length)throw new RangeError("end out of bounds");var i;if("number" == typeof t)for(i = e;r > i;i++) this[i] = t;else {var n=j(t.toString()),o=n.length;for(i = e;r > i;i++) this[i] = n[i % o];}return this;}},t.prototype.toArrayBuffer = function(){if("undefined" != typeof Uint8Array){if(t.TYPED_ARRAY_SUPPORT)return new t(this).buffer;for(var e=new Uint8Array(this.length),r=0,i=e.length;i > r;r += 1) e[r] = this[r];return e.buffer;}throw new TypeError("Buffer.toArrayBuffer not supported in this browser");};var Q=t.prototype;t._augment = function(e){return e.constructor = t,e._isBuffer = !0,e._set = e.set,e.get = Q.get,e.set = Q.set,e.write = Q.write,e.toString = Q.toString,e.toLocaleString = Q.toString,e.toJSON = Q.toJSON,e.equals = Q.equals,e.compare = Q.compare,e.indexOf = Q.indexOf,e.copy = Q.copy,e.slice = Q.slice,e.readUIntLE = Q.readUIntLE,e.readUIntBE = Q.readUIntBE,e.readUInt8 = Q.readUInt8,e.readUInt16LE = Q.readUInt16LE,e.readUInt16BE = Q.readUInt16BE,e.readUInt32LE = Q.readUInt32LE,e.readUInt32BE = Q.readUInt32BE,e.readIntLE = Q.readIntLE,e.readIntBE = Q.readIntBE,e.readInt8 = Q.readInt8,e.readInt16LE = Q.readInt16LE,e.readInt16BE = Q.readInt16BE,e.readInt32LE = Q.readInt32LE,e.readInt32BE = Q.readInt32BE,e.readFloatLE = Q.readFloatLE,e.readFloatBE = Q.readFloatBE,e.readDoubleLE = Q.readDoubleLE,e.readDoubleBE = Q.readDoubleBE,e.writeUInt8 = Q.writeUInt8,e.writeUIntLE = Q.writeUIntLE,e.writeUIntBE = Q.writeUIntBE,e.writeUInt16LE = Q.writeUInt16LE,e.writeUInt16BE = Q.writeUInt16BE,e.writeUInt32LE = Q.writeUInt32LE,e.writeUInt32BE = Q.writeUInt32BE,e.writeIntLE = Q.writeIntLE,e.writeIntBE = Q.writeIntBE,e.writeInt8 = Q.writeInt8,e.writeInt16LE = Q.writeInt16LE,e.writeInt16BE = Q.writeInt16BE,e.writeInt32LE = Q.writeInt32LE,e.writeInt32BE = Q.writeInt32BE,e.writeFloatLE = Q.writeFloatLE,e.writeFloatBE = Q.writeFloatBE,e.writeDoubleLE = Q.writeDoubleLE,e.writeDoubleBE = Q.writeDoubleBE,e.fill = Q.fill,e.inspect = Q.inspect,e.toArrayBuffer = Q.toArrayBuffer,e;};var tt=/[^+\/0-9A-Za-z-_]/g;}).call(e,r(70).Buffer,(function(){return this;})());},function(t,e,r){var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";!(function(t){"use strict";function e(t){var e=t.charCodeAt(0);return e === s || e === c?62:e === a || e === f?63:u > e?-1:u + 10 > e?e - u + 26 + 26:l + 26 > e?e - l:h + 26 > e?e - h + 26:void 0;}function r(t){function r(t){h[c++] = t;}var i,n,s,a,u,h;if(t.length % 4 > 0)throw new Error("Invalid string. Length must be a multiple of 4");var l=t.length;u = "=" === t.charAt(l - 2)?2:"=" === t.charAt(l - 1)?1:0,h = new o(3 * t.length / 4 - u),s = u > 0?t.length - 4:t.length;var c=0;for(i = 0,n = 0;s > i;i += 4,n += 3) a = e(t.charAt(i)) << 18 | e(t.charAt(i + 1)) << 12 | e(t.charAt(i + 2)) << 6 | e(t.charAt(i + 3)),r((16711680 & a) >> 16),r((65280 & a) >> 8),r(255 & a);return 2 === u?(a = e(t.charAt(i)) << 2 | e(t.charAt(i + 1)) >> 4,r(255 & a)):1 === u && (a = e(t.charAt(i)) << 10 | e(t.charAt(i + 1)) << 4 | e(t.charAt(i + 2)) >> 2,r(a >> 8 & 255),r(255 & a)),h;}function n(t){function e(t){return i.charAt(t);}function r(t){return e(t >> 18 & 63) + e(t >> 12 & 63) + e(t >> 6 & 63) + e(63 & t);}var n,o,s,a=t.length % 3,u="";for(n = 0,s = t.length - a;s > n;n += 3) o = (t[n] << 16) + (t[n + 1] << 8) + t[n + 2],u += r(o);switch(a){case 1:o = t[t.length - 1],u += e(o >> 2),u += e(o << 4 & 63),u += "==";break;case 2:o = (t[t.length - 2] << 8) + t[t.length - 1],u += e(o >> 10),u += e(o >> 4 & 63),u += e(o << 2 & 63),u += "=";}return u;}var o="undefined" != typeof Uint8Array?Uint8Array:Array,s="+".charCodeAt(0),a="/".charCodeAt(0),u="0".charCodeAt(0),h="a".charCodeAt(0),l="A".charCodeAt(0),c="-".charCodeAt(0),f="_".charCodeAt(0);t.toByteArray = r,t.fromByteArray = n;})(e);},function(t,e){e.read = function(t,e,r,i,n){var o,s,a=8 * n - i - 1,u=(1 << a) - 1,h=u >> 1,l=-7,c=r?n - 1:0,f=r?-1:1,d=t[e + c];for(c += f,o = d & (1 << -l) - 1,d >>= -l,l += a;l > 0;o = 256 * o + t[e + c],c += f,l -= 8);for(s = o & (1 << -l) - 1,o >>= -l,l += i;l > 0;s = 256 * s + t[e + c],c += f,l -= 8);if(0 === o)o = 1 - h;else {if(o === u)return s?NaN:(d?-1:1) * (1 / 0);s += Math.pow(2,i),o -= h;}return (d?-1:1) * s * Math.pow(2,o - i);},e.write = function(t,e,r,i,n,o){var s,a,u,h=8 * o - n - 1,l=(1 << h) - 1,c=l >> 1,f=23 === n?Math.pow(2,-24) - Math.pow(2,-77):0,d=i?0:o - 1,p=i?1:-1,g=0 > e || 0 === e && 0 > 1 / e?1:0;for(e = Math.abs(e),isNaN(e) || e === 1 / 0?(a = isNaN(e)?1:0,s = l):(s = Math.floor(Math.log(e) / Math.LN2),e * (u = Math.pow(2,-s)) < 1 && (s--,u *= 2),e += s + c >= 1?f / u:f * Math.pow(2,1 - c),e * u >= 2 && (s++,u /= 2),s + c >= l?(a = 0,s = l):s + c >= 1?(a = (e * u - 1) * Math.pow(2,n),s += c):(a = e * Math.pow(2,c - 1) * Math.pow(2,n),s = 0));n >= 8;t[r + d] = 255 & a,d += p,a /= 256,n -= 8);for(s = s << n | a,h += n;h > 0;t[r + d] = 255 & s,d += p,s /= 256,h -= 8);t[r + d - p] |= 128 * g;};},function(t,e){var r=Array.isArray,i=Object.prototype.toString;t.exports = r || function(t){return !!t && "[object Array]" == i.call(t);};},function(t,e,r){var i=r(75);t.exports = function(){i.loggingEnabled() && console.log.apply(console,arguments);};},function(t,e){var r=!1;t.exports = {loggingEnabled:function loggingEnabled(t){return void 0 !== t && (r = t),r;}};},function(t,e,r){function i(t,e,r){var i=o(t);return r && s(t,e,r) && (e = void 0),e?n(i,e):i;}var n=r(77),o=r(83),s=r(84);t.exports = i;},[131,78,79],3,[132,80,81,82],5,6,7,55,10,[130,86,92,88],[131,87,88],3,[132,89,90,91],5,6,7,[133,93,94,95],9,10,11,function(t,e){function r(){this._events = this._events || {},this._maxListeners = this._maxListeners || void 0;}function i(t){return "function" == typeof t;}function n(t){return "number" == typeof t;}function o(t){return "object" == typeof t && null !== t;}function s(t){return void 0 === t;}t.exports = r,r.EventEmitter = r,r.prototype._events = void 0,r.prototype._maxListeners = void 0,r.defaultMaxListeners = 10,r.prototype.setMaxListeners = function(t){if(!n(t) || 0 > t || isNaN(t))throw TypeError("n must be a positive number");return this._maxListeners = t,this;},r.prototype.emit = function(t){var e,r,n,a,u,h;if((this._events || (this._events = {}),"error" === t && (!this._events.error || o(this._events.error) && !this._events.error.length))){if((e = arguments[1],e instanceof Error))throw e;throw TypeError('Uncaught, unspecified "error" event.');}if((r = this._events[t],s(r)))return !1;if(i(r))switch(arguments.length){case 1:r.call(this);break;case 2:r.call(this,arguments[1]);break;case 3:r.call(this,arguments[1],arguments[2]);break;default:a = Array.prototype.slice.call(arguments,1),r.apply(this,a);}else if(o(r))for(a = Array.prototype.slice.call(arguments,1),h = r.slice(),n = h.length,u = 0;n > u;u++) h[u].apply(this,a);return !0;},r.prototype.addListener = function(t,e){var n;if(!i(e))throw TypeError("listener must be a function");return this._events || (this._events = {}),this._events.newListener && this.emit("newListener",t,i(e.listener)?e.listener:e),this._events[t]?o(this._events[t])?this._events[t].push(e):this._events[t] = [this._events[t],e]:this._events[t] = e,o(this._events[t]) && !this._events[t].warned && (n = s(this._maxListeners)?r.defaultMaxListeners:this._maxListeners,n && n > 0 && this._events[t].length > n && (this._events[t].warned = !0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),"function" == typeof console.trace && console.trace())),this;},r.prototype.on = r.prototype.addListener,r.prototype.once = function(t,e){function r(){this.removeListener(t,r),n || (n = !0,e.apply(this,arguments));}if(!i(e))throw TypeError("listener must be a function");var n=!1;return r.listener = e,this.on(t,r),this;},r.prototype.removeListener = function(t,e){var r,n,s,a;if(!i(e))throw TypeError("listener must be a function");if(!this._events || !this._events[t])return this;if((r = this._events[t],s = r.length,n = -1,r === e || i(r.listener) && r.listener === e))delete this._events[t],this._events.removeListener && this.emit("removeListener",t,e);else if(o(r)){for(a = s;a-- > 0;) if(r[a] === e || r[a].listener && r[a].listener === e){n = a;break;}if(0 > n)return this;1 === r.length?(r.length = 0,delete this._events[t]):r.splice(n,1),this._events.removeListener && this.emit("removeListener",t,e);}return this;},r.prototype.removeAllListeners = function(t){var e,r;if(!this._events)return this;if(!this._events.removeListener)return 0 === arguments.length?this._events = {}:this._events[t] && delete this._events[t],this;if(0 === arguments.length){for(e in this._events) "removeListener" !== e && this.removeAllListeners(e);return this.removeAllListeners("removeListener"),this._events = {},this;}if((r = this._events[t],i(r)))this.removeListener(t,r);else if(r)for(;r.length;) this.removeListener(t,r[r.length - 1]);return delete this._events[t],this;},r.prototype.listeners = function(t){var e;return e = this._events && this._events[t]?i(this._events[t])?[this._events[t]]:this._events[t].slice():[];},r.prototype.listenerCount = function(t){if(this._events){var e=this._events[t];if(i(e))return 1;if(e)return e.length;}return 0;},r.listenerCount = function(t,e){return t.listenerCount(e);};},function(t,e,r){function i(){n.call(this);}t.exports = i;var n=r(96).EventEmitter,o=r(98);o(i,n),i.Readable = r(99),i.Writable = r(111),i.Duplex = r(112),i.Transform = r(113),i.PassThrough = r(114),i.Stream = i,i.prototype.pipe = function(t,e){function r(e){t.writable && !1 === t.write(e) && h.pause && h.pause();}function i(){h.readable && h.resume && h.resume();}function o(){l || (l = !0,t.end());}function s(){l || (l = !0,"function" == typeof t.destroy && t.destroy());}function a(t){if((u(),0 === n.listenerCount(this,"error")))throw t;}function u(){h.removeListener("data",r),t.removeListener("drain",i),h.removeListener("end",o),h.removeListener("close",s),h.removeListener("error",a),t.removeListener("error",a),h.removeListener("end",u),h.removeListener("close",u),t.removeListener("close",u);}var h=this;h.on("data",r),t.on("drain",i),t._isStdio || e && e.end === !1 || (h.on("end",o),h.on("close",s));var l=!1;return h.on("error",a),t.on("error",a),h.on("end",u),h.on("close",u),t.on("close",u),t.emit("pipe",h),t;};},function(t,e){"function" == typeof Object.create?t.exports = function(t,e){t.super_ = e,t.prototype = Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}});}:t.exports = function(t,e){t.super_ = e;var r=function r(){};r.prototype = e.prototype,t.prototype = new r(),t.prototype.constructor = t;};},function(t,e,r){e = t.exports = r(100),e.Stream = r(97),e.Readable = e,e.Writable = r(107),e.Duplex = r(106),e.Transform = r(109),e.PassThrough = r(110);},function(t,e,r){(function(e){function i(t,e){var i=r(106);t = t || {};var n=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark = n || 0 === n?n:o,this.highWaterMark = ~ ~this.highWaterMark,this.buffer = [],this.length = 0,this.pipes = null,this.pipesCount = 0,this.flowing = null,this.ended = !1,this.endEmitted = !1,this.reading = !1,this.sync = !0,this.needReadable = !1,this.emittedReadable = !1,this.readableListening = !1,this.objectMode = !!t.objectMode,e instanceof i && (this.objectMode = this.objectMode || !!t.readableObjectMode),this.defaultEncoding = t.defaultEncoding || "utf8",this.ranOut = !1,this.awaitDrain = 0,this.readingMore = !1,this.decoder = null,this.encoding = null,t.encoding && (D || (D = r(108).StringDecoder),this.decoder = new D(t.encoding),this.encoding = t.encoding);}function n(t){r(106);return this instanceof n?(this._readableState = new i(t,this),this.readable = !0,void I.call(this)):new n(t);}function o(t,e,r,i,n){var o=h(e,r);if(o)t.emit("error",o);else if(P.isNullOrUndefined(r))e.reading = !1,e.ended || l(t,e);else if(e.objectMode || r && r.length > 0)if(e.ended && !n){var a=new Error("stream.push() after EOF");t.emit("error",a);}else if(e.endEmitted && n){var a=new Error("stream.unshift() after end event");t.emit("error",a);}else !e.decoder || n || i || (r = e.decoder.write(r)),n || (e.reading = !1),e.flowing && 0 === e.length && !e.sync?(t.emit("data",r),t.read(0)):(e.length += e.objectMode?1:r.length,n?e.buffer.unshift(r):e.buffer.push(r),e.needReadable && c(t)),d(t,e);else n || (e.reading = !1);return s(e);}function s(t){return !t.ended && (t.needReadable || t.length < t.highWaterMark || 0 === t.length);}function a(t){if(t >= R)t = R;else {t--;for(var e=1;32 > e;e <<= 1) t |= t >> e;t++;}return t;}function u(t,e){return 0 === e.length && e.ended?0:e.objectMode?0 === t?0:1:isNaN(t) || P.isNull(t)?e.flowing && e.buffer.length?e.buffer[0].length:e.length:0 >= t?0:(t > e.highWaterMark && (e.highWaterMark = a(t)),t > e.length?e.ended?e.length:(e.needReadable = !0,0):t);}function h(t,e){var r=null;return P.isBuffer(e) || P.isString(e) || P.isNullOrUndefined(e) || t.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")),r;}function l(t,e){if(e.decoder && !e.ended){var r=e.decoder.end();r && r.length && (e.buffer.push(r),e.length += e.objectMode?1:r.length);}e.ended = !0,c(t);}function c(t){var r=t._readableState;r.needReadable = !1,r.emittedReadable || (L("emitReadable",r.flowing),r.emittedReadable = !0,r.sync?e.nextTick(function(){f(t);}):f(t));}function f(t){L("emit readable"),t.emit("readable"),m(t);}function d(t,r){r.readingMore || (r.readingMore = !0,e.nextTick(function(){p(t,r);}));}function p(t,e){for(var r=e.length;!e.reading && !e.flowing && !e.ended && e.length < e.highWaterMark && (L("maybeReadMore read 0"),t.read(0),r !== e.length);) r = e.length;e.readingMore = !1;}function g(t){return function(){var e=t._readableState;L("pipeOnDrain",e.awaitDrain),e.awaitDrain && e.awaitDrain--,0 === e.awaitDrain && b.listenerCount(t,"data") && (e.flowing = !0,m(t));};}function _(t,r){r.resumeScheduled || (r.resumeScheduled = !0,e.nextTick(function(){y(t,r);}));}function y(t,e){e.resumeScheduled = !1,t.emit("resume"),m(t),e.flowing && !e.reading && t.read(0);}function m(t){var e=t._readableState;if((L("flow",e.flowing),e.flowing))do var r=t.read();while(null !== r && e.flowing);}function E(t,e){var r,i=e.buffer,n=e.length,o=!!e.decoder,s=!!e.objectMode;if(0 === i.length)return null;if(0 === n)r = null;else if(s)r = i.shift();else if(!t || t >= n)r = o?i.join(""):T.concat(i,n),i.length = 0;else if(t < i[0].length){var a=i[0];r = a.slice(0,t),i[0] = a.slice(t);}else if(t === i[0].length)r = i.shift();else {r = o?"":new T(t);for(var u=0,h=0,l=i.length;l > h && t > u;h++) {var a=i[0],c=Math.min(t - u,a.length);o?r += a.slice(0,c):a.copy(r,u,0,c),c < a.length?i[0] = a.slice(c):i.shift(),u += c;}}return r;}function v(t){var r=t._readableState;if(r.length > 0)throw new Error("endReadable called on non-empty stream");r.endEmitted || (r.ended = !0,e.nextTick(function(){r.endEmitted || 0 !== r.length || (r.endEmitted = !0,t.readable = !1,t.emit("end"));}));}function S(t,e){for(var r=0,i=t.length;i > r;r++) e(t[r],r);}function A(t,e){for(var r=0,i=t.length;i > r;r++) if(t[r] === e)return r;return -1;}t.exports = n;var w=r(102),T=r(70).Buffer;n.ReadableState = i;var b=r(96).EventEmitter;b.listenerCount || (b.listenerCount = function(t,e){return t.listeners(e).length;});var I=r(97),P=r(103);P.inherits = r(104);var D,L=r(105);L = L && L.debuglog?L.debuglog("stream"):function(){},P.inherits(n,I),n.prototype.push = function(t,e){var r=this._readableState;return P.isString(t) && !r.objectMode && (e = e || r.defaultEncoding,e !== r.encoding && (t = new T(t,e),e = "")),o(this,r,t,e,!1);},n.prototype.unshift = function(t){var e=this._readableState;return o(this,e,t,"",!0);},n.prototype.setEncoding = function(t){return D || (D = r(108).StringDecoder),this._readableState.decoder = new D(t),this._readableState.encoding = t,this;};var R=8388608;n.prototype.read = function(t){L("read",t);var e=this._readableState,r=t;if(((!P.isNumber(t) || t > 0) && (e.emittedReadable = !1),0 === t && e.needReadable && (e.length >= e.highWaterMark || e.ended)))return L("read: emitReadable",e.length,e.ended),0 === e.length && e.ended?v(this):c(this),null;if((t = u(t,e),0 === t && e.ended))return 0 === e.length && v(this),null;var i=e.needReadable;L("need readable",i),(0 === e.length || e.length - t < e.highWaterMark) && (i = !0,L("length less than watermark",i)),(e.ended || e.reading) && (i = !1,L("reading or ended",i)),i && (L("do read"),e.reading = !0,e.sync = !0,0 === e.length && (e.needReadable = !0),this._read(e.highWaterMark),e.sync = !1),i && !e.reading && (t = u(r,e));var n;return n = t > 0?E(t,e):null,P.isNull(n) && (e.needReadable = !0,t = 0),e.length -= t,0 !== e.length || e.ended || (e.needReadable = !0),r !== t && e.ended && 0 === e.length && v(this),P.isNull(n) || this.emit("data",n),n;},n.prototype._read = function(t){this.emit("error",new Error("not implemented"));},n.prototype.pipe = function(t,r){function i(t){L("onunpipe"),t === c && o();}function n(){L("onend"),t.end();}function o(){L("cleanup"),t.removeListener("close",u),t.removeListener("finish",h),t.removeListener("drain",_),t.removeListener("error",a),t.removeListener("unpipe",i),c.removeListener("end",n),c.removeListener("end",o),c.removeListener("data",s),!f.awaitDrain || t._writableState && !t._writableState.needDrain || _();}function s(e){L("ondata");var r=t.write(e);!1 === r && (L("false write response, pause",c._readableState.awaitDrain),c._readableState.awaitDrain++,c.pause());}function a(e){L("onerror",e),l(),t.removeListener("error",a),0 === b.listenerCount(t,"error") && t.emit("error",e);}function u(){t.removeListener("finish",h),l();}function h(){L("onfinish"),t.removeListener("close",u),l();}function l(){L("unpipe"),c.unpipe(t);}var c=this,f=this._readableState;switch(f.pipesCount){case 0:f.pipes = t;break;case 1:f.pipes = [f.pipes,t];break;default:f.pipes.push(t);}f.pipesCount += 1,L("pipe count=%d opts=%j",f.pipesCount,r);var d=(!r || r.end !== !1) && t !== e.stdout && t !== e.stderr,p=d?n:o;f.endEmitted?e.nextTick(p):c.once("end",p),t.on("unpipe",i);var _=g(c);return t.on("drain",_),c.on("data",s),t._events && t._events.error?w(t._events.error)?t._events.error.unshift(a):t._events.error = [a,t._events.error]:t.on("error",a),t.once("close",u),t.once("finish",h),t.emit("pipe",c),f.flowing || (L("pipe resume"),c.resume()),t;},n.prototype.unpipe = function(t){var e=this._readableState;if(0 === e.pipesCount)return this;if(1 === e.pipesCount)return t && t !== e.pipes?this:(t || (t = e.pipes),e.pipes = null,e.pipesCount = 0,e.flowing = !1,t && t.emit("unpipe",this),this);if(!t){var r=e.pipes,i=e.pipesCount;e.pipes = null,e.pipesCount = 0,e.flowing = !1;for(var n=0;i > n;n++) r[n].emit("unpipe",this);return this;}var n=A(e.pipes,t);return -1 === n?this:(e.pipes.splice(n,1),e.pipesCount -= 1,1 === e.pipesCount && (e.pipes = e.pipes[0]),t.emit("unpipe",this),this);},n.prototype.on = function(t,r){var i=I.prototype.on.call(this,t,r);if(("data" === t && !1 !== this._readableState.flowing && this.resume(),"readable" === t && this.readable)){var n=this._readableState;if(!n.readableListening)if((n.readableListening = !0,n.emittedReadable = !1,n.needReadable = !0,n.reading))n.length && c(this,n);else {var o=this;e.nextTick(function(){L("readable nexttick read 0"),o.read(0);});}}return i;},n.prototype.addListener = n.prototype.on,n.prototype.resume = function(){var t=this._readableState;return t.flowing || (L("resume"),t.flowing = !0,t.reading || (L("resume read 0"),this.read(0)),_(this,t)),this;},n.prototype.pause = function(){return L("call pause flowing=%j",this._readableState.flowing),!1 !== this._readableState.flowing && (L("pause"),this._readableState.flowing = !1,this.emit("pause")),this;},n.prototype.wrap = function(t){var e=this._readableState,r=!1,i=this;t.on("end",function(){if((L("wrapped end"),e.decoder && !e.ended)){var t=e.decoder.end();t && t.length && i.push(t);}i.push(null);}),t.on("data",function(n){if((L("wrapped data"),e.decoder && (n = e.decoder.write(n)),n && (e.objectMode || n.length))){var o=i.push(n);o || (r = !0,t.pause());}});for(var n in t) P.isFunction(t[n]) && P.isUndefined(this[n]) && (this[n] = (function(e){return function(){return t[e].apply(t,arguments);};})(n));var o=["error","close","destroy","pause","resume"];return S(o,function(e){t.on(e,i.emit.bind(i,e));}),i._read = function(e){L("wrapped _read",e),r && (r = !1,t.resume());},i;},n._fromList = E;}).call(e,r(101));},function(t,e){function r(){h = !1,s.length?u = s.concat(u):l = -1,u.length && i();}function i(){if(!h){var t=setTimeout(r);h = !0;for(var e=u.length;e;) {for(s = u,u = [];++l < e;) s && s[l].run();l = -1,e = u.length;}s = null,h = !1,clearTimeout(t);}}function n(t,e){this.fun = t,this.array = e;}function o(){}var s,a=t.exports = {},u=[],h=!1,l=-1;a.nextTick = function(t){var e=new Array(arguments.length - 1);if(arguments.length > 1)for(var r=1;r < arguments.length;r++) e[r - 1] = arguments[r];u.push(new n(t,e)),1 !== u.length || h || setTimeout(i,0);},n.prototype.run = function(){this.fun.apply(null,this.array);},a.title = "browser",a.browser = !0,a.env = {},a.argv = [],a.version = "",a.versions = {},a.on = o,a.addListener = o,a.once = o,a.off = o,a.removeListener = o,a.removeAllListeners = o,a.emit = o,a.binding = function(t){throw new Error("process.binding is not supported");},a.cwd = function(){return "/";},a.chdir = function(t){throw new Error("process.chdir is not supported");},a.umask = function(){return 0;};},function(t,e){t.exports = Array.isArray || function(t){return "[object Array]" == Object.prototype.toString.call(t);};},function(t,e,r){(function(t){function r(t){return Array.isArray?Array.isArray(t):"[object Array]" === _(t);}function i(t){return "boolean" == typeof t;}function n(t){return null === t;}function o(t){return null == t;}function s(t){return "number" == typeof t;}function a(t){return "string" == typeof t;}function u(t){return "symbol" == typeof t;}function h(t){return void 0 === t;}function l(t){return "[object RegExp]" === _(t);}function c(t){return "object" == typeof t && null !== t;}function f(t){return "[object Date]" === _(t);}function d(t){return "[object Error]" === _(t) || t instanceof Error;}function p(t){return "function" == typeof t;}function g(t){return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || "undefined" == typeof t;}function _(t){return Object.prototype.toString.call(t);}e.isArray = r,e.isBoolean = i,e.isNull = n,e.isNullOrUndefined = o,e.isNumber = s,e.isString = a,e.isSymbol = u,e.isUndefined = h,e.isRegExp = l,e.isObject = c,e.isDate = f,e.isError = d,e.isFunction = p,e.isPrimitive = g,e.isBuffer = t.isBuffer;}).call(e,r(70).Buffer);},98,function(t,e){},function(t,e,r){(function(e){function i(t){return this instanceof i?(u.call(this,t),h.call(this,t),t && t.readable === !1 && (this.readable = !1),t && t.writable === !1 && (this.writable = !1),this.allowHalfOpen = !0,t && t.allowHalfOpen === !1 && (this.allowHalfOpen = !1),void this.once("end",n)):new i(t);}function n(){this.allowHalfOpen || this._writableState.ended || e.nextTick(this.end.bind(this));}function o(t,e){for(var r=0,i=t.length;i > r;r++) e(t[r],r);}t.exports = i;var s=Object.keys || function(t){var e=[];for(var r in t) e.push(r);return e;},a=r(103);a.inherits = r(104);var u=r(100),h=r(107);a.inherits(i,u),o(s(h.prototype),function(t){i.prototype[t] || (i.prototype[t] = h.prototype[t]);});}).call(e,r(101));},function(t,e,r){(function(e){function i(t,e,r){this.chunk = t,this.encoding = e,this.callback = r;}function n(t,e){var i=r(106);t = t || {};var n=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark = n || 0 === n?n:o,this.objectMode = !!t.objectMode,e instanceof i && (this.objectMode = this.objectMode || !!t.writableObjectMode),this.highWaterMark = ~ ~this.highWaterMark,this.needDrain = !1,this.ending = !1,this.ended = !1,this.finished = !1;var s=t.decodeStrings === !1;this.decodeStrings = !s,this.defaultEncoding = t.defaultEncoding || "utf8",this.length = 0,this.writing = !1,this.corked = 0,this.sync = !0,this.bufferProcessing = !1,this.onwrite = function(t){d(e,t);},this.writecb = null,this.writelen = 0,this.buffer = [],this.pendingcb = 0,this.prefinished = !1,this.errorEmitted = !1;}function o(t){var e=r(106);return this instanceof o || this instanceof e?(this._writableState = new n(t,this),this.writable = !0,void w.call(this)):new o(t);}function s(t,r,i){var n=new Error("write after end");t.emit("error",n),e.nextTick(function(){i(n);});}function a(t,r,i,n){var o=!0;if(!(A.isBuffer(i) || A.isString(i) || A.isNullOrUndefined(i) || r.objectMode)){var s=new TypeError("Invalid non-string/buffer chunk");t.emit("error",s),e.nextTick(function(){n(s);}),o = !1;}return o;}function u(t,e,r){return !t.objectMode && t.decodeStrings !== !1 && A.isString(e) && (e = new S(e,r)),e;}function h(t,e,r,n,o){r = u(e,r,n),A.isBuffer(r) && (n = "buffer");var s=e.objectMode?1:r.length;e.length += s;var a=e.length < e.highWaterMark;return a || (e.needDrain = !0),e.writing || e.corked?e.buffer.push(new i(r,n,o)):l(t,e,!1,s,r,n,o),a;}function l(t,e,r,i,n,o,s){e.writelen = i,e.writecb = s,e.writing = !0,e.sync = !0,r?t._writev(n,e.onwrite):t._write(n,o,e.onwrite),e.sync = !1;}function c(t,r,i,n,o){i?e.nextTick(function(){r.pendingcb--,o(n);}):(r.pendingcb--,o(n)),t._writableState.errorEmitted = !0,t.emit("error",n);}function f(t){t.writing = !1,t.writecb = null,t.length -= t.writelen,t.writelen = 0;}function d(t,r){var i=t._writableState,n=i.sync,o=i.writecb;if((f(i),r))c(t,i,n,r,o);else {var s=y(t,i);s || i.corked || i.bufferProcessing || !i.buffer.length || _(t,i),n?e.nextTick(function(){p(t,i,s,o);}):p(t,i,s,o);}}function p(t,e,r,i){r || g(t,e),e.pendingcb--,i(),E(t,e);}function g(t,e){0 === e.length && e.needDrain && (e.needDrain = !1,t.emit("drain"));}function _(t,e){if((e.bufferProcessing = !0,t._writev && e.buffer.length > 1)){for(var r=[],i=0;i < e.buffer.length;i++) r.push(e.buffer[i].callback);e.pendingcb++,l(t,e,!0,e.length,e.buffer,"",function(t){for(var i=0;i < r.length;i++) e.pendingcb--,r[i](t);}),e.buffer = [];}else {for(var i=0;i < e.buffer.length;i++) {var n=e.buffer[i],o=n.chunk,s=n.encoding,a=n.callback,u=e.objectMode?1:o.length;if((l(t,e,!1,u,o,s,a),e.writing)){i++;break;}}i < e.buffer.length?e.buffer = e.buffer.slice(i):e.buffer.length = 0;}e.bufferProcessing = !1;}function y(t,e){return e.ending && 0 === e.length && !e.finished && !e.writing;}function m(t,e){e.prefinished || (e.prefinished = !0,t.emit("prefinish"));}function E(t,e){var r=y(t,e);return r && (0 === e.pendingcb?(m(t,e),e.finished = !0,t.emit("finish")):m(t,e)),r;}function v(t,r,i){r.ending = !0,E(t,r),i && (r.finished?e.nextTick(i):t.once("finish",i)),r.ended = !0;}t.exports = o;var S=r(70).Buffer;o.WritableState = n;var A=r(103);A.inherits = r(104);var w=r(97);A.inherits(o,w),o.prototype.pipe = function(){this.emit("error",new Error("Cannot pipe. Not readable."));},o.prototype.write = function(t,e,r){var i=this._writableState,n=!1;return A.isFunction(e) && (r = e,e = null),A.isBuffer(t)?e = "buffer":e || (e = i.defaultEncoding),A.isFunction(r) || (r = function(){}),i.ended?s(this,i,r):a(this,i,t,r) && (i.pendingcb++,n = h(this,i,t,e,r)),n;},o.prototype.cork = function(){var t=this._writableState;t.corked++;},o.prototype.uncork = function(){var t=this._writableState;t.corked && (t.corked--,t.writing || t.corked || t.finished || t.bufferProcessing || !t.buffer.length || _(this,t));},o.prototype._write = function(t,e,r){r(new Error("not implemented"));},o.prototype._writev = null,o.prototype.end = function(t,e,r){var i=this._writableState;A.isFunction(t)?(r = t,t = null,e = null):A.isFunction(e) && (r = e,e = null),A.isNullOrUndefined(t) || this.write(t,e),i.corked && (i.corked = 1,this.uncork()),i.ending || i.finished || v(this,i,r);};}).call(e,r(101));},function(t,e,r){function i(t){if(t && !u(t))throw new Error("Unknown encoding: " + t);}function n(t){return t.toString(this.encoding);}function o(t){this.charReceived = t.length % 2,this.charLength = this.charReceived?2:0;}function s(t){this.charReceived = t.length % 3,this.charLength = this.charReceived?3:0;}var a=r(70).Buffer,u=a.isEncoding || function(t){switch(t && t.toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":case "raw":return !0;default:return !1;}},h=e.StringDecoder = function(t){switch((this.encoding = (t || "utf8").toLowerCase().replace(/[-_]/,""),i(t),this.encoding)){case "utf8":this.surrogateSize = 3;break;case "ucs2":case "utf16le":this.surrogateSize = 2,this.detectIncompleteChar = o;break;case "base64":this.surrogateSize = 3,this.detectIncompleteChar = s;break;default:return void (this.write = n);}this.charBuffer = new a(6),this.charReceived = 0,this.charLength = 0;};h.prototype.write = function(t){for(var e="";this.charLength;) {var r=t.length >= this.charLength - this.charReceived?this.charLength - this.charReceived:t.length;if((t.copy(this.charBuffer,this.charReceived,0,r),this.charReceived += r,this.charReceived < this.charLength))return "";t = t.slice(r,t.length),e = this.charBuffer.slice(0,this.charLength).toString(this.encoding);var i=e.charCodeAt(e.length - 1);if(!(i >= 55296 && 56319 >= i)){if((this.charReceived = this.charLength = 0,0 === t.length))return e;break;}this.charLength += this.surrogateSize,e = "";}this.detectIncompleteChar(t);var n=t.length;this.charLength && (t.copy(this.charBuffer,0,t.length - this.charReceived,n),n -= this.charReceived),e += t.toString(this.encoding,0,n);var n=e.length - 1,i=e.charCodeAt(n);if(i >= 55296 && 56319 >= i){var o=this.surrogateSize;return this.charLength += o,this.charReceived += o,this.charBuffer.copy(this.charBuffer,o,0,o),t.copy(this.charBuffer,0,0,o),e.substring(0,n);}return e;},h.prototype.detectIncompleteChar = function(t){for(var e=t.length >= 3?3:t.length;e > 0;e--) {var r=t[t.length - e];if(1 == e && r >> 5 == 6){this.charLength = 2;break;}if(2 >= e && r >> 4 == 14){this.charLength = 3;break;}if(3 >= e && r >> 3 == 30){this.charLength = 4;break;}}this.charReceived = e;},h.prototype.end = function(t){var e="";if((t && t.length && (e = this.write(t)),this.charReceived)){var r=this.charReceived,i=this.charBuffer,n=this.encoding;e += i.slice(0,r).toString(n);}return e;};},function(t,e,r){function i(t,e){this.afterTransform = function(t,r){return n(e,t,r);},this.needTransform = !1,this.transforming = !1,this.writecb = null,this.writechunk = null;}function n(t,e,r){var i=t._transformState;i.transforming = !1;var n=i.writecb;if(!n)return t.emit("error",new Error("no writecb in Transform class"));i.writechunk = null,i.writecb = null,u.isNullOrUndefined(r) || t.push(r),n && n(e);var o=t._readableState;o.reading = !1,(o.needReadable || o.length < o.highWaterMark) && t._read(o.highWaterMark);}function o(t){if(!(this instanceof o))return new o(t);a.call(this,t),this._transformState = new i(t,this);var e=this;this._readableState.needReadable = !0,this._readableState.sync = !1,this.once("prefinish",function(){u.isFunction(this._flush)?this._flush(function(t){s(e,t);}):s(e);});}function s(t,e){if(e)return t.emit("error",e);var r=t._writableState,i=t._transformState;if(r.length)throw new Error("calling transform done when ws.length != 0");if(i.transforming)throw new Error("calling transform done when still transforming");return t.push(null);}t.exports = o;var a=r(106),u=r(103);u.inherits = r(104),u.inherits(o,a),o.prototype.push = function(t,e){return this._transformState.needTransform = !1,a.prototype.push.call(this,t,e);},o.prototype._transform = function(t,e,r){throw new Error("not implemented");},o.prototype._write = function(t,e,r){var i=this._transformState;if((i.writecb = r,i.writechunk = t,i.writeencoding = e,!i.transforming)){var n=this._readableState;(i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);}},o.prototype._read = function(t){var e=this._transformState;u.isNull(e.writechunk) || !e.writecb || e.transforming?e.needTransform = !0:(e.transforming = !0,this._transform(e.writechunk,e.writeencoding,e.afterTransform));};},function(t,e,r){function i(t){return this instanceof i?void n.call(this,t):new i(t);}t.exports = i;var n=r(109),o=r(103);o.inherits = r(104),o.inherits(i,n),i.prototype._transform = function(t,e,r){r(null,t);};},function(t,e,r){t.exports = r(107);},function(t,e,r){t.exports = r(106);},function(t,e,r){t.exports = r(109);},function(t,e,r){t.exports = r(110);},function(t,e,r){(function(e){var i,n=r(74),o=r(69),s=(o.BaseTransform,o.BaseParser),a=r(116);t.exports = i = function(t,e){o.BaseParser.prototype.constructor.apply(this,arguments),t || (t = {audioTrackId:-1,videoTrackId:-1,tracks:[]}),this.muxer = new a(t),this.muxer.ondata = this._onMp4Data.bind(this),this.muxer.oncodecinfo = this._onCodecInfo.bind(this),this._codecInfo = null,this._timestamp = 0,e && (this.worker = "undefined" != typeof Worker?new Worker("/dist/mp4-mux-worker-bundle.js"):null),this.worker && (this.worker.onmessage = (function(t){this._onMp4Data(t.data);}).bind(this),this.worker.postMessage({mp4MuxProfile:t}));},i.Profiles = a.Profiles,i.prototype = o.createBaseParser({constructor:i,_onMp4Data:function _onMp4Data(t){n("_onMp4Data"),this.enqueue(new o.Transfer(new e(t),"buffer"));},_onCodecInfo:function _onCodecInfo(t){n("Codec info: " + t),this._codecInfo = t;},_onFinish:function _onFinish(t){n("MP4Mux._onFinish"),this.worker?this.worker.postMessage({eos:!0}):this.muxer && this.muxer.flush(),s.prototype._onFinish.call(this,t);},_parse:function _parse(t){var e;t.data && (e = this._timestamp = t.data.timestamp),t.data.flush && (this._needFlush = !0),n("UnitMP4Mux Timestamp: " + this._timestamp),n("UnitMP4Mux._parse: Payload type: " + typeof t.data),this.worker?(t.data.empty || this.worker.postMessage({data:t.data,meta:t.data.meta,timestamp:e,packetType:a.TYPE_AUDIO_PACKET}),this._needFlush && (this.worker.postMessage({eos:!0}),this._needFlush = !1)):this.muxer && (t.data.empty || this.muxer.pushPacket(a.TYPE_AUDIO_PACKET,new Uint8Array(t.data),e,t.data.meta),this._needFlush && (this.muxer.flush(),this._needFlush = !1));}});}).call(e,r(70).Buffer);},function(t,e,r){function i(t){for(var e=t.length >> 1,r=new Uint8Array(e),i=0;e > i;i++) r[i] = parseInt(t.substr(2 * i,2),16);return r;}function n(t,e){var r,i=0,n=s.RAW;switch(e.codecId){case c:var o=t[i++];n = o,r = 1024;break;case l:var u=t[i + 1] >> 3 & 3,f=t[i + 1] >> 1 & 3;r = 1 === f?3 === u?1152:576:3 === f?384:1152;}return info = {codecDescription:h[e.codecId],codecId:e.codecId,data:t.subarray(i),rate:e.sampleRate,size:e.sampleSize,channels:e.channels,samples:r,packetType:n},a("parsed audio packet with %d samples",r),info;}function o(t){var e=0,r=t[e] >> 4,i=15 & t[e];e++;var n={frameType:r,codecId:i,codecDescription:d[i]};switch(i){case g:var o=t[e++];n.packetType = o,n.compositionTime = (t[e] << 24 | t[e + 1] << 16 | t[e + 2] << 8) >> 8,e += 3;break;case p:n.packetType = _.NALU,n.horizontalOffset = t[e] >> 4 & 15,n.verticalOffset = 15 & t[e],n.compositionTime = 0,e++;}return n.data = t.subarray(e),n;}var s,a=r(74),u=r(117),h=["PCM","ADPCM","MP3","PCM le","Nellymouser16","Nellymouser8","Nellymouser","G.711 A-law","G.711 mu-law",null,"AAC","Speex","MP3 8khz"],l=2,c=10;!(function(t){t[t.HEADER = 0] = "HEADER",t[t.RAW = 1] = "RAW";})(s || (s = {}));var f,d=[null,"JPEG","Sorenson","Screen","VP6","VP6 alpha","Screen2","AVC"],p=4,g=7;!(function(t){t[t.KEY = 1] = "KEY",t[t.INNER = 2] = "INNER",t[t.DISPOSABLE = 3] = "DISPOSABLE",t[t.GENERATED = 4] = "GENERATED",t[t.INFO = 5] = "INFO";})(f || (f = {}));var _;!(function(t){t[t.HEADER = 0] = "HEADER",t[t.NALU = 1] = "NALU",t[t.END = 2] = "END";})(_ || (_ = {}));var y,m=8,E=9,v=!0;!(function(t){t[t.CAN_GENERATE_HEADER = 0] = "CAN_GENERATE_HEADER",t[t.NEED_HEADER_DATA = 1] = "NEED_HEADER_DATA",t[t.MAIN_PACKETS = 2] = "MAIN_PACKETS";})(y || (y = {}));var S=(function(){function t(t){var e=this;this.oncodecinfo = function(t){throw new Error("MP4Mux.oncodecinfo is not set");},this.ondata = function(t){throw new Error("MP4Mux.ondata is not set");},this.metadata = t,this.trackStates = this.metadata.tracks.map(function(t,r){var i={trackId:r + 1,trackInfo:t,cachedDuration:0,samplesProcessed:0,initializationData:[]};return e.metadata.audioTrackId === r && (e.audioTrackState = i),e.metadata.videoTrackId === r && (e.videoTrackState = i),i;},this),this._checkIfNeedHeaderData(),this.filePos = 0,this.cachedPackets = [],this.chunkIndex = 0;}return t.prototype.pushPacket = function(t,e,r,i){switch((this.state === y.CAN_GENERATE_HEADER && this._tryGenerateHeader(),t)){case m:var a=this.audioTrackState,u=n(e,i);if(!a || a.trackInfo.codecId !== u.codecId)throw new Error("Unexpected audio packet codec: " + u.codecDescription);switch(u.codecId){default:throw new Error("Unsupported audio codec: " + u.codecDescription);case l:break;case c:if(u.packetType === s.HEADER)return void a.initializationData.push(u.data);}this.cachedPackets.push({packet:u,timestamp:r,trackId:a.trackId});break;case E:var h=this.videoTrackState,f=o(e);if(!h || h.trackInfo.codecId !== f.codecId)throw new Error("Unexpected video packet codec: " + f.codecDescription);switch(f.codecId){default:throw new Error("unsupported video codec: " + f.codecDescription);case p:break;case g:if(f.packetType === _.HEADER)return void h.initializationData.push(f.data);}this.cachedPackets.push({packet:f,timestamp:r,trackId:h.trackId});break;default:throw new Error("unknown packet type: " + t);}this.state === y.NEED_HEADER_DATA && this._tryGenerateHeader();},t.prototype.flush = function(){this.cachedPackets.length > 0 && this._chunk();},t.prototype._checkIfNeedHeaderData = function(){this.trackStates.some(function(t){return t.trackInfo.codecId === c || t.trackInfo.codecId === g;})?this.state = y.NEED_HEADER_DATA:this.state = y.CAN_GENERATE_HEADER;},t.prototype._tryGenerateHeader = function(){var t=this.trackStates.every(function(t){switch(t.trackInfo.codecId){case c:case g:return t.initializationData.length > 0;default:return !0;}});if(t){for(var e=["isom"],r=1,n=1,o=[],s=0;s < this.trackStates.length;s++) {var a,h=this.trackStates[s],f=h.trackInfo;switch(f.codecId){case c:var d=h.initializationData[0];a = new u.AudioSampleEntry("mp4a",r,f.channels,f.samplesize,f.samplerate);var _=new Uint8Array(41 + d.length);_.set(i("0000000003808080"),0),_[8] = 32 + d.length,_.set(i("00020004808080"),9),_[16] = 18 + d.length,_.set(i("40150000000000FA000000000005808080"),17),_[34] = d.length,_.set(d,35),_.set(i("068080800102"),35 + d.length),a.otherBoxes = [new u.RawTag("esds",_)];var m=d[0] >> 3;h.mimeTypeCodec = "mp4a.40." + m;break;case l:a = new u.AudioSampleEntry(".mp3",r,f.channels,f.samplesize,f.samplerate),h.mimeTypeCodec = "mp3";break;case g:var E=h.initializationData[0];a = new u.VideoSampleEntry("avc1",n,f.width,f.height),a.otherBoxes = [new u.RawTag("avcC",E)];var v=E[1] << 16 | E[2] << 8 | E[3];h.mimeTypeCodec = "avc1." + (16777216 | v).toString(16).substr(1),e.push("iso2","avc1","mp41");break;case p:a = new u.VideoSampleEntry("VP6F",n,f.width,f.height),a.otherBoxes = [new u.RawTag("glbl",i("00"))],h.mimeTypeCodec = "avc1.42001E";break;default:throw new Error("not supported track type");}var S,A=u.TrackHeaderFlags.TRACK_ENABLED | u.TrackHeaderFlags.TRACK_IN_MOVIE;h === this.audioTrackState?S = new u.TrackBox(new u.TrackHeaderBox(A,h.trackId,-1,0,0,1,s),new u.MediaBox(new u.MediaHeaderBox(f.timescale,-1,f.language),new u.HandlerBox("soun","SoundHandler"),new u.MediaInformationBox(new u.SoundMediaHeaderBox(),new u.DataInformationBox(new u.DataReferenceBox([new u.DataEntryUrlBox(u.SELF_CONTAINED_DATA_REFERENCE_FLAG)])),new u.SampleTableBox(new u.SampleDescriptionBox([a]),new u.RawTag("stts",i("0000000000000000")),new u.RawTag("stsc",i("0000000000000000")),new u.RawTag("stsz",i("000000000000000000000000")),new u.RawTag("stco",i("0000000000000000")))))):h === this.videoTrackState && (S = new u.TrackBox(new u.TrackHeaderBox(A,h.trackId,-1,f.width,f.height,0,s),new u.MediaBox(new u.MediaHeaderBox(f.timescale,-1,f.language),new u.HandlerBox("vide","VideoHandler"),new u.MediaInformationBox(new u.VideoMediaHeaderBox(),new u.DataInformationBox(new u.DataReferenceBox([new u.DataEntryUrlBox(u.SELF_CONTAINED_DATA_REFERENCE_FLAG)])),new u.SampleTableBox(new u.SampleDescriptionBox([a]),new u.RawTag("stts",i("0000000000000000")),new u.RawTag("stsc",i("0000000000000000")),new u.RawTag("stsz",i("000000000000000000000000")),new u.RawTag("stco",i("0000000000000000"))))))),o.push(S);}var w=new u.MovieExtendsBox(null,[new u.TrackExtendsBox(1,1,0,0,0),new u.TrackExtendsBox(2,1,0,0,0)],null),T=new u.BoxContainerBox("udat",[new u.MetaBox(new u.RawTag("hdlr",i("00000000000000006D6469726170706C000000000000000000")),[new u.RawTag("ilst",i("00000025A9746F6F0000001D6461746100000001000000004C61766635342E36332E313034"))])]),b=new u.MovieHeaderBox(1e3,0,this.trackStates.length + 1),I=new u.MovieBox(b,o,w,T),P=new u.FileTypeBox("isom",512,e),D=P.layout(0),L=I.layout(D),R=new Uint8Array(D + L);P.write(R),I.write(R),this.oncodecinfo(this.trackStates.map(function(t){return t.mimeTypeCodec;})),this.ondata(R),this.filePos += R.length,this.state = y.MAIN_PACKETS;}},t.prototype._chunk = function(){var t=this.cachedPackets;if(v && this.videoTrackState){for(var e=t.length - 1,r=this.videoTrackState.trackId;e > 0 && (t[e].trackId !== r || t[e].packet.frameType !== f.KEY);) e--;e > 0 && (t = t.slice(0,e));}if(0 !== t.length){for(var i=[],n=0,o=[],s=[],a=0;a < this.trackStates.length;a++) {var h=this.trackStates[a],d=h.trackInfo,_=h.trackId,y=t.filter(function(t){return t.trackId === _;});if(0 !== y.length){var m,E,S,A=new u.TrackFragmentBaseMediaDecodeTimeBox(h.cachedDuration);switch((s.push(n),d.codecId)){case c:case l:S = [];for(var e=0;e < y.length;e++) {var w=y[e].packet,T=Math.round(w.samples * d.timescale / d.samplerate);i.push(w.data),n += w.data.length,S.push({duration:T,size:w.data.length}),h.samplesProcessed += w.samples;}var b=u.TrackFragmentFlags.DEFAULT_SAMPLE_FLAGS_PRESENT;m = new u.TrackFragmentHeaderBox(b,_,0,0,0,0,u.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS);var I=u.TrackRunFlags.DATA_OFFSET_PRESENT | u.TrackRunFlags.SAMPLE_DURATION_PRESENT | u.TrackRunFlags.SAMPLE_SIZE_PRESENT;E = new u.TrackRunBox(I,S,0,0),h.cachedDuration = Math.round(h.samplesProcessed * d.timescale / d.samplerate);break;case g:case p:S = [];for(var P=h.samplesProcessed,D=P * d.timescale / d.framerate,L=Math.round(D),e=0;e < y.length;e++) {var R=y[e].packet;P++;var O=Math.round(P * d.timescale / d.framerate),M=O - L;L = O;var N=Math.round(P * d.timescale / d.framerate + R.compositionTime * d.timescale / 1e3);i.push(R.data),n += R.data.length;var k=R.frameType === f.KEY?u.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS:u.SampleFlags.SAMPLE_DEPENDS_ON_OTHER | u.SampleFlags.SAMPLE_IS_NOT_SYNC;S.push({duration:M,size:R.data.length,flags:k,compositionTimeOffset:N - O});}var b=u.TrackFragmentFlags.DEFAULT_SAMPLE_FLAGS_PRESENT;m = new u.TrackFragmentHeaderBox(b,_,0,0,0,0,u.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS);var I=u.TrackRunFlags.DATA_OFFSET_PRESENT | u.TrackRunFlags.SAMPLE_DURATION_PRESENT | u.TrackRunFlags.SAMPLE_SIZE_PRESENT | u.TrackRunFlags.SAMPLE_FLAGS_PRESENT | u.TrackRunFlags.SAMPLE_COMPOSITION_TIME_OFFSET;E = new u.TrackRunBox(I,S,0,0),h.cachedDuration = L,h.samplesProcessed = P;break;default:throw new Error("Un codec");}var x=new u.TrackFragmentBox(m,A,E);o.push(x);}}this.cachedPackets.splice(0,t.length);for(var C=new u.MovieFragmentHeaderBox(++this.chunkIndex),F=new u.MovieFragmentBox(C,o),B=F.layout(0),U=new u.MediaDataBox(i),H=U.layout(B),G=B + 8,a=0;a < o.length;a++) o[a].run.dataOffset = G + s[a];var Y=new Uint8Array(B + H);F.write(Y),U.write(Y),this.ondata(Y),this.filePos += Y.length;}},t;})();t.exports = S,S.MP3_SOUND_CODEC_ID = l,S.AAC_SOUND_CODEC_ID = c,S.TYPE_AUDIO_PACKET = m,S.TYPE_VIDEO_PACKET = E,S.Profiles = {MP3_AUDIO_ONLY:{audioTrackId:0,videoTrackId:-1,tracks:[{codecId:S.MP3_SOUND_CODEC_ID,channels:2,samplerate:44100,samplesize:16,timescale:44100}]}};},function(t,e){function r(t){for(var e=new Uint8Array(4 * t.length),r=0,i=0,n=t.length;n > i;i++) {var o=t.charCodeAt(i);if(127 >= o)e[r++] = o;else {if(o >= 55296 && 56319 >= o){var s=t.charCodeAt(i + 1);s >= 56320 && 57343 >= s && (o = ((1023 & o) << 10) + (1023 & s) + 65536,++i);}0 !== (4292870144 & o)?(e[r++] = 248 | o >>> 24 & 3,e[r++] = 128 | o >>> 18 & 63,e[r++] = 128 | o >>> 12 & 63,e[r++] = 128 | o >>> 6 & 63,e[r++] = 128 | 63 & o):0 !== (4294901760 & o)?(e[r++] = 240 | o >>> 18 & 7,e[r++] = 128 | o >>> 12 & 63,e[r++] = 128 | o >>> 6 & 63,e[r++] = 128 | 63 & o):0 !== (4294965248 & o)?(e[r++] = 224 | o >>> 12 & 15,e[r++] = 128 | o >>> 6 & 63,e[r++] = 128 | 63 & o):(e[r++] = 192 | o >>> 6 & 31,e[r++] = 128 | 63 & o);}}return e.subarray(0,r);}function i(t){for(var e=[],r=1;r < arguments.length;r++) e[r - 1] = arguments[r];return Array.prototype.concat.apply(t,e);}function n(t,e,r){t[e] = r >> 24 & 255,t[e + 1] = r >> 16 & 255,t[e + 2] = r >> 8 & 255,t[e + 3] = 255 & r;}function o(t){return t.charCodeAt(0) << 24 | t.charCodeAt(1) << 16 | t.charCodeAt(2) << 8 | t.charCodeAt(3);}function s(t){return (t - d) / 1e3 | 0;}function a(t){return 65536 * t | 0;}function u(t){return 1073741824 * t | 0;}function h(t){return 256 * t | 0;}function l(t){return (31 & t.charCodeAt(0)) << 10 | (31 & t.charCodeAt(1)) << 5 | 31 & t.charCodeAt(2);}var c,f=this && this.__extends || function(t,e){function r(){this.constructor = t;}for(var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);t.prototype = null === e?Object.create(e):(r.prototype = e.prototype,new r());};t.exports = c = {};var d=-20828448e5,p=[1,0,0,0,1,0,0,0,1],g=[0,0,0],_=(function(){function t(t,e){this.boxtype = t,"uuid" === t && (this.userType = e);}return t.prototype.layout = function(t){this.offset = t;var e=8;return this.userType && (e += 16),this.size = e,e;},t.prototype.write = function(t){return n(t,this.offset,this.size),n(t,this.offset + 4,o(this.boxtype)),this.userType?(t.set(this.userType,this.offset + 8),24):8;},t.prototype.toUint8Array = function(){var t=this.layout(0),e=new Uint8Array(t);return this.write(e),e;},t;})();c.Box = _;var y=(function(t){function e(e,r,i){void 0 === r && (r = 0),void 0 === i && (i = 0),t.call(this,e),this.version = r,this.flags = i;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 4,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,this.version << 24 | this.flags),r + 4;},e;})(_);c.FullBox = y;var m=(function(t){function e(e,r,i){t.call(this,"ftype"),this.majorBrand = e,this.minorVersion = r,this.compatibleBrands = i;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 4 * (2 + this.compatibleBrands.length),this.size;},e.prototype.write = function(e){var r=this,i=t.prototype.write.call(this,e);return n(e,this.offset + i,o(this.majorBrand)),n(e,this.offset + i + 4,this.minorVersion),i += 8,this.compatibleBrands.forEach(function(t){n(e,r.offset + i,o(t)),i += 4;},this),i;},e;})(_);c.FileTypeBox = m;var E=(function(t){function e(e,r){t.call(this,e),this.children = r;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e);return this.children.forEach(function(t){t && (r += t.layout(e + r));}),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return this.children.forEach(function(t){t && (r += t.write(e));}),r;},e;})(_);c.BoxContainerBox = E;var v=(function(t){function e(e,r,n,o){t.call(this,"moov",i([e],r,[n,o])),this.header = e,this.tracks = r,this.extendsBox = n,this.userData = o;}return f(e,t),e;})(E);c.MovieBox = v;var S=(function(t){function e(e,r,i,n,o,s,a,u){void 0 === n && (n = 1),void 0 === o && (o = 1),void 0 === s && (s = p),void 0 === a && (a = d),void 0 === u && (u = d),t.call(this,"mvhd",0,0),this.timescale = e,this.duration = r,this.nextTrackId = i,this.rate = n,this.volume = o,this.matrix = s,this.creationTime = a,this.modificationTime = u;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 16 + 4 + 2 + 2 + 8 + 36 + 24 + 4,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,s(this.creationTime)),n(e,this.offset + r + 4,s(this.modificationTime)),n(e,this.offset + r + 8,this.timescale),n(e,this.offset + r + 12,this.duration),r += 16,n(e,this.offset + r,a(this.rate)),n(e,this.offset + r + 4,h(this.volume) << 16),n(e,this.offset + r + 8,0),n(e,this.offset + r + 12,0),r += 16,n(e,this.offset + r,a(this.matrix[0])),n(e,this.offset + r + 4,a(this.matrix[1])),n(e,this.offset + r + 8,a(this.matrix[2])),n(e,this.offset + r + 12,a(this.matrix[3])),n(e,this.offset + r + 16,a(this.matrix[4])),n(e,this.offset + r + 20,a(this.matrix[5])),n(e,this.offset + r + 24,u(this.matrix[6])),n(e,this.offset + r + 28,u(this.matrix[7])),n(e,this.offset + r + 32,u(this.matrix[8])),r += 36,n(e,this.offset + r,0),n(e,this.offset + r + 4,0),n(e,this.offset + r + 8,0),n(e,this.offset + r + 12,0),n(e,this.offset + r + 16,0),n(e,this.offset + r + 20,0),r += 24,n(e,this.offset + r,this.nextTrackId),r += 4;},e;})(y);c.MovieHeaderBox = S,(function(t){t[t.TRACK_ENABLED = 1] = "TRACK_ENABLED",t[t.TRACK_IN_MOVIE = 2] = "TRACK_IN_MOVIE",t[t.TRACK_IN_PREVIEW = 4] = "TRACK_IN_PREVIEW";})(c.TrackHeaderFlags || (c.TrackHeaderFlags = {}));var A=(c.TrackHeaderFlags,(function(t){function e(e,r,i,n,o,s,a,u,h,l,c){void 0 === a && (a = 0),void 0 === u && (u = 0),void 0 === h && (h = p),void 0 === l && (l = d),void 0 === c && (c = d),t.call(this,"tkhd",0,e),this.trackId = r,this.duration = i,this.width = n,this.height = o,this.volume = s,this.alternateGroup = a,this.layer = u,this.matrix = h,this.creationTime = l,this.modificationTime = c;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 20 + 8 + 6 + 2 + 36 + 8,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,s(this.creationTime)),n(e,this.offset + r + 4,s(this.modificationTime)),n(e,this.offset + r + 8,this.trackId),n(e,this.offset + r + 12,0),n(e,this.offset + r + 16,this.duration),r += 20,n(e,this.offset + r,0),n(e,this.offset + r + 4,0),n(e,this.offset + r + 8,this.layer << 16 | this.alternateGroup),n(e,this.offset + r + 12,h(this.volume) << 16),r += 16,n(e,this.offset + r,a(this.matrix[0])),n(e,this.offset + r + 4,a(this.matrix[1])),n(e,this.offset + r + 8,a(this.matrix[2])),n(e,this.offset + r + 12,a(this.matrix[3])),n(e,this.offset + r + 16,a(this.matrix[4])),n(e,this.offset + r + 20,a(this.matrix[5])),n(e,this.offset + r + 24,u(this.matrix[6])),n(e,this.offset + r + 28,u(this.matrix[7])),n(e,this.offset + r + 32,u(this.matrix[8])),r += 36,n(e,this.offset + r,a(this.width)),n(e,this.offset + r + 4,a(this.height)),r += 8;},e;})(y));c.TrackHeaderBox = A;var w=(function(t){function e(e,r,i,n,o){void 0 === i && (i = "unk"),void 0 === n && (n = d),void 0 === o && (o = d),t.call(this,"mdhd",0,0),this.timescale = e,this.duration = r,this.language = i,this.creationTime = n,this.modificationTime = o;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 16 + 4,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,s(this.creationTime)),n(e,this.offset + r + 4,s(this.modificationTime)),n(e,this.offset + r + 8,this.timescale),n(e,this.offset + r + 12,this.duration),n(e,this.offset + r + 16,l(this.language) << 16),r + 20;},e;})(y);c.MediaHeaderBox = w;var T=(function(t){function e(e,i){t.call(this,"hdlr",0,0),this.handlerType = e,this.name = i,this._encodedName = r(this.name);}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 8 + 12 + (this._encodedName.length + 1),this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,0),n(e,this.offset + r + 4,o(this.handlerType)),n(e,this.offset + r + 8,0),n(e,this.offset + r + 12,0),n(e,this.offset + r + 16,0),r += 20,e.set(this._encodedName,this.offset + r),e[this.offset + r + this._encodedName.length] = 0,r += this._encodedName.length + 1;},e;})(y);c.HandlerBox = T;var b=(function(t){function e(e){void 0 === e && (e = 0),t.call(this,"smhd",0,0),this.balance = e;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 4,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,h(this.balance) << 16),r + 4;},e;})(y);c.SoundMediaHeaderBox = b;var I=(function(t){function e(e,r){void 0 === e && (e = 0),void 0 === r && (r = g),t.call(this,"vmhd",0,0),this.graphicsMode = e,this.opColor = r;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 8,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,this.graphicsMode << 16 | this.opColor[0]),n(e,this.offset + r + 4,this.opColor[1] << 16 | this.opColor[2]),r + 8;},e;})(y);c.VideoMediaHeaderBox = I,c.SELF_CONTAINED_DATA_REFERENCE_FLAG = 1;var P=(function(t){function e(e,i){void 0 === i && (i = null),t.call(this,"url ",0,e),this.location = i,e & c.SELF_CONTAINED_DATA_REFERENCE_FLAG || (this._encodedLocation = r(i));}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e);return this._encodedLocation && (r += this._encodedLocation.length + 1),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return this._encodedLocation && (e.set(this._encodedLocation,this.offset + r),e[this.offset + r + this._encodedLocation.length] = 0,r += this._encodedLocation.length),r;},e;})(y);c.DataEntryUrlBox = P;var D=(function(t){function e(e){t.call(this,"dref",0,0),this.entries = e;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e) + 4;return this.entries.forEach(function(t){r += t.layout(e + r);}),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,this.entries.length),this.entries.forEach(function(t){r += t.write(e);}),r;},e;})(y);c.DataReferenceBox = D;var L=(function(t){function e(e){t.call(this,"dinf",[e]),this.dataReference = e;}return f(e,t),e;})(E);c.DataInformationBox = L;var R=(function(t){function e(e){t.call(this,"stsd",0,0),this.entries = e;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e);return r += 4,this.entries.forEach(function(t){r += t.layout(e + r);}),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,this.entries.length),r += 4,this.entries.forEach(function(t){r += t.write(e);}),r;},e;})(y);c.SampleDescriptionBox = R;var O=(function(t){function e(e,r,i,n,o){t.call(this,"stbl",[e,r,i,n,o]),this.sampleDescriptions = e,this.timeToSample = r,this.sampleToChunk = i,this.sampleSizes = n,this.chunkOffset = o;}return f(e,t),e;})(E);c.SampleTableBox = O;var M=(function(t){function e(e,r,i){t.call(this,"minf",[e,r,i]),this.header = e,this.info = r,this.sampleTable = i;}return f(e,t),e;})(E);c.MediaInformationBox = M;var N=(function(t){function e(e,r,i){t.call(this,"mdia",[e,r,i]),this.header = e,this.handler = r,this.info = i;}return f(e,t),e;})(E);c.MediaBox = N;var k=(function(t){function e(e,r){t.call(this,"trak",[e,r]),this.header = e,this.media = r;}return f(e,t),e;})(E);c.TrackBox = k;var x=(function(t){function e(e,r,i,n,o){t.call(this,"trex",0,0),this.trackId = e,this.defaultSampleDescriptionIndex = r,this.defaultSampleDuration = i,this.defaultSampleSize = n,this.defaultSampleFlags = o;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 20,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,this.trackId),n(e,this.offset + r + 4,this.defaultSampleDescriptionIndex),n(e,this.offset + r + 8,this.defaultSampleDuration),n(e,this.offset + r + 12,this.defaultSampleSize),n(e,this.offset + r + 16,this.defaultSampleFlags),r + 20;},e;})(y);c.TrackExtendsBox = x;var C=(function(t){function e(e,r,n){t.call(this,"mvex",i([e],r,[n])),this.header = e,this.tracDefaults = r,this.levels = n;}return f(e,t),e;})(E);c.MovieExtendsBox = C;var F=(function(t){function e(e,r){t.call(this,"meta",0,0),this.handler = e,this.otherBoxes = r;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e);return r += this.handler.layout(e + r),this.otherBoxes.forEach(function(t){r += t.layout(e + r);}),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return r += this.handler.write(e),this.otherBoxes.forEach(function(t){r += t.write(e);}),r;},e;})(y);c.MetaBox = F;var B=(function(t){function e(e){t.call(this,"mfhd",0,0),this.sequenceNumber = e;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 4,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,this.sequenceNumber),r + 4;},e;})(y);c.MovieFragmentHeaderBox = B,(function(t){t[t.BASE_DATA_OFFSET_PRESENT = 1] = "BASE_DATA_OFFSET_PRESENT",t[t.SAMPLE_DESCRIPTION_INDEX_PRESENT = 2] = "SAMPLE_DESCRIPTION_INDEX_PRESENT",t[t.DEFAULT_SAMPLE_DURATION_PRESENT = 8] = "DEFAULT_SAMPLE_DURATION_PRESENT",t[t.DEFAULT_SAMPLE_SIZE_PRESENT = 16] = "DEFAULT_SAMPLE_SIZE_PRESENT",t[t.DEFAULT_SAMPLE_FLAGS_PRESENT = 32] = "DEFAULT_SAMPLE_FLAGS_PRESENT";})(c.TrackFragmentFlags || (c.TrackFragmentFlags = {}));var U=c.TrackFragmentFlags,H=(function(t){function e(e,r,i,n,o,s,a){t.call(this,"tfhd",0,e),this.trackId = r,this.baseDataOffset = i,this.sampleDescriptionIndex = n,this.defaultSampleDuration = o,this.defaultSampleSize = s,this.defaultSampleFlags = a;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e) + 4,i=this.flags;return i & U.BASE_DATA_OFFSET_PRESENT && (r += 8),i & U.SAMPLE_DESCRIPTION_INDEX_PRESENT && (r += 4),i & U.DEFAULT_SAMPLE_DURATION_PRESENT && (r += 4),i & U.DEFAULT_SAMPLE_SIZE_PRESENT && (r += 4),i & U.DEFAULT_SAMPLE_FLAGS_PRESENT && (r += 4),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e),i=this.flags;return n(e,this.offset + r,this.trackId),r += 4,i & U.BASE_DATA_OFFSET_PRESENT && (n(e,this.offset + r,0),n(e,this.offset + r + 4,this.baseDataOffset),r += 8),i & U.SAMPLE_DESCRIPTION_INDEX_PRESENT && (n(e,this.offset + r,this.sampleDescriptionIndex),r += 4),i & U.DEFAULT_SAMPLE_DURATION_PRESENT && (n(e,this.offset + r,this.defaultSampleDuration),r += 4),i & U.DEFAULT_SAMPLE_SIZE_PRESENT && (n(e,this.offset + r,this.defaultSampleSize),r += 4),i & U.DEFAULT_SAMPLE_FLAGS_PRESENT && (n(e,this.offset + r,this.defaultSampleFlags),r += 4),r;},e;})(y);c.TrackFragmentHeaderBox = H;var G=(function(t){function e(e){t.call(this,"tfdt",0,0),this.baseMediaDecodeTime = e;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 4,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,this.baseMediaDecodeTime),r + 4;},e;})(y);c.TrackFragmentBaseMediaDecodeTimeBox = G;var Y=(function(t){function e(e,r,i){t.call(this,"traf",[e,r,i]),this.header = e,this.decodeTime = r,this.run = i;}return f(e,t),e;})(E);c.TrackFragmentBox = Y,(function(t){t[t.IS_LEADING_MASK = 201326592] = "IS_LEADING_MASK",t[t.SAMPLE_DEPENDS_ON_MASK = 50331648] = "SAMPLE_DEPENDS_ON_MASK",t[t.SAMPLE_DEPENDS_ON_OTHER = 16777216] = "SAMPLE_DEPENDS_ON_OTHER",t[t.SAMPLE_DEPENDS_ON_NO_OTHERS = 33554432] = "SAMPLE_DEPENDS_ON_NO_OTHERS",t[t.SAMPLE_IS_DEPENDED_ON_MASK = 12582912] = "SAMPLE_IS_DEPENDED_ON_MASK",t[t.SAMPLE_HAS_REDUNDANCY_MASK = 3145728] = "SAMPLE_HAS_REDUNDANCY_MASK",t[t.SAMPLE_PADDING_VALUE_MASK = 917504] = "SAMPLE_PADDING_VALUE_MASK",t[t.SAMPLE_IS_NOT_SYNC = 65536] = "SAMPLE_IS_NOT_SYNC",t[t.SAMPLE_DEGRADATION_PRIORITY_MASK = 65535] = "SAMPLE_DEGRADATION_PRIORITY_MASK";})(c.SampleFlags || (c.SampleFlags = {}));c.SampleFlags;!(function(t){t[t.DATA_OFFSET_PRESENT = 1] = "DATA_OFFSET_PRESENT",t[t.FIRST_SAMPLE_FLAGS_PRESENT = 4] = "FIRST_SAMPLE_FLAGS_PRESENT",t[t.SAMPLE_DURATION_PRESENT = 256] = "SAMPLE_DURATION_PRESENT",t[t.SAMPLE_SIZE_PRESENT = 512] = "SAMPLE_SIZE_PRESENT",t[t.SAMPLE_FLAGS_PRESENT = 1024] = "SAMPLE_FLAGS_PRESENT",t[t.SAMPLE_COMPOSITION_TIME_OFFSET = 2048] = "SAMPLE_COMPOSITION_TIME_OFFSET";})(c.TrackRunFlags || (c.TrackRunFlags = {}));var j=c.TrackRunFlags,z=(function(t){function e(e,r,i,n){t.call(this,"trun",1,e),this.samples = r,this.dataOffset = i,this.firstSampleFlags = n;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e) + 4,i=this.samples.length,n=this.flags;return n & j.DATA_OFFSET_PRESENT && (r += 4),n & j.FIRST_SAMPLE_FLAGS_PRESENT && (r += 4),n & j.SAMPLE_DURATION_PRESENT && (r += 4 * i),n & j.SAMPLE_SIZE_PRESENT && (r += 4 * i),n & j.SAMPLE_FLAGS_PRESENT && (r += 4 * i),n & j.SAMPLE_COMPOSITION_TIME_OFFSET && (r += 4 * i),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e),i=this.samples.length,o=this.flags;n(e,this.offset + r,i),r += 4,o & j.DATA_OFFSET_PRESENT && (n(e,this.offset + r,this.dataOffset),r += 4),o & j.FIRST_SAMPLE_FLAGS_PRESENT && (n(e,this.offset + r,this.firstSampleFlags),r += 4);for(var s=0;i > s;s++) {var a=this.samples[s];o & j.SAMPLE_DURATION_PRESENT && (n(e,this.offset + r,a.duration),r += 4),o & j.SAMPLE_SIZE_PRESENT && (n(e,this.offset + r,a.size),r += 4),o & j.SAMPLE_FLAGS_PRESENT && (n(e,this.offset + r,a.flags),r += 4),o & j.SAMPLE_COMPOSITION_TIME_OFFSET && (n(e,this.offset + r,a.compositionTimeOffset),r += 4);}return r;},e;})(y);c.TrackRunBox = z;var V=(function(t){function e(e,r){t.call(this,"moof",i([e],r)),this.header = e,this.trafs = r;}return f(e,t),e;})(E);c.MovieFragmentBox = V;var K=(function(t){function e(e){t.call(this,"mdat"),this.chunks = e;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e);return this.chunks.forEach(function(t){r += t.length;}),this.size = r;},e.prototype.write = function(e){var r=this,i=t.prototype.write.call(this,e);return this.chunks.forEach(function(t){e.set(t,r.offset + i),i += t.length;},this),i;},e;})(_);c.MediaDataBox = K;var W=(function(t){function e(e,r){t.call(this,e),this.dataReferenceIndex = r;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + 8,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,0),n(e,this.offset + r + 4,this.dataReferenceIndex),r + 8;},e;})(_);c.SampleEntry = W;var q=(function(t){function e(e,r,i,n,o,s){void 0 === i && (i = 2),void 0 === n && (n = 16),void 0 === o && (o = 44100),void 0 === s && (s = null),t.call(this,e,r),this.channelCount = i,this.sampleSize = n,this.sampleRate = o,this.otherBoxes = s;}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e) + 20;return this.otherBoxes && this.otherBoxes.forEach(function(t){r += t.layout(e + r);}),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return n(e,this.offset + r,0),n(e,this.offset + r + 4,0),n(e,this.offset + r + 8,this.channelCount << 16 | this.sampleSize),n(e,this.offset + r + 12,0),n(e,this.offset + r + 16,this.sampleRate << 16),r += 20,this.otherBoxes && this.otherBoxes.forEach(function(t){r += t.write(e);}),r;},e;})(W);c.AudioSampleEntry = q,c.COLOR_NO_ALPHA_VIDEO_SAMPLE_DEPTH = 24;var $=(function(t){function e(e,r,i,n,o,s,a,u,h,l){if((void 0 === o && (o = ""),void 0 === s && (s = 72),void 0 === a && (a = 72),void 0 === u && (u = 1),void 0 === h && (h = c.COLOR_NO_ALPHA_VIDEO_SAMPLE_DEPTH),void 0 === l && (l = null),t.call(this,e,r),this.width = i,this.height = n,this.compressorName = o,this.horizResolution = s,this.vertResolution = a,this.frameCount = u,this.depth = h,this.otherBoxes = l,o.length > 31))throw new Error("invalid compressor name");}return f(e,t),e.prototype.layout = function(e){var r=t.prototype.layout.call(this,e) + 16 + 12 + 4 + 2 + 32 + 2 + 2;return this.otherBoxes && this.otherBoxes.forEach(function(t){r += t.layout(e + r);}),this.size = r;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);n(e,this.offset + r,0),n(e,this.offset + r + 4,0),n(e,this.offset + r + 8,0),n(e,this.offset + r + 12,0),r += 16,n(e,this.offset + r,this.width << 16 | this.height),n(e,this.offset + r + 4,a(this.horizResolution)),n(e,this.offset + r + 8,a(this.vertResolution)),r += 12,n(e,this.offset + r,0),n(e,this.offset + r + 4,this.frameCount << 16),r += 6,e[this.offset + r] = this.compressorName.length;for(var i=0;31 > i;i++) e[this.offset + r + i + 1] = i < this.compressorName.length?127 & this.compressorName.charCodeAt(i):0;return r += 32,n(e,this.offset + r,this.depth << 16 | 65535),r += 4,this.otherBoxes && this.otherBoxes.forEach(function(t){r += t.write(e);}),r;},e;})(W);c.VideoSampleEntry = $;var X=(function(t){function e(e,r){t.call(this,e),this.data = r;}return f(e,t),e.prototype.layout = function(e){return this.size = t.prototype.layout.call(this,e) + this.data.length,this.size;},e.prototype.write = function(e){var r=t.prototype.write.call(this,e);return e.set(this.data,this.offset + r),r + this.data.length;},e;})(_);c.RawTag = X;},function(t,e,r){(function(e){var i,n=r(74),o=r(69),s=(o.BaseTransform,r(119));r(120);t.exports = i = function(){o.BaseParser.prototype.constructor.apply(this,arguments),this.parser = new s(),this.parser.onFrame = this._onMp3Frame.bind(this),this.parser.onNoise = this._onNoise.bind(this),this.parser.onClose = this._onClose.bind(this),this._sampleRate = 0,this._bitRate = 0,this._timestamp = 0;},i.prototype = o.createBaseParser({constructor:i,_onMp3Frame:function _onMp3Frame(t,r,i){n("Found frame length " + t.length + " bitRate=" + r + ", sampleRate=" + i);var s=new e(t),a=1152;s.meta = {mimeType:"audio/mpeg",codecId:2,channels:2,bitRate:r,sampleRate:i,sampleSize:16},s.duration = a,s.timestamp = this._timestamp,this.enqueue(new o.Transfer(s,"buffer")),this._bitRate = r,this._timestamp += a;},_onNoise:function _onNoise(){n("mp3 has noise");},_onClose:function _onClose(){n("parser closed");},_parse:function _parse(t){return n("parse called"),t.data.empty?(n("empty transfer"),void this.enqueue(t)):void this.parser.push(new Uint8Array(t.data));}});}).call(e,r(70).Buffer);},function(t,e,r){var i=r(74),n=[32,64,96,128,160,192,224,256,288,320,352,384,416,448,32,48,56,64,80,96,112,128,160,192,224,256,320,384,32,40,48,56,64,80,96,112,128,160,192,224,256,320,32,48,56,64,80,96,112,128,144,160,176,192,224,256,8,16,24,32,40,48,56,64,80,96,112,128,144,160],o=[44100,48e3,32e3,22050,24e3,16e3,11025,12e3,8e3],s=(function(){function t(){this.buffer = null,this.bufferSize = 0;}return t.prototype.push = function(t){var e;if(this.bufferSize > 0){var r=t.length + this.bufferSize;if(!this.buffer || this.buffer.length < r){var n=new Uint8Array(r);this.bufferSize > 0 && n.set(this.buffer.subarray(0,this.bufferSize)),this.buffer = n;}this.buffer.set(t,this.bufferSize),this.bufferSize = r,t = this.buffer,e = r;}else e = t.length;i("push " + e);for(var o,s=0;e > s && (o = this._parse(t,s,e)) > 0;) s += o;var a=e - s;a > 0 && (!this.buffer || this.buffer.length < a?this.buffer = new Uint8Array(t.subarray(s,e)):this.buffer.set(t.subarray(s,e))),this.bufferSize = a;},t.prototype._parse = function(t,e,r){if((i("_parse"),e + 2 > r))return -1;if(255 === t[e] || 224 === (224 & t[e + 1])){if(e + 24 > r)return -1;var s=t[e + 1] >> 3 & 3,a=t[e + 1] >> 1 & 3,u=t[e + 2] >> 4 & 15,h=t[e + 2] >> 2 & 3,l=!!(2 & t[e + 2]);if(1 !== s && 0 !== u && 15 !== u && 3 !== h){var c=3 === s?3 - a:3 === a?3:4,f=1e3 * n[14 * c + u - 1],d=3 === s?0:2 === s?1:2,p=o[3 * d + h],g=l?1:0,_=3 === a?(3 === s?12:6) * f / p + g << 2:(3 === s?144:72) * f / p + g | 0;return e + _ > r?-1:(this.onFrame && (i("onFrame"),this.onFrame(t.subarray(e,e + _),f,p)),_);}}for(var y=e + 2;r > y;) {if(255 === t[y - 1] && 224 === (224 & t[y]))return this.onNoise && this.onNoise(t.subarray(e,y - 1)),y - e - 1;y++;}return -1;},t.prototype.close = function(){this.bufferSize > 0 && this.onNoise && this.onNoise(this.buffer.subarray(0,this.bufferSize)),this.buffer = null,this.bufferSize = 0,this.onClose && this.onClose();},t;})();t.exports = s;},function(t,e){var r=1e9;t.exports = {TIMESCALE_SECONDS:r};},function(t,e,r){var i,n=r(122),o=r(69),s=o.BaseSink,a=r(123);t.exports = i = function(t){if((s.prototype.constructor.call(this),!n.haveMediaSourceSupportMimeType(t)))throw new Error("Local MediaSource doesn't support provided MIME type: " + t);var e;e = arguments.length > 1?Array.prototype.slice.call(arguments):t instanceof Array?t:[t],this.mimeTypes = e,this.mediaSource = new MediaSource(),this.mseWriter = new a(this.mediaSource),this.dataSources = [],this.selectedDataSourceIndex = 0,this.mimeTypes.forEach((function(t){var e={mimeType:t};this.mseWriter.listen(e),this.dataSources.push(e);}).bind(this));},i.prototype = o.createBaseSink({constructor:i,_onData:function _onData(){var t=this.dataSources[this.selectedDataSourceIndex];if(!t || !t.onData)throw new Error("DataSource is not existing or has no onData function defined");var e=this.dequeue();e && t.onData(e.data);},getMediaSourceUrl:function getMediaSourceUrl(){return URL.createObjectURL(this.mediaSource);}});},function(t,e){var r;t.exports = r = {haveGlobalWindow:function haveGlobalWindow(){return "undefined" != typeof window;},haveMediaSourceExtensions:function haveMediaSourceExtensions(){return r.haveGlobalWindow() && window.MediaSource;},haveMediaSourceSupportMimeType:function haveMediaSourceSupportMimeType(t){return r.haveMediaSourceExtensions() && window.MediaSource.isTypeSupported(t);}};},function(t,e){var r=(function(){function t(t,e){this.mediaSource = t,this.dataSource = e,this.dataSource.onData = this.pushData.bind(this),this.updateEnabled = !1,this.buffer = [],this.sourceBuffer = null,this.sourceBufferUpdatedBound = null;}return t.prototype.allowWriting = function(){this.updateEnabled = !0,this.update();},t.prototype.pushData = function(t){this.buffer.push(t),this.update();},t.prototype.update = function(){if(this.updateEnabled && 0 !== this.buffer.length){this.sourceBuffer || (this.sourceBuffer = this.mediaSource.addSourceBuffer(this.dataSource.mimeType),this.sourceBufferUpdatedBound = this._sourceBufferUpdated.bind(this),this.sourceBuffer.addEventListener("update",this.sourceBufferUpdatedBound)),this.updateEnabled = !1;var t=this.buffer.shift();if(null === t)return void this.sourceBuffer.removeEventListener("update",this.sourceBufferUpdatedBound);t.timestamp && (this.sourceBuffer.timestampOffset = t.timestamp / 1e9),this.sourceBuffer.appendBuffer(t);}},t.prototype._sourceBufferUpdated = function(t){this.updateEnabled = !0,this.update();},t.prototype.finish = function(){this.buffer.push(null),this.update();},t;})(),i=(function(){function t(t){this.bufferWriters = [],this.mediaSource = t,this.mediaSourceOpened = !1,this.mediaSource.addEventListener("sourceopen",(function(t){this.mediaSourceOpened = !0,this.bufferWriters.forEach(function(t){t.allowWriting();});}).bind(this)),this.mediaSource.addEventListener("sourceend",(function(t){this.mediaSourceOpened = !1;}).bind(this));}return t.prototype.listen = function(t){var e=new r(this.mediaSource,t);this.bufferWriters.push(e),this.mediaSourceOpened && e.allowWriting();},t;})();t.exports = i;},function(t,e,r){var i,n,o=r(69);n = function(t){o.BasePushSrc.prototype.constructor.call(this);var e=this.req = new XMLHttpRequest();e.open("GET",t,!0),e.responseType = "arraybuffer",e.onload = (function(t){this.enqueue(new o.Transfer(new Uint8Array(e.response),"binary")),this.enqueue(new o.Transfer(null,"binary"));}).bind(this),e.send();},n.prototype = o.createBasePushSrc({constructor:n}),t.exports = i = {Src:n};},function(t,e,r){var i,n,o,s=r(69),a=r(126);r(76);n = function(t,e){s.prototype.constructor.call(this);var r=a.createReadStream(t,e);this.on("end",function(){r.close();}),this.addOutput(r);},n.prototype = s.create({constructor:n}),o = function(t,e){s.prototype.constructor.call(this);var r=a.createWriteStream(t,e);this.on("finish",function(){r.close();}),this.addInput(r);},o.prototype = s.create({constructor:o}),t.exports = i = {Src:n,Sink:o};},function(t,e,r){var i=r(122);t.exports = i.haveGlobalWindow()?new (r(127))():r(!(function(){var t=new Error('Cannot find module "fs"');throw (t.code = "MODULE_NOT_FOUND",t);})());},function(t,e,r){var i;i = (function(){function t(){return !1;}function e(t){return !(!(t && t.data instanceof Object) || r(t));}function r(t){return !!(t && t.data instanceof ArrayBuffer);}function i(t,r){var i,n=t.length,o=r;for(i = 0;n > i;++i) {if(!e(o))throw new Error("ENOENT");o = o.data[t[i]];}return o;}String.prototype.trim || !(function(){var t=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;String.prototype.trim = function(){return this.replace(t,"");};})();var n=function n(){var t=Date.now();this.root = {mtime:t,ctime:t,atime:t,data:{}};};return n.prototype.join = function(){var t=[],e=arguments || [];return t = this.parse(Array.prototype.slice.call(e).join("/")),("/" === e[0][0]?"/":"") + t.join("/");},n.prototype.parse = function(t){var e=[];return t = t || "/",t.split(/\/+/).forEach(function(t){t = t.trim(),t.length && "." !== t && (".." === t?e.pop():e.push(t));}),e;},n.prototype.fileSizeSI = function(t,e,r,i,n){return (e = Math,r = e.log,i = 1e3,n = r(t) / r(i) | 0,t / e.pow(i,n)).toFixed(n?2:0) + " " + (n?"kMGTPEZY"[--n] + "B":"Bytes");},n.prototype.fileSizeIEC = function(t,e,r,i,n){return (e = Math,r = e.log,i = 1024,n = r(t) / r(i) | 0,t / e.pow(i,n)).toFixed(n?2:0) + " " + (n?"KMGTPEZY"[--n] + "iB":"Bytes");},n.prototype.statSync = function(r){var n=this.parse(r),o=i(n,this.root),s=e(o);if(!o || !o.data)throw new Error("ENOENT");return {size:s?Object.keys(o.data).length:o.data.byteLength,ctime:new Date(o.ctime),mtime:new Date(o.mtime),atime:new Date(o.atime),isFile:function isFile(){return !s;},isDirectory:function isDirectory(){return s;},isBlockDevice:t,isCharacterDevice:t,isSymbolicLink:t,isFIFO:t,isSocket:t};},n.prototype.existsSync = function(t){var r,i=this.parse(t),n=i.length,o=this.root;for(r = 0;n > r;++r) {if(!e(o))return !1;o = o.data[i[r]];}return !!o;},n.prototype.mkdirSync = function(t){var r=this.parse(t),n=i(r.slice(0,r.length - 1),this.root),o=Date.now();if(!r.length || !e(n))throw new Error("ENODIR");n.data[r[r.length - 1]] = {data:{},ctime:o,mtime:o,atime:o},n.mtime = o;},n.prototype.mkdirpSync = function(t){var n,o,s,a=this.parse(t),u=a.length;if(!a.length)throw new Error("ENODIR");for(o = 0;u > o;++o) {if((n = a.slice(0,o + 1),s = i(n,this.root),r(s)))throw new Error("ENODIR");e(s) || this.mkdirSync(n.join("/"));}},n.prototype.readdirSync = function(t){var r=this.parse(t),n=i(r,this.root);if(!e(n))throw new Error("ENODIR");return n.atime = Date.now(),Object.keys(n.data);},n.prototype.rmdirSync = function(t){var r=this.parse(t),n=i(r,this.root);if((dirname = r.pop(),parentDir = i(r,this.root),!e(n)))throw new Error("ENODIR");if(Object.keys(n.data).length)throw new Error("ENOTEMPTY");delete parentDir.data[dirname],parentDir.mtime = Date.now();},n.prototype.rmrfSync = function(t){var r=this.parse(t),n=r.pop(),o=i(r,this.root);if(!e(o))throw new Error("ENODIR");n?delete o.data[n]:o.data = {},o.mtime = Date.now();},n.prototype.writeFileSync = function(t,r,n){var o,s,a=this.parse(t),u=a.pop(),h=this.existsSync(t),l=i(a,this.root);if(!e(l))throw new Error("ENODIR");if(!u)throw new Error("EINVALIDPATH");if((n = n || {encoding:!0},"string" == typeof r)){o = new ArrayBuffer(2 * r.length);for(var c=new Uint16Array(o),f=0,d=r.length;d > f;++f) c[f] = r.charCodeAt(f);}else o = r;s = Date.now(),l.data[u] = {data:o,ctime:s,mtime:s,atime:s},h || (l.mtime = s),l.atime = s;},n.prototype.readFileSync = function(t,e){var n=this.parse(t),o=i(n,this.root),e=e || {encoding:!1};if(!r(o))throw new Error("ENOENT");return o.atime = Date.now(),e.encoding?String.fromCharCode.apply(null,new Uint16Array(o.data)):o.data;},n.prototype.renameSync = function(t,r){var n=this.parse(t),o=i(n,this.root),s=i(n.slice(0,n.length - 1),this.root),a=n[n.length - 1],u=this.parse(r),h=i(u,this.root),l=i(u.slice(0,u.length - 1),this.root),c=u[u.length - 1],f=Date.now();if(!n.length || !u.length)throw new Error("ENOENT");if(!e(s || !e(l)))throw new Error("ENODIR");if(h)throw new Error("EEXISTS");l.data[c] = h = o,h.ctime = f,l.mtime = f,delete s.data[a],s.mtime = f;},["stat","exists","readdir","mkdirp","mkdir","rmdir","rmrf","unlink"].forEach(function(t){n.prototype[t] = function(e,r){try{var i=this[t + "Sync"](e);}catch(n) {return r(n);}return r(null,i);};}),["writeFile","readFile"].forEach(function(t){n.prototype[t] = function(e,r,i){i || (i = r,r = void 0);try{var n=this[t + "Sync"](e,r);}catch(o) {return i(o);}return i(null,n);};}),["rename"].forEach(function(t){n.prototype[t] = function(e,r,i){try{var n=this[t + "Sync"](e,r);}catch(o) {return i(o);}return i(null,n);};}),n;}).call(e,r,e,t),!(void 0 !== i && (t.exports = i));},function(t,e){var r={HTTP:"http",RTMP:"rtmp",HLS:"hls"};t.exports = r;},function(t,e){t.exports = {AAC:"audio/aac",M3U8:"application/x-mpegURL",HLS:"application/vnd.apple.mpegurl",MP4A:"audio/mp4",MP3:"audio/mpeg",OGG:"audio/ogg",WAV:"audio/wav",WEBMA:"audio/webm",getTypeByExtension:function getTypeByExtension(t){var e={mp3:this.MP3,aac:this.AAC,mp4:this.MP4A,mp4a:this.MP4A,ogg:this.OGG,oga:this.OGG,opus:this.OGG,webm:this.WEBM,wav:this.WAV,m3u8:this.M3U8};return e[t] || null;}};},function(t,e,r,i,n,o){function s(t,e,r){for(var i=-1,n=h(e),o=n.length;++i < o;) {var s=n[i],a=t[s],u=r(a,e[s],s,t,e);(u === u?u === a:a !== a) && (void 0 !== a || s in t) || (t[s] = u);}return t;}var a=r(i),u=r(n),h=r(o),l=u(function(t,e,r){return r?s(t,e,r):a(t,e);});t.exports = l;},function(t,e,r,i,n){function o(t,e){return null == e?t:s(e,a(e),t);}var s=r(i),a=r(n);t.exports = o;},function(t,e,r,i,n,o){function s(t){return function(e){return null == e?void 0:e[t];};}function a(t){return null != t && h(S(t));}function u(t,e){return t = "number" == typeof t || _.test(t)?+t:-1,e = null == e?v:e,t > -1 && t % 1 == 0 && e > t;}function h(t){return "number" == typeof t && t > -1 && t % 1 == 0 && v >= t;}function l(t){for(var e=f(t),r=e.length,i=r && t.length,n=!!i && h(i) && (g(t) || p(t)),o=-1,s=[];++o < r;) {var a=e[o];(n && u(a,i) || m.call(t,a)) && s.push(a);}return s;}function c(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}function f(t){if(null == t)return [];c(t) || (t = Object(t));var e=t.length;e = e && h(e) && (g(t) || p(t)) && e || 0;for(var r=t.constructor,i=-1,n="function" == typeof r && r.prototype === t,o=Array(e),s=e > 0;++i < e;) o[i] = i + "";for(var a in t) s && u(a,e) || "constructor" == a && (n || !m.call(t,a)) || o.push(a);return o;}var d=r(i),p=r(n),g=r(o),_=/^\d+$/,y=Object.prototype,m=y.hasOwnProperty,E=d(Object,"keys"),v=9007199254740991,S=s("length"),A=E?function(t){var e=null == t?void 0:t.constructor;return "function" == typeof e && e.prototype === t || "function" != typeof t && a(t)?l(t):c(t)?E(t):[];}:l;t.exports = A;},function(t,e,r,i,n,o){function s(t){return h(function(e,r){var i=-1,n=null == e?0:r.length,o=n > 2?r[n - 2]:void 0,s=n > 2?r[2]:void 0,h=n > 1?r[n - 1]:void 0;for("function" == typeof o?(o = a(o,h,5),n -= 2):(o = "function" == typeof h?h:void 0,n -= o?1:0),s && u(r[0],r[1],s) && (o = 3 > n?void 0:o,n = 1);++i < n;) {var l=r[i];l && t(e,l,o);}return e;});}var a=r(i),u=r(n),h=r(o);t.exports = s;},function(t,e,r,i){function n(t,e){return p(t,e,c);}function o(t){return function(e){return null == e?void 0:e[t];};}function s(t,e){return function(r,i){var n=r?g(r):0;if(!u(n))return t(r,i);for(var o=e?n:-1,s=h(r);(e?o--:++o < n) && i(s[o],o,s) !== !1;);return r;};}function a(t){return function(e,r,i){for(var n=h(e),o=i(e),s=o.length,a=t?s:-1;t?a--:++a < s;) {var u=o[a];if(r(n[u],u,n) === !1)break;}return e;};}function u(t){return "number" == typeof t && t > -1 && t % 1 == 0 && f >= t;}function h(t){return l(t)?t:Object(t);}function l(t){var e=typeof t;return !!t && ("object" == e || "function" == e);}var c=r(i),f=9007199254740991,d=s(n),p=a(),g=o("length");t.exports = d;}]));

},{}],11:[function(require,module,exports){
"use strict";

module.exports = (function (t) {
	function e(n) {
		if (i[n]) return i[n].exports;var r = i[n] = { exports: {}, id: n, loaded: !1 };return t[n].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports;
	}var i = {};return e.m = t, e.c = i, e.p = "", e(0);
})([function (t, e, i) {
	function n() {
		return this._hooksPause.every(function (t) {
			return t.call();
		});
	}function r(t) {
		var e = t.resource_id || t.id || t.cid;if (!e) throw new Error("Your model should have a unique `id`, `cid` or `resource_id` property");return e;
	}function o(t) {
		C = t, t && (x.AudioManagerStates = t.States);
	}function s() {
		var t = V();return g.call(this, !0).done(function (e) {
			t.resolve(e.url);
		}).fail(function () {
			t.reject();
		}), t.promise();
	}function a(t) {
		var e,
		    i = this.options;return e = { id: this.getId(), src: t.url, duration: z.result(i.duration), title: this.options.title, mimeType: t.mimeType, forceSingle: i.useSinglePlayer }, C.createAudioPlayer(e, { streamUrlProvider: s.bind(this) });
	}function u(t, e) {
		var i = e ? "on" : "off";t[i]("state-change", L, this)[i]("position-change", c, this)[i]("metadata", l, this);
	}function l() {
		this.trigger(G.METADATA);
	}function c() {
		this._prevPosition !== this.currentTime() && (this.trigger(G.TIME), this._prevPosition = this.currentTime());
	}function h() {
		this._initAudioDefer && (this._initAudioDefer.reject(), this._initAudioDefer = null, this.streamInfo = null);
	}function f() {
		h.call(this), this.controller && (this._storedPosition = this.currentTime(), this.controller.kill(), this.controller = null, this.trigger(G.RESET));
	}function d() {
		this._registerPlays = !0, this.pause(), this.trigger(G.FINISH);
	}function g(t) {
		var e = V(),
		    i = this.streamInfo && !t;return i ? e.resolve(this.streamInfo) : p.call(this).done((function (t) {
			var i = X.choosePreferredStream(t, this.options);i ? e.resolve(i) : (this.trigger(G.NO_PROTOCOL), F.warn("(%s) Could not match a protocol of given media descriptor to one of the supported protocols (%s), aborting attempt to play.", this.getId(), this.options.protocols), e.reject());
		}).bind(this)).fail((function (t) {
			F.warn("(%s) Stream request failed with status: %d", this.getId(), t.status), m.call(this, t), v.call(this, t), e.reject();
		}).bind(this)), e.promise();
	}function p() {
		if (this.options.streamUrls && !this._usedPrefetchUrls) {
			var t,
			    e = V();return this._usedPrefetchUrls = !0, t = z.result(this.options.streamUrls), e.resolve(t), e.promise();
		}return this.ajax({ type: "GET", url: z.result(this.options.streamUrlsEndpoint), dataType: "json", async: this.options.asyncFetch, timeout: this.options.asyncFetch ? it : et });
	}function m(t) {
		var e = t.status >= 400 && -1 !== (t.responseText || "").indexOf("geo_blocked");e && this.trigger(G.GEO_BLOCKED);
	}function v(t) {
		0 === t.status && this.trigger(G.NO_CONNECTION);
	}function T() {
		return this.controller && this.controller.getCapabilities && this.controller.getCapabilities() ? this.controller.getCapabilities().needsUrlRefresh : !0;
	}function _(t) {
		if (!T.call(this)) return !0;var e = this._initAudioDefer && this._initAudioDefer.state(),
		    i = X.streamValidForPlayingFrom(this.streamInfo, t);return this.controller && this.controller.hasStreamUrlProvider && this.controller.hasStreamUrlProvider() ? !0 : e && ("pending" === e || "resolved" === e && i);
	}function A(t) {
		t && !this._bufferingTimeout ? this._bufferingTimeout = window.setTimeout((function () {
			this._isBuffering = !0, this.trigger(G.BUFFERRING_START);
		}).bind(this), nt) : t || (this._bufferingTimeout && (window.clearTimeout(this._bufferingTimeout), this._bufferingTimeout = null), this._isBuffering && (this._isBuffering = !1, this.trigger(G.BUFFERRING_END)));
	}function E() {
		this.off(G.TIME, this.seekTimeEventHandler), this.trigger(G.SEEKED), this.seekTimeEventHandler = null;
	}function y() {
		this._errorRecoveryFlagsResetTimeout = window.setTimeout((function () {
			this._errorRecoveryTime = null, this._errorRecoveryCounts = 0;
		}).bind(this), at);
	}function S() {
		this._errorRecoveryFlagsResetTimeout && window.clearTimeout(this._errorRecoveryFlagsResetTimeout);
	}function P() {
		var t = this.isPlaying(),
		    e = Date.now();return S.call(this), this._errorRecoveryTime && this._errorRecoveryTime + ot > e && this._errorRecoveryCounts > st ? void this.trigger(G.AUDIO_ERROR, this) : (this._errorRecoveryTime = Date.now(), this._errorRecoveryCounts++, f.call(this), void (t && this.play({ seek: this.currentTime(), userInitiated: !1 })));
	}function w(t) {
		this.logAudioError({ error_code: t, protocol: this.streamInfo ? this.streamInfo.protocol : void 0, player_type: this.controller ? this.controller.getType() : void 0, host: this.streamInfo ? q.getUrlHost(this.streamInfo.url) : void 0, url: this.streamInfo ? this.streamInfo.url : void 0 });
	}function b() {
		var t,
		    e = C.Errors;if (!this.controller) return F.error("(%s) Controller is null, aborting error handler.", this.getId(), this), w.call(this, null), void P.call(this);switch ((t = this.controller && this.controller.getErrorID(), F.error("(%s) %s", this.getId(), this.controller.getErrorMessage ? this.controller.getErrorMessage() : "Controller does not provide getErrorMessage()"), D(t, "MSE", "GENERIC", "HTML5_AUDIO_DECODE", "HTML5_AUDIO_SRC_NOT_SUPPORTED", "FLASH_PROXY", "FLASH_RTMP_CONNECT_FAILED", "FLASH_RTMP_CANNOT_PLAY_STREAM") && w.call(this, t), t)) {case e.FLASH_PROXY_CANT_LOAD_FLASH:
				this.trigger(G.FLASH_NOT_LOADED);break;case e.FLASH_PROXY_FLASH_BLOCKED:
				this.trigger(G.FLASH_BLOCK);break;case e.FLASH_RTMP_CONNECT_FAILED:
				z.without(this.options.protocols, Q.RTMP);case e.FLASH_RTMP_CANNOT_PLAY_STREAM:case e.FLASH_RTMP_CONNECT_CLOSED:case e.HTML5_AUDIO_NETWORK:case e.HTML5_AUDIO_ABORTED:case e.HTML5_AUDIO_DECODE:case e.HTML5_AUDIO_SRC_NOT_SUPPORTED:case e.GENERIC_AUDIO_ENDED_EARLY:case e.MSE_BAD_OBJECT_STATE:case e.MSE_NOT_SUPPORTED:case e.MSE_MP3_NOT_SUPPORTED:case e.MSE_HLS_NOT_VALID_PLAYLIST:case e.MSE_HLS_PLAYLIST_NOT_FOUND:case e.MSE_HLS_SEGMENT_NOT_FOUND:
				P.call(this);break;case e.GENERIC_AUDIO_OVERRUN:
				d.call(this);break;default:
				F.error("(%s) Unhandled audio error code: %s", this.getId(), t, this);}
	}function O(t, e) {
		switch ((this.options.debug && I.call(this, t, e), t)) {case G.PAUSE:
				this._isPlaying = !1, this._isPlayActionQueued = !1;break;case G.PLAY:
				var i = e;this.toggleMute(Z.muted), this.setVolume(Z.volume), this._isPlaying = !1, this._isPlayActionQueued = !0, this._userInitiatedPlay = void 0 !== i.userInitiated ? !!i.userInitiated : !0, N.call(this);break;case G.PLAY_START:
				this._isPlaying = !0, this._isPlayActionQueued = !1, this._registerPlays && this.registerPlay();break;case G.BUFFERRING_START:case G.SEEK:
				this._isPlaying && (this._isPlaying = !1, this._isPlayActionQueued = !0);break;case G.BUFFERRING_END:case G.SEEKED:
				this._isPlayActionQueued && (this._isPlaying = !0, this._isPlayActionQueued = !1);break;case G.NO_CONNECTION:
				this._hasNoConnection = !0, this._noConnectionSince = Date.now();break;case G.NO_STREAMS:
				this.pause(), A.call(this, !1), h.call(this), M.call(this);break;case G.STREAMS:
				this._noConnectionSince = null, this._hasNoConnection = !1;break;case G.ONLINE:
				k.call(this);break;case G.OFFLINE:}
	}function L(t) {
		var e = C.States,
		    i = C.Errors;switch (t) {case e.IDLE:
				R.call(this), this.controller && this.controller.getErrorID() === i.FLASH_PROXY_FLASH_BLOCKED && this.trigger(G.FLASH_UNBLOCK);break;case e.PAUSED:
				R.call(this), A.call(this, !1), this.seekTimeEventHandler && this.isPaused() && E.call(this), this.isPlaying() && this.trigger(G.PAUSE, { position: this.currentTime() });break;case e.PLAYING:
				R.call(this), A.call(this, !1), y.call(this), this.trigger(G.PLAY_RESUME);break;case e.LOADING:case e.SEEKING:
				R.call(this), A.call(this, !0);break;case e.ENDED:
				R.call(this), d.call(this);break;case e.ERROR:
				A.call(this, !1), b.call(this);}this.trigger(G.STATE_CHANGE, t);
	}function I(t, e) {
		var i = this.options.title;i = i && i.length ? " [" + i.replace(/\s/g, "").substr(0, 6) + "]" : "", t === G.STATE_CHANGE ? F("(%s)%s Event: %s (%s)", this.getId(), i, t, e) : t !== G.TIME || this._loggedTime ? t !== G.TIME && F("(%s)%s Event: %s", this.getId(), i, t) : F("(%s)%s Event: %s %dms", this.getId(), i, t, this.currentTime()), this._loggedTime = t === G.TIME;
	}function R() {
		this._initAudioDefer && this._initAudioDefer.resolve();
	}function D(t) {
		return void 0 === C.Errors[t] ? !1 : Array.prototype.slice.call(arguments, 1).some(function (e) {
			return 0 === t.indexOf(e);
		});
	}function N() {
		function t() {
			var t = window.navigator.onLine;F("Navigator `onLine` status is now: " + t), window.setTimeout((function () {
				window.navigator.onLine === t && this.trigger(t ? G.ONLINE : G.OFFLINE);
			}).bind(this), 500);
		}this._onlineEventsRegistered || (this._onlineEventsRegistered = !0, window.addEventListener("online", t.bind(this)), window.addEventListener("offline", t.bind(this)));
	}function k() {
		if (this.hasNoConnection() && this._isPlayRetryQueued) {
			var t = Date.now() - this._noConnectionSince;this._isPlayRetryQueued = !0, t < this.options.retryAfterNoConnectionEventTimeout && this.play({ userInitiated: !1 });
		}
	}function M() {
		this.hasNoConnection() && !this._userInitiatedPlay && (this._isPlayRetryQueued = !0);
	}var x,
	    C,
	    F,
	    H = i(1),
	    U = i(6),
	    j = i(8),
	    B = i(9),
	    V = i(2).Deferred,
	    G = i(7),
	    Y = i(14),
	    K = i(10),
	    Q = i(15),
	    W = i(16),
	    X = i(18),
	    q = i(12),
	    z = i(13),
	    J = i(19),
	    $ = {},
	    Z = { muted: !1, volume: 1 },
	    tt = { soundId: $, duration: $, title: null, registerEndpoint: $, streamUrlsEndpoint: $, resourceId: !1, debug: !1, asyncFetch: !0, useSinglePlayer: !0, protocols: [Q.HLS, Q.RTMP, Q.HTTP], extensions: [Y.MP3], maxBitrate: 1 / 0, mediaSourceEnabled: !1, mseFirefox: !1, mseSafari: !1, eventLogger: null, logErrors: !0, logPerformance: !0, ajax: null, retryAfterNoConnectionEventTimeout: 6e4, fadeOutOnPause: !1, fadeOutAlgo: J.VolumeAutomator.Algos.EaseInOut },
	    et = 6e3,
	    it = 6e3,
	    nt = 400,
	    rt = 6e4,
	    ot = 6e3,
	    st = 3,
	    at = 3e4,
	    ut = [];x = t.exports = function (t, e) {
		if ((1 === arguments.length ? e = t : x.setAudioManager(t), !C)) throw new Error("SCAudio: AudioManager instance must be set with `SCAudio.setAudioManager()` or passed via the constructor");this.options = z.extend({}, tt, e);var i = Object.keys(this.options).filter(function (t) {
			return this.options[t] === $;
		}, this);if (i.length) throw new Error("SCAudio: pass into constructor the following options: " + i.join(", "));W.prioritizeAndFilter(this.options), this.controller = null, this.streamInfo = null, this._userInitiatedPlay = this._registerPlays = !0, this._registerCounts = this._errorRecoveryCounts = 0, this._isPlayActionQueued = this._onlineEventsRegistered = this._usedPrefetchUrls = this._isPlaying = this._isBuffering = this._hasNoConnection = !1, this._initAudioDefer = this._expirationTimeout = this._bufferingTimeout = this._errorRecoveryTime = this._errorRecoveryFlagsResetTimeout = this._storedPosition = this._prevPosition = this._noConnectionSince = null, this.options.debug && (this._loggedTime = !1), this._modelListeners = {}, this._hooksPause = [], this.audioPerfMonitor = new j(this, this.logAudioPerformance.bind(this)), this.audioLogger = new U(this), this.volumeAutomator = new J.VolumeAutomator(this), F = F || B(e.debug, "scaudio");
	}, z.extend(x.prototype, K, { constructor: x, initAudio: function initAudio() {
			return this._initAudioDefer || (this._initAudioDefer = V(), g.call(this).done((function (t) {
				var e = !0;this.streamInfo && (e = !1), this.streamInfo = t, e && this.trigger(G.STREAMS), this.controller = a.call(this, t), u.call(this, this.controller, !0), L.call(this, this.controller.getState());
			}).bind(this)).fail((function () {
				this.trigger(G.NO_STREAMS);
			}).bind(this)), this._initAudioDefer.done((function () {
				this.trigger(G.CREATED);
			}).bind(this))), this._initAudioDefer.promise();
		}, registerPlay: function registerPlay() {
			var t = this.options.soundId,
			    e = !1;return -1 === ut.indexOf(t) && (ut.push(t), window.setTimeout(function () {
				var e = ut.indexOf(t);e > -1 && ut.splice(e, 1);
			}, rt), this.ajax({ type: "POST", url: z.result(this.options.registerEndpoint), dataType: "json" }), this._registerCounts++, this._registerPlays = !1, this.trigger(G.REGISTERED), e = !0), e;
		}, toggle: function toggle() {
			this[this.isPaused() ? "play" : "pause"]();
		}, play: function play(t) {
			var e;if (t && null != t.seek) e = t.seek;else {
				if (this.isPlaying()) return;e = this.currentTime();
			}t = z.extend({}, t, { position: e }), this.trigger(G.PLAY, t), _.call(this, e) || (f.call(this), this._isPlayActionQueued = !0), this.initAudio().done((function () {
				this._isPlayActionQueued && (this._storedPosition = null, this.trigger(G.PLAY_START, t), this.controller && this.controller.play(e));
			}).bind(this)), A.call(this, !0);
		}, pause: function pause(t) {
			this.isPaused() || (t = z.extend({}, t, { position: this.currentTime() }), n.call(this) && (this.trigger(G.PAUSE, t), this.controller && this.controller.pause()));
		}, registerHook: function registerHook(t, e) {
			switch (t) {case "pause":
					this._hooksPause.push(e);break;default:
					throw new Error("can`t register hook for " + t);}
		}, getListenTime: function getListenTime() {
			return this.audioLogger ? this.audioLogger.getListenTime() : 0;
		}, dispose: function dispose() {
			this.audioLogger = null, this.audioPerfMonitor = null, z.without(ut, this.options.soundId), window.clearTimeout(this._bufferingTimeout), h.call(this), this.controller && (this.controller.kill(), this.controller = null), delete this.controller, this.trigger(G.DESTROYED), this.off();
		}, seek: function seek(t) {
			return this.controller ? t >= z.result(this.options.duration) ? void d.call(this) : (this.seekTimeEventHandler && this.off(G.TIME, this.seekTimeEventHandler), this.seekTimeEventHandler = z.after(2, (function () {
				E.call(this);
			}).bind(this)), this.on(G.TIME, this.seekTimeEventHandler), this.trigger(G.SEEK, { from: this.currentTime(), to: t }), this.isPlaying() && !_.call(this, t) ? (f.call(this), void this.play({ seek: t })) : void this.controller.seek(t)) : void 0;
		}, seekRelative: function seekRelative(t) {
			this.controller && this.seek(this.currentTime() + t);
		}, currentTime: function currentTime() {
			return this._storedPosition ? this._storedPosition : this.controller ? this.controller.getCurrentPosition() : 0;
		}, loadProgress: function loadProgress() {
			var t = 0;return this.controller && (t = this.controller.getLoadedPosition() / this.controller.getDuration(), t = t >= .99 ? 1 : t), t;
		}, buffered: function buffered() {
			return this.controller && this.controller.getDuration() || 0;
		}, isPaused: function isPaused() {
			return !this.isPlaying();
		}, isBuffering: function isBuffering() {
			return this._isBuffering;
		}, isPlaying: function isPlaying() {
			return this._isPlayActionQueued || this._isPlaying;
		}, isLoading: function isLoading() {
			return !(!this.controller || this.controller.getState() !== C.States.LOADING);
		}, hasNoConnection: function hasNoConnection() {
			return !!this._hasNoConnection;
		}, hasStreamInfo: function hasStreamInfo() {
			return !!this.streamInfo;
		}, toggleMute: function toggleMute(t) {
			x.toggleMute(t);
		}, isMuted: function isMuted() {
			return x.isMuted();
		}, setVolume: function setVolume(t) {
			x.setVolume(t);
		}, getVolume: function getVolume() {
			return x.getVolume();
		}, logAudioPerformance: function logAudioPerformance(t) {
			this.getEventLogger() && this.options.logPerformance && this.getEventLogger().audioPerformance(t);
		}, logAudioError: function logAudioError(t) {
			this.getEventLogger() && this.options.logErrors && this.getEventLogger().audioError(t);
		}, getAudioManagerStates: function getAudioManagerStates() {
			return C.States;
		}, getId: function getId() {
			return this.options.resourceId || this.options.soundId;
		}, getEventLogger: function getEventLogger() {
			return this.options.eventLogger;
		}, registerModelEventListener: function registerModelEventListener(t, e) {
			var i = r(t);if (this._modelListeners[i]) throw new Error("Data model is already registered (forgot to unregister it or registering twice?)");this._modelListeners[i] = e = e.bind(this, t), this.on("all", e);
		}, unregisterModelEventListener: function unregisterModelEventListener(t) {
			var e = r(t);this._modelListeners[e] && (this.off("all", this._modelListeners[e]), delete this._modelListeners[e]);
		}, ajax: function ajax(t) {
			return this.options.ajax ? this.options.ajax(t) : H(t);
		}, trigger: function trigger(t, e) {
			O.call(this, t, e), K.trigger.call(this, t, e);
		} }), z.extend(x, { getSettings: function getSettings() {
			return Z;
		}, setSettings: function setSettings(t) {
			z.extend(Z, t);
		}, setAudioManager: o, setAudioManagerOnce: z.once(o), toggleMute: function toggleMute(t) {
			Z.muted = void 0 === t ? !Z.muted : !!t, C && C.setVolume(Z.muted ? 0 : 1);
		}, isMuted: function isMuted() {
			return Z.muted;
		}, setVolume: function setVolume(t) {
			Z.volume = void 0 === t ? 1 : t, C && C.setVolume(Z.volume);
		}, getVolume: function getVolume() {
			return Z.volume;
		}, Extensions: Y, Protocols: Q, Events: G, BUFFER_DELAY: nt, PLAY_REGISTRATION_TIMEOUT: rt });
}, function (t, e, i) {
	var n = i(2).Deferred,
	    r = 4;t.exports = function (t) {
		var e, i, o, s, a, u, l, c;t && (o = t.data || null, i = t.url || "", e = t.type || "GET", s = t.dataType || "text", a = t.async, u = t.timeout, l = t.beforeSend || null);var h = n();a = a !== !1;var f = new XMLHttpRequest();return f.open(e, i, a), a && (f.responseType = "text"), l && l(f), f.onreadystatechange = function () {
			if (f.readyState === r) if ((clearTimeout(c), 0 !== f.status && f.status < 400)) {
				var t = f.responseText;if ("json" === s) try {
					t = JSON.parse(t);
				} catch (e) {
					return void h.reject(f);
				}h.resolve(t);
			} else h.reject(f);
		}, null != u && (c = setTimeout(function () {
			f.readyState !== r && (f.abort(), h.reject(f));
		}, u)), f.send(o), h.promise();
	};
}, function (t, e, i) {
	t.exports = i(3);
}, function (t, e, i) {
	/*!
 * jquery-deferred
 * Copyright(c) 2011 Hidden <zzdhidden@gmail.com>
 * MIT Licensed
 */
	var n = t.exports = i(4),
	    r = Array.prototype.slice;n.extend({ Deferred: function Deferred(t) {
			var e = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]],
			    i = "pending",
			    r = { state: function state() {
					return i;
				}, always: function always() {
					return o.done(arguments).fail(arguments), this;
				}, then: function then() {
					var t = arguments;return n.Deferred(function (i) {
						n.each(e, function (e, r) {
							var s = r[0],
							    a = t[e];o[r[1]](n.isFunction(a) ? function () {
								var t = a.apply(this, arguments);t && n.isFunction(t.promise) ? t.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[s + "With"](this === o ? i : this, [t]);
							} : i[s]);
						}), t = null;
					}).promise();
				}, promise: function promise(t) {
					return null != t ? n.extend(t, r) : r;
				} },
			    o = {};return r.pipe = r.then, n.each(e, function (t, n) {
				var s = n[2],
				    a = n[3];r[n[1]] = s.add, a && s.add(function () {
					i = a;
				}, e[1 ^ t][2].disable, e[2][2].lock), o[n[0]] = s.fire, o[n[0] + "With"] = s.fireWith;
			}), r.promise(o), t && t.call(o, o), o;
		}, when: function when(t) {
			var e,
			    i,
			    o,
			    s = 0,
			    a = r.call(arguments),
			    u = a.length,
			    l = 1 !== u || t && n.isFunction(t.promise) ? u : 0,
			    c = 1 === l ? t : n.Deferred(),
			    h = function h(t, i, n) {
				return function (o) {
					i[t] = this, n[t] = arguments.length > 1 ? r.call(arguments) : o, n === e ? c.notifyWith(i, n) : --l || c.resolveWith(i, n);
				};
			};if (u > 1) for (e = new Array(u), i = new Array(u), o = new Array(u); u > s; s++) a[s] && n.isFunction(a[s].promise) ? a[s].promise().done(h(s, o, a)).fail(c.reject).progress(h(s, i, e)) : --l;return l || c.resolveWith(o, a), c.promise();
		} });
}, function (t, e, i) {
	function n(t) {
		var e = s[t] = {};return r.each(t.split(o), function (t, i) {
			e[i] = !0;
		}), e;
	}var r = t.exports = i(5),
	    o = /\s+/,
	    s = {};r.Callbacks = function (t) {
		t = "string" == typeof t ? s[t] || n(t) : r.extend({}, t);var e,
		    i,
		    o,
		    a,
		    u,
		    l,
		    c = [],
		    h = !t.once && [],
		    f = function f(n) {
			for (e = t.memory && n, i = !0, l = a || 0, a = 0, u = c.length, o = !0; c && u > l; l++) if (c[l].apply(n[0], n[1]) === !1 && t.stopOnFalse) {
				e = !1;break;
			}o = !1, c && (h ? h.length && f(h.shift()) : e ? c = [] : d.disable());
		},
		    d = { add: function add() {
				if (c) {
					var i = c.length;!(function n(e) {
						r.each(e, function (e, i) {
							var o = r.type(i);"function" === o ? t.unique && d.has(i) || c.push(i) : i && i.length && "string" !== o && n(i);
						});
					})(arguments), o ? u = c.length : e && (a = i, f(e));
				}return this;
			}, remove: function remove() {
				return c && r.each(arguments, function (t, e) {
					for (var i; (i = r.inArray(e, c, i)) > -1;) c.splice(i, 1), o && (u >= i && u--, l >= i && l--);
				}), this;
			}, has: function has(t) {
				return r.inArray(t, c) > -1;
			}, empty: function empty() {
				return c = [], this;
			}, disable: function disable() {
				return c = h = e = void 0, this;
			}, disabled: function disabled() {
				return !c;
			}, lock: function lock() {
				return h = void 0, e || d.disable(), this;
			}, locked: function locked() {
				return !h;
			}, fireWith: function fireWith(t, e) {
				return e = e || [], e = [t, e.slice ? e.slice() : e], !c || i && !h || (o ? h.push(e) : f(e)), this;
			}, fire: function fire() {
				return d.fireWith(this, arguments), this;
			}, fired: function fired() {
				return !!i;
			} };return d;
	};
}, function (t, e) {
	function i(t) {
		return null == t ? String(t) : c[l.call(t)] || "object";
	}function n(t) {
		return "function" === u.type(t);
	}function r(t) {
		return "array" === u.type(t);
	}function o(t, e, i) {
		var r,
		    o = 0,
		    s = t.length,
		    a = void 0 === s || n(t);if (i) if (a) {
			for (r in t) if (e.apply(t[r], i) === !1) break;
		} else for (; s > o && e.apply(t[o++], i) !== !1;);else if (a) {
			for (r in t) if (e.call(t[r], r, t[r]) === !1) break;
		} else for (; s > o && e.call(t[o], o, t[o++]) !== !1;);return t;
	}function s(t) {
		return t && "object" === u.type(t) ? !0 : !1;
	}function a() {
		var t,
		    e,
		    i,
		    n,
		    r,
		    o,
		    s = arguments[0] || {},
		    a = 1,
		    l = arguments.length,
		    c = !1;for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, a = 2), "object" == typeof s || u.isFunction(s) || (s = {}), l === a && (s = this, --a); l > a; a++) if (null != (t = arguments[a])) for (e in t) i = s[e], n = t[e], s !== n && (c && n && (u.isPlainObject(n) || (r = u.isArray(n))) ? (r ? (r = !1, o = i && u.isArray(i) ? i : []) : o = i && u.isPlainObject(i) ? i : {}, s[e] = u.extend(c, o, n)) : void 0 !== n && (s[e] = n));return s;
	}var u = t.exports = { type: i, isArray: r, isFunction: n, isPlainObject: s, each: o, extend: a, noop: function noop() {} },
	    l = Object.prototype.toString,
	    c = {};"Boolean Number String Function Array Date RegExp Object".split(" ").forEach(function (t) {
		c["[object " + t + "]"] = t.toLowerCase();
	});
}, function (t, e, i) {
	function n(t) {
		this.listenTime += t.from - this.currentTime, this.currentTime = t.to;
	}function r(t) {
		this.listenTime += t.position - this.currentTime, this.currentTime = t.position;
	}function o(t) {
		this.currentTime = t.position;
	}var s,
	    a = i(7);s = t.exports = function (t) {
		this.scAudio = t, this.listenTime = 0, this.currentTime = 0, this.scAudio.on(a.SEEK, n, this).on(a.PLAY_START, o, this).on(a.PAUSE, r, this);
	}, s.prototype = { constructor: s, getListenTime: function getListenTime() {
			return this.listenTime + this.scAudio.currentTime() - this.currentTime;
		} };
}, function (t, e) {
	var i = { CREATED: "created", STATE_CHANGE: "state-change", DESTROYED: "destroyed", PLAY: "play", PLAY_START: "play-start", PLAY_RESUME: "play-resume", METADATA: "metadata", PAUSE: "pause", FINISH: "finish", RESET: "reset", SEEK: "seek", SEEKED: "seeked", GEO_BLOCKED: "geo_blocked", BUFFERRING_START: "buffering_start", BUFFERRING_END: "buffering_end", FLASH_NOT_LOADED: "flash_not_loaded", FLASH_BLOCK: "flash_blocked", FLASH_UNBLOCK: "flash_unblocked", AUDIO_ERROR: "audio_error", TIME: "time", NO_STREAMS: "no_streams", STREAMS: "streams", NO_PROTOCOL: "no_protocol", NO_CONNECTION: "no_connection", REGISTERED: "registered", ONLINE: "online", OFFLINE: "offline" };t.exports = i;
}, function (t, e, i) {
	function n() {
		return this.scAudio.controller ? this.controller ? void v.warn("(%s) Setup was called while it was already initialized (returned with a no-op)", this.scAudio.getId()) : (v("(%s) Initialized", this.scAudio.getId()), this.controller = this.scAudio.controller, this.protocol = this.scAudio.streamInfo.protocol, void (this.host = E.getUrlHost(this.scAudio.streamInfo.url))) : void v.warn("Can´t initialize when controller is null");
	}function r() {
		this.controller && (v("(%s) Reset", this.scAudio.getId()), this.controller = this.protocol = this.host = null, this.timeToPlayMeasured = !1);
	}function o(t) {
		var e = this.scAudio.getAudioManagerStates();t === e.LOADING ? this.timeToPlayMeasured && f.call(this) : y.isNull(this.bufferingStartTime) || d.call(this);
	}function s() {
		this.metadataLoadStartTime = Date.now();
	}function a() {
		return y.isNull(this.metadataLoadStartTime) ? void v.warn("(%s) onMetadataEnd was called without onMetadataStart being called before.", this.scAudio.getId()) : (this.log({ type: "metadata", latency: Date.now() - this.metadataLoadStartTime }), void (this.metadataLoadStartTime = null));
	}function u() {
		this.playClickTime = Date.now();
	}function l() {
		if (!this.timeToPlayMeasured) {
			if (y.isNull(this.playClickTime)) return void v.warn("(%s) onPlayResume was called without onPlayStart being called before.", this.scAudio.getId());this.log({ type: "play", latency: Date.now() - this.playClickTime }), this.playClickTime = null, this.timeToPlayMeasured = !0;
		}
	}function c() {
		this.scAudio.isPaused() || (this.seekStartTime = Date.now());
	}function h() {
		if (!this.scAudio.isPaused()) {
			if (y.isNull(this.seekStartTime)) return void v.warn("(%s) onSeekEnd was called without onSeekStart being called before.", this.scAudio.getId());this.log({ type: "seek", latency: Date.now() - this.seekStartTime }), this.seekStartTime = null;
		}
	}function f() {
		this.bufferingStartTime || (this.bufferingStartTime = Date.now());
	}function d() {
		return y.isNull(this.bufferingStartTime) ? void v.warn("(%s) onBufferingEnd was called without onBufferingStart being called before.", this.scAudio.getId()) : (g.call(this), void (this.bufferingStartTime = null));
	}function g() {
		y.isNull(this.bufferingStartTime) || (y.isNull(this.bufferingTimeAccumulated) && (this.bufferingTimeAccumulated = 0), this.bufferingTimeAccumulated += Date.now() - this.bufferingStartTime);
	}function p() {
		g.call(this), y.isNull(this.bufferingTimeAccumulated) || (this.log({ type: "buffer", latency: this.bufferingTimeAccumulated }), this.bufferingStartTime = this.bufferingTimeAccumulated = null);
	}var m,
	    v,
	    T = i(9),
	    _ = i(7),
	    A = i(10),
	    E = i(12),
	    y = i(13);m = t.exports = function (t, e) {
		this.scAudio = t, this.logFn = e, this.controller = null, this.reset(), v = v || T(t.options.debug, "audioperf"), t.on(_.CREATED, n, this).on(_.RESET, r, this).on(_.DESTROYED, r, this).on(_.SEEK, c, this).on(_.SEEKED, h, this).on(_.PLAY, u, this).on(_.PLAY_START, s, this).on(_.PLAY_RESUME, l, this).on(_.PAUSE, p, this).on(_.FINISH, p, this).on(_.STATE_CHANGE, o, this).on(_.METADATA, a, this);
	}, y.extend(m.prototype, A, { constructor: m, log: function log(t) {
			return this.controller ? (y.extend(t, { protocol: this.protocol, host: this.host, playertype: this.controller.getType() }), v("(%s) %s latency: %d protocol: %s host: %s playertype: %s", this.scAudio.getId(), t.type, t.latency, t.protocol, t.host, t.playertype), void this.logFn(t)) : void v.warn("(%s) Monitor log was called while controller is null (returned with a no-op)", this.scAudio.getId());
		}, reset: function reset() {
			this.bufferingStartTime = this.bufferingTimeAccumulated = this.playClickTime = this.seekStartTime = this.metadataLoadStartTime = null, this.timeToPlayMeasured = !1;
		} });
}, function (t, e) {
	function i() {
		function t(t, i) {
			for (var n, r = arguments.length, o = Array(r > 2 ? r - 2 : 0), s = 2; r > s; s++) o[s - 2] = arguments[s];"string" == typeof i ? i = " " + i : (o.unshift(i), i = ""), (n = window.console)[t].apply(n, [e() + " |" + c + "%c" + i].concat(h, o));
		}function e() {
			var t = new Date(),
			    e = null === l ? 0 : t - l;return l = +t, "%c" + r(t.getHours()) + ":" + r(t.getMinutes()) + ":" + r(t.getSeconds()) + "." + n(t.getMilliseconds(), "0", 3) + "%c (%c" + n("+" + e + "ms", " ", 8) + "%c)";
		}var i = arguments.length <= 0 || void 0 === arguments[0] ? !0 : arguments[0],
		    o = arguments.length <= 1 || void 0 === arguments[1] ? "" : arguments[1];if (!i) return s;var l = null,
		    c = a(o),
		    h = ["color: green", "color: grey", "color: blue", "color: grey", u(o), ""],
		    f = t.bind(null, "log");return f.log = f, ["info", "warn", "error"].forEach(function (e) {
			f[e] = t.bind(null, e);
		}), f;
	}function n(t, e, i) {
		return o(e, i - ("" + t).length) + t;
	}function r(t) {
		return n(t, "0", 2);
	}function o(t, e) {
		return e > 0 ? new Array(e + 1).join(t) : "";
	}function s() {}function a(t) {
		return t ? "%c" + t : "%c";
	}t.exports = i, s.log = s.info = s.warn = s.error = s;var u = (function () {
		var t = ["#51613C", "#447848", "#486E5F", "#787444", "#6E664E"],
		    e = 0;return function (i) {
			return i ? "background-color:" + t[e++ % t.length] + ";color:#fff;border-radius:3px;padding:2px 4px;font-family:sans-serif;text-transform:uppercase;font-size:9px;margin:0 4px" : "";
		};
	})();
}, function (t, e, i) {
	t.exports = i(11);
}, function (t, e, i) {
	!(function () {
		function i() {
			return { keys: Object.keys || function (t) {
					if ("object" != typeof t && "function" != typeof t || null === t) throw new TypeError("keys() called on a non-object");var e,
					    i = [];for (e in t) t.hasOwnProperty(e) && (i[i.length] = e);return i;
				}, uniqueId: function uniqueId(t) {
					var e = ++a + "";return t ? t + e : e;
				}, has: function has(t, e) {
					return o.call(t, e);
				}, each: function each(t, e, i) {
					if (null != t) if (r && t.forEach === r) t.forEach(e, i);else if (t.length === +t.length) for (var n = 0, o = t.length; o > n; n++) e.call(i, t[n], n, t);else for (var s in t) this.has(t, s) && e.call(i, t[s], s, t);
				}, once: function once(t) {
					var e,
					    i = !1;return function () {
						return i ? e : (i = !0, e = t.apply(this, arguments), t = null, e);
					};
				} };
		}var n,
		    r = Array.prototype.forEach,
		    o = Object.prototype.hasOwnProperty,
		    s = Array.prototype.slice,
		    a = 0,
		    u = i();n = { on: function on(t, e, i) {
				if (!c(this, "on", t, [e, i]) || !e) return this;this._events || (this._events = {});var n = this._events[t] || (this._events[t] = []);return n.push({ callback: e, context: i, ctx: i || this }), this;
			}, once: function once(t, e, i) {
				if (!c(this, "once", t, [e, i]) || !e) return this;var n = this,
				    r = u.once(function () {
					n.off(t, r), e.apply(this, arguments);
				});return r._callback = e, this.on(t, r, i);
			}, off: function off(t, e, i) {
				var n, r, o, s, a, l, h, f;if (!this._events || !c(this, "off", t, [e, i])) return this;if (!t && !e && !i) return this._events = {}, this;for (s = t ? [t] : u.keys(this._events), a = 0, l = s.length; l > a; a++) if ((t = s[a], o = this._events[t])) {
					if ((this._events[t] = n = [], e || i)) for (h = 0, f = o.length; f > h; h++) r = o[h], (e && e !== r.callback && e !== r.callback._callback || i && i !== r.context) && n.push(r);n.length || delete this._events[t];
				}return this;
			}, trigger: function trigger(t) {
				if (!this._events) return this;var e = s.call(arguments, 1);if (!c(this, "trigger", t, e)) return this;var i = this._events[t],
				    n = this._events.all;return i && h(i, e), n && h(n, arguments), this;
			}, stopListening: function stopListening(t, e, i) {
				var n = this._listeners;if (!n) return this;var r = !e && !i;"object" == typeof e && (i = this), t && ((n = {})[t._listenerId] = t);for (var o in n) n[o].off(e, i, this), r && delete this._listeners[o];return this;
			} };var l = /\s+/,
		    c = function c(t, e, i, n) {
			if (!i) return !0;if ("object" == typeof i) {
				for (var r in i) t[e].apply(t, [r, i[r]].concat(n));return !1;
			}if (l.test(i)) {
				for (var o = i.split(l), s = 0, a = o.length; a > s; s++) t[e].apply(t, [o[s]].concat(n));return !1;
			}return !0;
		},
		    h = function h(t, e) {
			var i,
			    n = -1,
			    r = t.length,
			    o = e[0],
			    s = e[1],
			    a = e[2];switch (e.length) {case 0:
					for (; ++n < r;) (i = t[n]).callback.call(i.ctx);return;case 1:
					for (; ++n < r;) (i = t[n]).callback.call(i.ctx, o);return;case 2:
					for (; ++n < r;) (i = t[n]).callback.call(i.ctx, o, s);return;case 3:
					for (; ++n < r;) (i = t[n]).callback.call(i.ctx, o, s, a);return;default:
					for (; ++n < r;) (i = t[n]).callback.apply(i.ctx, e);}
		},
		    f = { listenTo: "on", listenToOnce: "once" };u.each(f, function (t, e) {
			n[e] = function (e, i, n) {
				var r = this._listeners || (this._listeners = {}),
				    o = e._listenerId || (e._listenerId = u.uniqueId("l"));return r[o] = e, "object" == typeof i && (n = this), e[t](i, n, this), this;
			};
		}), n.bind = n.on, n.unbind = n.off, n.mixin = function (t) {
			var e = ["on", "once", "off", "trigger", "stopListening", "listenTo", "listenToOnce", "bind", "unbind"];return u.each(e, function (e) {
				t[e] = this[e];
			}, this), t;
		}, "undefined" != typeof t && t.exports && (e = t.exports = n), e.BackboneEvents = n;
	})(this);
}, function (t, e) {
	var i = { getUrlParams: function getUrlParams(t) {
			var e = {},
			    i = t.indexOf("?");return i > -1 && t.substr(i + 1).split("&").forEach(function (t) {
				var i = t.split("=");e[i[0]] = i[1];
			}), e;
		}, getUrlHost: function getUrlHost(t) {
			var e,
			    i = t.split("//");return e = i[0] === t ? i[0].split("/")[0] : i[1] ? i[1].split("/")[0] : "";
		} };t.exports = i;
}, function (t, e) {
	var i = { extend: function extend(t) {
			var e = Array.prototype.slice.call(arguments, 1);return e.forEach(function (e) {
				if (e) for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
			}), t;
		}, each: function each(t, e, i) {
			Object.keys(t).forEach(function (n) {
				e.call(i || null, t[n], n);
			});
		}, without: function without(t, e) {
			var i = t.indexOf(e);i > -1 && t.splice(i, 1);
		}, result: function result(t) {
			var e = t;return i.isFunction(e) && (e = t()), e;
		}, isFunction: function isFunction(t) {
			return "function" == typeof t;
		}, after: function after(t, e) {
			return function () {
				return --t < 1 ? e.apply(this, arguments) : void 0;
			};
		}, isNull: function isNull(t) {
			return null === t;
		}, once: function once(t) {
			var e,
			    i = !1;return function () {
				return i ? e : (i = !0, void (e = t.apply(this, arguments)));
			};
		} };t.exports = i;
}, function (t, e) {
	var i = { AAC: "aac", MP3: "mp3", OGG: "ogg", OPUS: "opus", WAV: "wav" };t.exports = i;
}, function (t, e) {
	var i = { HTTP: "http", RTMP: "rtmp", HLS: "hls" };t.exports = i;
}, function (t, e, i) {
	function n(t) {
		return l.supportsMediaSourceExtensions() && t.mediaSourceEnabled && (l.isChrome() && l.getChromeVersion() >= 35 || l.isFirefox() && t.mseFirefox || l.isSafari() && t.mseSafari);
	}function r(t) {
		return function (e) {
			var i = !1;switch (e) {case u.RTMP:
					i = l.supportsFlash();break;case u.HTTP:
					i = l.supportsHTML5Audio() || l.supportsFlash();break;case u.HLS:
					i = n(t);}return i;
		};
	}function o(t) {
		return l.isSafari() || l.isFirefox() ? [u.HLS, u.HTTP, u.RTMP] : t;
	}function s(t) {
		t.protocols = o(t.protocols).filter(r(t));
	}var a,
	    u = i(15),
	    l = i(17);a = { prioritizeAndFilter: s }, t.exports = a;
}, function (t, e) {
	function i(t) {
		return t.test(window.navigator.userAgent.toLowerCase());
	}function n(t, e) {
		try {
			return window.navigator.userAgent.toLowerCase().match(t)[e];
		} catch (i) {
			return null;
		}
	}function r() {
		try {
			return parseInt(n(/chrom(e|ium)\/([0-9]+)\./, 2), 10);
		} catch (t) {
			return NaN;
		}
	}function o() {
		return !l() && i(/safari/);
	}function s() {
		return o() && i(/version\/7\.1/);
	}function a() {
		return o() && i(/version\/8/) && !i(/version\/80/);
	}function u() {
		return o() && i(/version\/9\./);
	}function l() {
		return i(/chrom(e|ium)/);
	}function c() {
		return i(/firefox/);
	}function h() {
		return !!window.MediaSource && (window.MediaSource.isTypeSupported("audio/mpeg") || window.MediaSource.isTypeSupported("audio/mp4"));
	}function f() {
		try {
			return window.hasOwnProperty("Audio") && !!new window.Audio().canPlayType("audio/mpeg");
		} catch (t) {
			return !1;
		}
	}function d() {
		try {
			var t = o() && i(/version\/5\.0/),
			    e = window.hasOwnProperty("Audio") && (!!new window.Audio().canPlayType('audio/x-mpegURL; codecs="mp3"') || !!new window.Audio().canPlayType('vnd.apple.mpegURL; codecs="mp3"'));return !t && e;
		} catch (n) {
			return !1;
		}
	}function g() {
		return m(p()) >= T;
	}function p() {
		var t, e, i, n;if ("undefined" != typeof window.ActiveXObject) try {
			n = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash"), n && (t = n.GetVariable("$version"));
		} catch (r) {
			t = null;
		} else window.navigator && window.navigator.plugins && window.navigator.plugins.length > 0 && (i = "application/x-shockwave-flash", e = window.navigator.mimeTypes, e && e[i] && e[i].enabledPlugin && e[i].enabledPlugin.description && (t = e[i].enabledPlugin.description));return t;
	}function m(t) {
		if (!t) return 0;var e = t.match(/\d\S+/)[0].replace(/,/g, ".").split(".");return parseFloat([e[0], e[1]].join(".")) || 0;
	}var v,
	    T = 9;v = { flashPlugin: p, isSafari: o, isSafari71: s, isSafari8: a, isSafari9: u, isChrome: l, getChromeVersion: r, isFirefox: c, supportsNativeHLSAudio: d, supportsHTML5Audio: f, supportsFlash: g, supportsMediaSourceExtensions: h }, t.exports = v;
}, function (t, e, i) {
	function n(t) {
		var e = f.getUrlHost(t);return g.every(function (t) {
			return 0 !== e.indexOf(t);
		});
	}function r(t, e) {
		return !(t === c.HLS && !n(e));
	}function o(t, e) {
		if (!t) return !1;var i = t.issuedAt + s(t.protocol, t.duration);return a(t.protocol) ? Date.now() + t.duration - (e || 0) < i : Date.now() < i;
	}function s(t, e) {
		var i = a(t);return p + (i ? h.result(e) : 0);
	}function a(t) {
		return t === c.HTTP || t === c.HLS;
	}function u(t, e) {
		function i(t) {
			return -1 * t;
		}function n(t, e) {
			return Math.abs(e - v) - Math.abs(t - v);
		}var o,
		    s,
		    a,
		    u,
		    l,
		    c,
		    f,
		    d,
		    g,
		    p,
		    m = {},
		    v = e.maxBitrate,
		    T = e.protocols,
		    _ = e.extensions;for (h.each(t, function (t, e) {
			var i = e.split("_"),
			    n = i[0],
			    r = i[1],
			    o = i[2];m[n] = m[n] || {}, m[n][r] = m[n][r] || {}, m[n][r][o] = t;
		}), l = 0, c = T.length; c > l; ++l) for (u = T[l], d = 0, g = _.length; g > d; ++d) if ((f = _[d], m[u] && m[u][f])) {
			if ((o = Object.keys(m[u][f]).map(Number).sort(i), s = v === 1 / 0, a = v === -(1 / 0), v = s || a ? o[s ? "pop" : "shift"]() : o.sort(n).pop(), p = m[u][f][v], !r(u, p))) continue;return { url: p, bitrate: v, protocol: u, extension: f, issuedAt: Date.now(), duration: h.result(e.duration) };
		}return null;
	}var l,
	    c = i(15),
	    h = i(13),
	    f = i(12),
	    d = .9,
	    g = [],
	    p = Math.floor(12e4 * d);l = { choosePreferredStream: u, streamValidForPlayingFrom: o }, t.exports = l;
}, function (t, e, i) {
	var n,
	    r,
	    o = i(7),
	    s = i(13),
	    a = { Linear: 0, EaseOut: 1, EaseInOut: 2 },
	    u = 600,
	    l = 25;t.exports = n = {}, n.VolumeAutomator = r = function (t) {
		this.scAudio = t, this.fadeOutAlgo = this.scAudio.options.fadeOutAlgo, this.fadeOutTimer = null, this.initialVolume = void 0, this.scAudio.options.fadeOutOnPause && r.isSupported() && (this.scAudio.on(o.PLAY, this.onPlay, this), this.scAudio.registerHook("pause", this.hookPause.bind(this)));
	}, n.VolumeAutomator.isSupported = function () {
		var t = new window.Audio(),
		    e = t.volume,
		    i = 0 === e ? 1 : e / 2;return t.volume = i, t.volume === i;
	}, n.VolumeAutomator.Algos = a, s.extend(r.prototype, { fadeOutAndPause: function fadeOutAndPause() {
			var t = Date.now(),
			    e = (function () {
				var i,
				    n = (Date.now() - t) / u,
				    r = this.initialVolume;if (n >= 1) this.scAudio.controller && this.scAudio.controller.pause(), this.cancelFadeout();else {
					switch (this.fadeOutAlgo) {case a.Linear:
							i = r * (1 - n);break;case a.EaseOut:
							i = r * (1 / (10 * (n + .1)) - .05);break;case a.EaseInOut:default:
							i = r * (Math.cos(n * Math.PI) / 2 + .5);}this.scAudio.setVolume(i), window.clearTimeout(this.fadeOutTimer), this.fadeOutTimer = window.setTimeout(e, l);
				}
			}).bind(this);this.initialVolume = this.scAudio.getVolume(), e();
		}, cancelFadeout: function cancelFadeout() {
			this.fadeOutTimer && (window.clearTimeout(this.fadeOutTimer), this.fadeOutTimer = null, this.scAudio.setVolume(this.initialVolume), this.initialVolume = void 0);
		}, hookPause: function hookPause(t) {
			return this.fadeOutAndPause(), !1;
		}, onPlay: function onPlay() {
			this.cancelFadeout();
		} });
}]);

},{}]},{},[9,8]);
