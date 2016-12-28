/**
 * @file button.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _utilsDomJs = require('./utils/dom.js');

var Dom = _interopRequireWildcard(_utilsDomJs);

var _utilsFnJs = require('./utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsLogJs = require('./utils/log.js');

var _utilsLogJs2 = _interopRequireDefault(_utilsLogJs);

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

/**
 * Clickable Component which is clickable or keyboard actionable, but is not a native HTML button
 *
 * @param {Object} player  Main Player
 * @param {Object=} options Object of option names and values
 * @extends Component
 * @class ClickableComponent
 */

var Component = _videoJs2['default'].getComponent('Component');

var ClickableComponent = (function (_Component) {
  _inherits(ClickableComponent, _Component);

  function ClickableComponent(player, options) {
    _classCallCheck(this, ClickableComponent);

    _get(Object.getPrototypeOf(ClickableComponent.prototype), 'constructor', this).call(this, player, options);

    this.emitTapEvents();

    this.on('tap', this.handleClick);
    this.on('click', this.handleClick);
    this.on('focus', this.handleFocus);
    this.on('blur', this.handleBlur);
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

  _createClass(ClickableComponent, [{
    key: 'createEl',
    value: function createEl() {
      var tag = arguments.length <= 0 || arguments[0] === undefined ? 'div' : arguments[0];
      var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var attributes = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      props = (0, _objectAssign2['default'])({
        className: this.buildCSSClass(),
        tabIndex: 0
      }, props);

      if (tag === 'button') {
        _utilsLogJs2['default'].error('Creating a ClickableComponent with an HTML element of ' + tag + ' is not supported; use a Button instead.');
      }

      // Add ARIA attributes for clickable element which is not a native HTML button
      attributes = (0, _objectAssign2['default'])({
        'role': 'button',

        // let the screen reader user know that the text of the element may change
        'aria-live': 'polite'
      }, attributes);

      var el = _get(Object.getPrototypeOf(ClickableComponent.prototype), 'createEl', this).call(this, tag, props, attributes);

      this.createControlTextEl(el);

      return el;
    }

    /**
     * create control text
     *
     * @param {Element} el Parent element for the control text
     * @return {Element}
     * @method controlText
     */
  }, {
    key: 'createControlTextEl',
    value: function createControlTextEl(el) {
      this.controlTextEl_ = Dom.createEl('span', {
        className: 'koment-control-text'
      });

      if (el) {
        el.appendChild(this.controlTextEl_);
      }

      this.controlText(this.controlText_, el);

      return this.controlTextEl_;
    }

    /**
     * Controls text - both request and localize
     *
     * @param {String}  text Text for element
     * @param {Element=} el Element to set the title on
     * @return {String}
     * @method controlText
     */
  }, {
    key: 'controlText',
    value: function controlText(text) {
      var el = arguments.length <= 1 || arguments[1] === undefined ? this.el() : arguments[1];

      if (!text) {
        return this.controlText_ || 'Need Text';
      }

      var localizedText = this.localize(text);

      this.controlText_ = text;
      this.controlTextEl_.innerHTML = localizedText;
      el.setAttribute('title', localizedText);

      return this;
    }

    /**
     * Allows sub components to stack CSS class names
     *
     * @return {String}
     * @method buildCSSClass
     */
  }, {
    key: 'buildCSSClass',
    value: function buildCSSClass() {
      return 'koment-control koment-button ' + _get(Object.getPrototypeOf(ClickableComponent.prototype), 'buildCSSClass', this).call(this);
    }

    /**
     * Adds a child component inside this clickable-component
     *
     * @param {String|Component} child The class name or instance of a child to add
     * @param {Object=} options Options, including options to be passed to children of the child.
     * @return {Component} The child component (created by this process if a string was used)
     * @method addChild
     */
  }, {
    key: 'addChild',
    value: function addChild(child) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      // TODO: Fix adding an actionable child to a ClickableComponent; currently
      // it will cause issues with assistive technology (e.g. screen readers)
      // which support ARIA, since an element with role="button" cannot have
      // actionable child elements.

      // let className = this.constructor.name;
      // log.warn(`Adding a child to a ClickableComponent (${className}) can cause issues with assistive technology which supports ARIA, since an element with role="button" cannot have actionable child elements.`);

      return _get(Object.getPrototypeOf(ClickableComponent.prototype), 'addChild', this).call(this, child, options);
    }

    /**
     * Enable the component element
     *
     * @return {Component}
     * @method enable
     */
  }, {
    key: 'enable',
    value: function enable() {
      this.removeClass('koment-disabled');
      this.el_.setAttribute('aria-disabled', 'false');
      return this;
    }

    /**
     * Disable the component element
     *
     * @return {Component}
     * @method disable
     */
  }, {
    key: 'disable',
    value: function disable() {
      this.addClass('koment-disabled');
      this.el_.setAttribute('aria-disabled', 'true');
      return this;
    }

    /**
     * Handle Click - Override with specific functionality for component
     *
     * @method handleClick
     */
  }, {
    key: 'handleClick',
    value: function handleClick() {}

    /**
     * Handle Focus - Add keyboard functionality to element
     *
     * @method handleFocus
     */
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      Events.on(_globalDocument2['default'], 'keydown', Fn.bind(this, this.handleKeyPress));
    }

    /**
     * Handle KeyPress (document level) - Trigger click when Space or Enter key is pressed
     *
     * @method handleKeyPress
     */
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(event) {

      // Support Space (32) or Enter (13) key operation to fire a click event
      if (event.which === 32 || event.which === 13) {
        event.preventDefault();
        this.handleClick(event);
      } else if (_get(Object.getPrototypeOf(ClickableComponent.prototype), 'handleKeyPress', this)) {

        // Pass keypress handling up for unsupported keys
        _get(Object.getPrototypeOf(ClickableComponent.prototype), 'handleKeyPress', this).call(this, event);
      }
    }

    /**
     * Handle Blur - Remove keyboard triggers
     *
     * @method handleBlur
     */
  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      Events.off(_globalDocument2['default'], 'keydown', Fn.bind(this, this.handleKeyPress));
    }
  }]);

  return ClickableComponent;
})(Component);

Component.registerComponent('ClickableComponent', ClickableComponent);
exports['default'] = ClickableComponent;
module.exports = exports['default'];