/**
 * @file popup-button.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _clickableComponentJs = require('../clickable-component.js');

var _clickableComponentJs2 = _interopRequireDefault(_clickableComponentJs);

var _componentJs = require('../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

/**
 * A button class with a popup control
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends ClickableComponent
 * @class PopupButton
 */

var PopupButton = (function (_ClickableComponent) {
  _inherits(PopupButton, _ClickableComponent);

  function PopupButton(player) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, PopupButton);

    _get(Object.getPrototypeOf(PopupButton.prototype), 'constructor', this).call(this, player, options);

    this.update();
  }

  /**
   * Update popup
   *
   * @method update
   */

  _createClass(PopupButton, [{
    key: 'update',
    value: function update() {
      var popup = this.createPopup();

      if (this.popup) {
        this.removeChild(this.popup);
      }

      this.popup = popup;
      this.addChild(popup);

      if (this.items && this.items.length === 0) {
        this.hide();
      } else if (this.items && this.items.length > 1) {
        this.show();
      }
    }

    /**
     * Create popup - Override with specific functionality for component
     *
     * @return {Popup} The constructed popup
     * @method createPopup
     */
  }, {
    key: 'createPopup',
    value: function createPopup() {}

    /**
     * Create the component's DOM element
     *
     * @return {Element}
     * @method createEl
     */
  }, {
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(PopupButton.prototype), 'createEl', this).call(this, 'div', {
        className: this.buildCSSClass()
      });
    }

    /**
     * Allow sub components to stack CSS class names
     *
     * @return {String} The constructed class name
     * @method buildCSSClass
     */
  }, {
    key: 'buildCSSClass',
    value: function buildCSSClass() {
      var menuButtonClass = 'koment-menu-button';

      // If the inline option is passed, we want to use different styles altogether.
      if (this.options_.inline === true) {
        menuButtonClass += '-inline';
      } else {
        menuButtonClass += '-popup';
      }

      return 'koment-menu-button ' + menuButtonClass + ' ' + _get(Object.getPrototypeOf(PopupButton.prototype), 'buildCSSClass', this).call(this);
    }
  }]);

  return PopupButton;
})(_clickableComponentJs2['default']);

_componentJs2['default'].registerComponent('PopupButton', PopupButton);
exports['default'] = PopupButton;
module.exports = exports['default'];