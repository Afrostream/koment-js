/**
 * @file user-button.js
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

var _componentJs = require('../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

var _buttonJs = require('../button.js');

var _buttonJs2 = _interopRequireDefault(_buttonJs);

/**
 * The button component for toggling and selecting koment
 * Chapters act much differently than other text tracks
 * Cues are navigation vs. other tracks of alternative languages
 *
 * @param {Object} player  Player object
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready    Ready callback function
 * @extends Button
 * @class UserButton
 */

var UserButton = (function (_Button) {
  _inherits(UserButton, _Button);

  function UserButton(player, options, ready) {
    _classCallCheck(this, UserButton);

    _get(Object.getPrototypeOf(UserButton.prototype), 'constructor', this).call(this, player, options, ready);
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */

  _createClass(UserButton, [{
    key: 'buildCSSClass',
    value: function buildCSSClass() {
      return 'user-button ' + _get(Object.getPrototypeOf(UserButton.prototype), 'buildCSSClass', this).call(this);
    }

    /**
     * Handle click on text track
     *
     * @method handleClick
     */
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      _get(Object.getPrototypeOf(UserButton.prototype), 'handleClick', this).call(this, event);
      this.addClass('active');
      this.setTimeout(this.disable, 300);
      this.player_.toggleLogin();
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.removeClass('active');
    }
  }]);

  return UserButton;
})(_buttonJs2['default']);

UserButton.prototype.controlText_ = 'Signin/Signup';

_componentJs2['default'].registerComponent('UserButton', UserButton);
exports['default'] = UserButton;
module.exports = exports['default'];