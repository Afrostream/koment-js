/**
 * @file mouse-time-display.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _componentJs = require('../../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

var _utilsDomJs = require('../../utils/dom.js');

var Dom = _interopRequireWildcard(_utilsDomJs);

var _utilsFnJs = require('../../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsFormatTimeJs = require('../../utils/format-time.js');

var _utilsFormatTimeJs2 = _interopRequireDefault(_utilsFormatTimeJs);

var _lodashCompatFunctionThrottle = require('lodash-compat/function/throttle');

var _lodashCompatFunctionThrottle2 = _interopRequireDefault(_lodashCompatFunctionThrottle);

/**
 * The Mouse Time Display component shows the time you will seek to
 * when hovering over the progress bar
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class MouseTimeDisplay
 */

var MouseTimeDisplay = (function (_Component) {
  _inherits(MouseTimeDisplay, _Component);

  function MouseTimeDisplay(player, options) {
    var _this = this;

    _classCallCheck(this, MouseTimeDisplay);

    _get(Object.getPrototypeOf(MouseTimeDisplay.prototype), 'constructor', this).call(this, player, options);

    if (options.playerOptions && options.playerOptions.progressControl && options.playerOptions.progressControl.keepTooltipsInside) {
      this.keepTooltipsInside = options.playerOptions.progressControl.keepTooltipsInside;
    }

    if (this.keepTooltipsInside) {
      this.tooltip = Dom.createEl('div', { className: 'koment-time-tooltip' });
      this.el().appendChild(this.tooltip);
      this.addClass('koment-keep-tooltips-inside');
    }

    this.update(0, 0);

    player.on('ready', function () {
      _this.on(player.progressControl.el(), 'mousemove', (0, _lodashCompatFunctionThrottle2['default'])(Fn.bind(_this, _this.handleMouseMove), 25));
    });
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */

  _createClass(MouseTimeDisplay, [{
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(MouseTimeDisplay.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-mouse-display'
      });
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(event) {
      var duration = this.player_.duration();
      var newTime = this.calculateDistance(event) * duration;
      var position = event.pageX - Dom.findElPosition(this.el().parentNode).left;

      this.update(newTime, position);
    }
  }, {
    key: 'update',
    value: function update(newTime, position) {
      var time = (0, _utilsFormatTimeJs2['default'])(newTime, this.player_.duration());

      this.el().style.left = position + 'px';
      this.el().setAttribute('data-current-time', time);

      if (this.keepTooltipsInside) {
        var clampedPosition = this.clampPosition_(position);
        var difference = position - clampedPosition + 1;
        var tooltipWidth = parseFloat(_globalWindow2['default'].getComputedStyle(this.tooltip).width);
        var tooltipWidthHalf = tooltipWidth / 2;

        this.tooltip.innerHTML = time;
        this.tooltip.style.right = '-' + (tooltipWidthHalf - difference) + 'px';
      }
    }
  }, {
    key: 'calculateDistance',
    value: function calculateDistance(event) {
      return Dom.getPointerPosition(this.el().parentNode, event).x;
    }

    /**
     * This takes in a horizontal position for the bar and returns a clamped position.
     * Clamped position means that it will keep the position greater than half the width
     * of the tooltip and smaller than the player width minus half the width o the tooltip.
     * It will only clamp the position if `keepTooltipsInside` option is set.
     *
     * @param {Number} position the position the bar wants to be
     * @return {Number} newPosition the (potentially) clamped position
     * @method clampPosition_
     */
  }, {
    key: 'clampPosition_',
    value: function clampPosition_(position) {
      if (!this.keepTooltipsInside) {
        return position;
      }

      var playerWidth = parseFloat(_globalWindow2['default'].getComputedStyle(this.player().el()).width);
      var tooltipWidth = parseFloat(_globalWindow2['default'].getComputedStyle(this.tooltip).width);
      var tooltipWidthHalf = tooltipWidth / 2;
      var actualPosition = position;

      if (position < tooltipWidthHalf) {
        actualPosition = Math.ceil(tooltipWidthHalf);
      } else if (position > playerWidth - tooltipWidthHalf) {
        actualPosition = Math.floor(playerWidth - tooltipWidthHalf);
      }

      return actualPosition;
    }
  }]);

  return MouseTimeDisplay;
})(_componentJs2['default']);

_componentJs2['default'].registerComponent('MouseTimeDisplay', MouseTimeDisplay);
exports['default'] = MouseTimeDisplay;
module.exports = exports['default'];