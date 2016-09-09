/**
 * @file seek-bar.js
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

var _sliderSliderJs = require('../../slider/slider.js');

var _sliderSliderJs2 = _interopRequireDefault(_sliderSliderJs);

var _componentJs = require('../../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

var _utilsFnJs = require('../../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsFormatTimeJs = require('../../utils/format-time.js');

var _utilsFormatTimeJs2 = _interopRequireDefault(_utilsFormatTimeJs);

require('./timeline-progress-bar.js');

require('./load-progress-bar.js');

require('./play-progress-bar.js');

require('./tooltip-progress-bar.js');

/**
 * Seek Bar and holder for the progress bars
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Slider
 * @class SeekBar
 */

var SeekBar = (function (_Slider) {
  _inherits(SeekBar, _Slider);

  function SeekBar(player, options) {
    _classCallCheck(this, SeekBar);

    _get(Object.getPrototypeOf(SeekBar.prototype), 'constructor', this).call(this, player, options);
    this.on(player, 'timeupdate', this.updateProgress);
    this.on(player, 'ended', this.updateProgress);
    player.ready(Fn.bind(this, this.updateProgress));

    if (options.playerOptions && options.playerOptions.controlBar && options.playerOptions.controlBar.progressControl && options.playerOptions.controlBar.progressControl.keepTooltipsInside) {
      this.keepTooltipsInside = options.playerOptions.controlBar.progressControl.keepTooltipsInside;
    }

    if (this.keepTooltipsInside) {
      this.tooltipProgressBar = this.addChild('TooltipProgressBar');
    }
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */

  _createClass(SeekBar, [{
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(SeekBar.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-progress-holder'
      }, {
        'aria-label': 'progress bar'
      });
    }

    /**
     * Update ARIA accessibility attributes
     *
     * @method updateARIAAttributes
     */
  }, {
    key: 'updateProgress',
    value: function updateProgress() {
      this.updateAriaAttributes(this.el_);

      if (this.keepTooltipsInside) {
        this.updateAriaAttributes(this.tooltipProgressBar.el_);
        this.tooltipProgressBar.el_.style.width = this.bar.el_.style.width;

        var playerWidth = parseFloat(_globalWindow2['default'].getComputedStyle(this.player().el()).width);
        var tooltipWidth = parseFloat(_globalWindow2['default'].getComputedStyle(this.tooltipProgressBar.tooltip).width);
        var tooltipStyle = this.tooltipProgressBar.el().style;

        tooltipStyle.maxWidth = Math.floor(playerWidth - tooltipWidth / 2) + 'px';
        tooltipStyle.minWidth = Math.ceil(tooltipWidth / 2) + 'px';
        tooltipStyle.right = '-' + tooltipWidth / 2 + 'px';
      }
    }
  }, {
    key: 'updateAriaAttributes',
    value: function updateAriaAttributes(el) {
      // Allows for smooth scrubbing, when player can't keep up.
      var time = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime();

      // machine readable value of progress bar (percentage complete)
      el.setAttribute('aria-valuenow', (this.getPercent() * 100).toFixed(2));
      // human readable value of progress bar (time complete)
      el.setAttribute('aria-valuetext', (0, _utilsFormatTimeJs2['default'])(time, this.player_.duration()));
    }

    /**
     * Get percentage of video played
     *
     * @return {Number} Percentage played
     * @method getPercent
     */
  }, {
    key: 'getPercent',
    value: function getPercent() {
      var percent = this.player_.currentTime() / this.player_.duration();

      return percent >= 1 ? 1 : percent;
    }

    /**
     * Handle mouse down on seek bar
     *
     * @method handleMouseDown
     */
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(event) {
      _get(Object.getPrototypeOf(SeekBar.prototype), 'handleMouseDown', this).call(this, event);

      this.player_.scrubbing(true);

      this.videoWasPlaying = !this.player_.paused();
      this.player_.pause();
    }

    /**
     * Handle mouse move on seek bar
     *
     * @method handleMouseMove
     */
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(event) {
      var newTime = this.calculateDistance(event) * this.player_.duration();

      // Don't let video end while scrubbing.
      if (newTime === this.player_.duration()) {
        newTime = newTime - 0.1;
      }

      // Set new time (tell player to seek to new time)
      this.player_.currentTime(newTime);
    }

    /**
     * Handle mouse up on seek bar
     *
     * @method handleMouseUp
     */
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp(event) {
      _get(Object.getPrototypeOf(SeekBar.prototype), 'handleMouseUp', this).call(this, event);

      this.player_.scrubbing(false);
      if (this.videoWasPlaying) {
        this.player_.play();
      }
    }

    /**
     * Move more quickly fast forward for keyboard-only users
     *
     * @method stepForward
     */
  }, {
    key: 'stepForward',
    value: function stepForward() {
      // more quickly fast forward for keyboard-only users
      this.player_.currentTime(this.player_.currentTime() + 5);
    }

    /**
     * Move more quickly rewind for keyboard-only users
     *
     * @method stepBack
     */
  }, {
    key: 'stepBack',
    value: function stepBack() {
      // more quickly rewind for keyboard-only users
      this.player_.currentTime(this.player_.currentTime() - 5);
    }
  }]);

  return SeekBar;
})(_sliderSliderJs2['default']);

SeekBar.prototype.options_ = {
  children: [
  //'loadProgressBar',
  'timelineProgressBar',
  //'mouseTimeDisplay',
  'playProgressBar'],
  barName: 'playProgressBar'
};

SeekBar.prototype.playerEvent = 'timeupdate';

_componentJs2['default'].registerComponent('SeekBar', SeekBar);
exports['default'] = SeekBar;
module.exports = exports['default'];