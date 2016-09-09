/**
 * @file Videojs.js
 * Videojs Media Controller - Wrapper for Videojs Media API
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _techJs = require('./tech.js');

var _techJs2 = _interopRequireDefault(_techJs);

var _html5Js = require('./html5.js');

var _html5Js2 = _interopRequireDefault(_html5Js);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _utilsFnJs = require('../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

/**
 * Videojs Media Controller - Wrapper for Videojs Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Videojs
 */

var Videojs = (function (_Html5) {
  _inherits(Videojs, _Html5);

  function Videojs(options, ready) {
    _classCallCheck(this, Videojs);

    _get(Object.getPrototypeOf(Videojs.prototype), 'constructor', this).call(this, options, ready);
  }

  return Videojs;
})(_html5Js2['default']);

Videojs.isSupported = function (tag) {
  return tag && tag.firstChild && tag.firstChild.tagName === 'VIDEO' && ~'vjs-tech'.indexOf(tag.firstChild.classList);
};

_component2['default'].registerComponent('Videojs', Videojs);
_techJs2['default'].registerTech('Videojs', Videojs);
exports['default'] = Videojs;
module.exports = exports['default'];