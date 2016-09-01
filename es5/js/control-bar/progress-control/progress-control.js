/**
 * @file progress-control.js
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

var _componentJs = require('../../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

require('./seek-bar.js');

require('./mouse-time-display.js');

/**
 * The Progress Control component contains the seek bar, load progress,
 * and play progress
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class ProgressControl
 */

var ProgressControl = (function (_Component) {
  _inherits(ProgressControl, _Component);

  function ProgressControl() {
    _classCallCheck(this, ProgressControl);

    _get(Object.getPrototypeOf(ProgressControl.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProgressControl, [{
    key: 'createEl',

    /**
     * Create the component's DOM element
     *
     * @return {Element}
     * @method createEl
     */
    value: function createEl() {
      return _get(Object.getPrototypeOf(ProgressControl.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-progress-control koment-control'
      });
    }
  }]);

  return ProgressControl;
})(_componentJs2['default']);

ProgressControl.prototype.options_ = {
  children: ['seekBar']
};

_componentJs2['default'].registerComponent('ProgressControl', ProgressControl);
exports['default'] = ProgressControl;
module.exports = exports['default'];