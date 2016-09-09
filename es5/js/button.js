/**
 * @file button.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _clickableComponentJs = require('./clickable-component.js');

var _clickableComponentJs2 = _interopRequireDefault(_clickableComponentJs);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _utilsLogJs = require('./utils/log.js');

var _utilsLogJs2 = _interopRequireDefault(_utilsLogJs);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

/**
 * Base class for all buttons
 *
 * @param {Object} player  Main Player
 * @param {Object=} options Object of option names and values
 * @extends ClickableComponent
 * @class Button
 */

var Button = (function (_ClickableComponent) {
  _inherits(Button, _ClickableComponent);

  function Button(player, options) {
    _classCallCheck(this, Button);

    _get(Object.getPrototypeOf(Button.prototype), 'constructor', this).call(this, player, options);
  }

  /**
   * Create the component's DOM element
   *
   * @param {String=} type Element's node type. e.g. 'div'
   * @param {Object=} props An object of properties that should be set on the element
   * @param {Object=} attributes An object of attributes that should be set on the element
   * @return {Element}
   * @method createEl
   */

  _createClass(Button, [{
    key: 'createEl',
    value: function createEl() {
      var tag = arguments.length <= 0 || arguments[0] === undefined ? 'button' : arguments[0];
      var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var attributes = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      props = (0, _objectAssign2['default'])({
        className: this.buildCSSClass()
      }, props);

      if (tag !== 'button') {
        _utilsLogJs2['default'].warn('Creating a Button with an HTML element of ' + tag + ' is deprecated; use ClickableComponent instead.');

        // Add properties for clickable element which is not a native HTML button
        props = (0, _objectAssign2['default'])({
          tabIndex: 0
        }, props);

        // Add ARIA attributes for clickable element which is not a native HTML button
        attributes = (0, _objectAssign2['default'])({
          role: 'button'
        }, attributes);
      }

      // Add attributes for button element
      attributes = (0, _objectAssign2['default'])({

        // Necessary since the default button type is "submit"
        'type': 'button',

        // let the screen reader user know that the text of the button may change
        'aria-live': 'polite'
      }, attributes);

      var el = _component2['default'].prototype.createEl.call(this, tag, props, attributes);

      this.createControlTextEl(el);

      return el;
    }

    /**
     * Adds a child component inside this button
     *
     * @param {String|Component} child The class name or instance of a child to add
     * @param {Object=} options Options, including options to be passed to children of the child.
     * @return {Component} The child component (created by this process if a string was used)
     * @deprecated
     * @method addChild
     */
  }, {
    key: 'addChild',
    value: function addChild(child) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var className = this.constructor.name;

      _utilsLogJs2['default'].warn('Adding an actionable (user controllable) child to a Button (' + className + ') is not supported; use a ClickableComponent instead.');

      // Avoid the error message generated by ClickableComponent's addChild method
      return _component2['default'].prototype.addChild.call(this, child, options);
    }

    /**
     * Handle KeyPress (document level) - Extend with specific functionality for button
     *
     * @method handleKeyPress
     */
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(event) {

      // Ignore Space (32) or Enter (13) key operation, which is handled by the browser for a button.
      if (event.which === 32 || event.which === 13) {
        return;
      }

      // Pass keypress handling up for unsupported keys
      _get(Object.getPrototypeOf(Button.prototype), 'handleKeyPress', this).call(this, event);
    }
  }]);

  return Button;
})(_clickableComponentJs2['default']);

_component2['default'].registerComponent('Button', Button);
exports['default'] = Button;
module.exports = exports['default'];