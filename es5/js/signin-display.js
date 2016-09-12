/**
 * @file signin-display.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilsDomJs = require('./utils/dom.js');

var Dom = _interopRequireWildcard(_utilsDomJs);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _modalDialog = require('./modal-dialog');

var _modalDialog2 = _interopRequireDefault(_modalDialog);

var _utilsMergeOptions = require('./utils/merge-options');

var _utilsMergeOptions2 = _interopRequireDefault(_utilsMergeOptions);

/**
 * Display that an error has occurred making the video unplayable.
 *
 * @extends ModalDialog
 * @class SigninDisplay
 */

var SigninDisplay = (function (_ModalDialog) {
  _inherits(SigninDisplay, _ModalDialog);

  /**
   * Constructor for error display modal.
   *
   * @param  {Player} player
   * @param  {Object} [options]
   */

  function SigninDisplay(player, options) {
    _classCallCheck(this, SigninDisplay);

    _get(Object.getPrototypeOf(SigninDisplay.prototype), 'constructor', this).call(this, player, options);
    this.on(player, 'signinpopup', this.open);
  }

  /**
   * Include the old class for backward-compatibility.
   *
   * This can be removed in 6.0.
   *
   * @method buildCSSClass
   * @deprecated
   * @return {String}
   */

  _createClass(SigninDisplay, [{
    key: 'buildCSSClass',
    value: function buildCSSClass() {
      return 'koment-signin-display ' + _get(Object.getPrototypeOf(SigninDisplay.prototype), 'buildCSSClass', this).call(this);
    }

    /**
     * Generates the modal content based on the player error.
     *
     * @return {String|Null}
     */
  }, {
    key: 'content',
    value: function content() {
      return Dom.createEl('iframe', {
        src: 'signup.html',
        frameBorder: 0,
        allowTransparency: true
      });
    }
  }]);

  return SigninDisplay;
})(_modalDialog2['default']);

SigninDisplay.prototype.options_ = (0, _utilsMergeOptions2['default'])(_modalDialog2['default'].prototype.options_, {
  fillAlways: true,
  temporary: false,
  uncloseable: false
});

_component2['default'].registerComponent('SigninDisplay', SigninDisplay);
exports['default'] = SigninDisplay;
module.exports = exports['default'];