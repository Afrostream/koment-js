/**
 * @file slider.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _componentJs = require('../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

var _utilsDomJs = require('../utils/dom.js');

var Dom = _interopRequireWildcard(_utilsDomJs);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

/**
 * The base functionality for sliders like the volume bar and seek bar
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class Slider
 */

var Slider = (function (_Component) {
  _inherits(Slider, _Component);

  function Slider(player, options) {
    _classCallCheck(this, Slider);

    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).call(this, player, options);

    // Set property names to bar to match with the child Slider class is looking for
    this.bar = this.getChild(this.options_.barName);

    // Set a horizontal or vertical class on the slider depending on the slider type
    this.vertical(!!this.options_.vertical);

    this.on('mousedown', this.handleMouseDown);
    this.on('touchstart', this.handleMouseDown);
    this.on('focus', this.handleFocus);
    this.on('blur', this.handleBlur);
    this.on('click', this.handleClick);

    this.on(player, 'controlsvisible', this.update);
    this.on(player, this.playerEvent, this.update);
  }

  /**
   * Create the component's DOM element
   *
   * @param {String} type Type of element to create
   * @param {Object=} props List of properties in Object form
   * @return {Element}
   * @method createEl
   */

  _createClass(Slider, [{
    key: 'createEl',
    value: function createEl(type) {
      var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var attributes = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      // Add the slider element class to all sub classes
      props.className = props.className + ' kmt-slider';
      props = (0, _objectAssign2['default'])({
        tabIndex: 0
      }, props);

      attributes = (0, _objectAssign2['default'])({
        'role': 'slider',
        'aria-valuenow': 0,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'tabIndex': 0
      }, attributes);

      return _get(Object.getPrototypeOf(Slider.prototype), 'createEl', this).call(this, type, props, attributes);
    }

    /**
     * Handle mouse down on slider
     *
     * @param {Object} event Mouse down event object
     * @method handleMouseDown
     */
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(event) {
      var doc = this.bar.el_.ownerDocument;

      event.preventDefault();
      Dom.blockTextSelection();

      this.addClass('kmt-sliding');
      this.trigger('slideractive');

      this.on(doc, 'mousemove', this.handleMouseMove);
      this.on(doc, 'mouseup', this.handleMouseUp);
      this.on(doc, 'touchmove', this.handleMouseMove);
      this.on(doc, 'touchend', this.handleMouseUp);

      this.handleMouseMove(event);
    }

    /**
     * To be overridden by a subclass
     *
     * @method handleMouseMove
     */
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove() {}

    /**
     * Handle mouse up on Slider
     *
     * @method handleMouseUp
     */
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp() {
      var doc = this.bar.el_.ownerDocument;

      Dom.unblockTextSelection();

      this.removeClass('kmt-sliding');
      this.trigger('sliderinactive');

      this.off(doc, 'mousemove', this.handleMouseMove);
      this.off(doc, 'mouseup', this.handleMouseUp);
      this.off(doc, 'touchmove', this.handleMouseMove);
      this.off(doc, 'touchend', this.handleMouseUp);

      this.update();
    }

    /**
     * Update slider
     *
     * @method update
     */
  }, {
    key: 'update',
    value: function update() {
      // In VolumeBar init we have a setTimeout for update that pops and update to the end of the
      // execution stack. The player is destroyed before then update will cause an error
      if (!this.el_) {
        return;
      }

      // If scrubbing, we could use a cached value to make the handle keep up with the user's mouse.
      // On HTML5 browsers scrubbing is really smooth, but some flash players are slow, so we might want to utilize this later.
      // var progress =  (this.player_.scrubbing()) ? this.player_.getCache().currentTime / this.player_.duration() : this.player_.currentTime() / this.player_.duration();
      var progress = this.getPercent();
      var bar = this.bar;

      // If there's no bar...
      if (!bar) {
        return;
      }

      // Protect against no duration and other division issues
      if (typeof progress !== 'number' || progress !== progress || progress < 0 || progress === Infinity) {
        progress = 0;
      }

      // Convert to a percentage for setting
      var percentage = (progress * 100).toFixed(2) + '%';

      // Set the new bar width or height
      if (this.vertical()) {
        bar.el().style.height = percentage;
      } else {
        bar.el().style.width = percentage;
      }
    }

    /**
     * Calculate distance for slider
     *
     * @param {Object} event Event object
     * @method calculateDistance
     */
  }, {
    key: 'calculateDistance',
    value: function calculateDistance(event) {
      var position = Dom.getPointerPosition(this.el_, event);

      if (this.vertical()) {
        return position.y;
      }
      return position.x;
    }

    /**
     * Handle on focus for slider
     *
     * @method handleFocus
     */
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      this.on(this.bar.el_.ownerDocument, 'keydown', this.handleKeyPress);
    }

    /**
     * Handle key press for slider
     *
     * @param {Object} event Event object
     * @method handleKeyPress
     */
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(event) {
      // Left and Down Arrows
      if (event.which === 37 || event.which === 40) {
        event.preventDefault();
        this.stepBack();

        // Up and Right Arrows
      } else if (event.which === 38 || event.which === 39) {
          event.preventDefault();
          this.stepForward();
        }
    }

    /**
     * Handle on blur for slider
     *
     * @method handleBlur
     */
  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      this.off(this.bar.el_.ownerDocument, 'keydown', this.handleKeyPress);
    }

    /**
     * Listener for click events on slider, used to prevent clicks
     *   from bubbling up to parent elements like button menus.
     *
     * @param {Object} event Event object
     * @method handleClick
     */
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    /**
     * Get/set if slider is horizontal for vertical
     *
     * @param {Boolean} bool True if slider is vertical, false is horizontal
     * @return {Boolean} True if slider is vertical, false is horizontal
     * @method vertical
     */
  }, {
    key: 'vertical',
    value: function vertical(bool) {
      if (bool === undefined) {
        return this.vertical_ || false;
      }

      this.vertical_ = !!bool;

      if (this.vertical_) {
        this.addClass('kmt-slider-vertical');
      } else {
        this.addClass('kmt-slider-horizontal');
      }

      return this;
    }
  }]);

  return Slider;
})(_componentJs2['default']);

_componentJs2['default'].registerComponent('Slider', Slider);
exports['default'] = Slider;
module.exports = exports['default'];