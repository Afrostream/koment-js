/**
 * @file tech.js
 * Media Technology Controller - Base class for media playback
 * technology controllers like Flash and HTML5
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

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _utilsFnJs = require('../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsLogJs = require('../utils/log.js');

var _utilsLogJs2 = _interopRequireDefault(_utilsLogJs);

var _utilsTimeRangesJs = require('../utils/time-ranges.js');

var _utilsBufferJs = require('../utils/buffer.js');

var _mediaErrorJs = require('../media-error.js');

var _mediaErrorJs2 = _interopRequireDefault(_mediaErrorJs);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

/**
 * Base class for media (HTML5 Video, Flash) controllers
 *
 * @param {Object=} options Options object
 * @param {Function=} ready Ready callback function
 * @extends Component
 * @class Tech
 */

var Tech = (function (_Component) {
  _inherits(Tech, _Component);

  function Tech() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var ready = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

    _classCallCheck(this, Tech);

    // we don't want the tech to report user activity automatically.
    // This is done manually in addControlsListeners
    options.reportTouchActivity = false;
    _get(Object.getPrototypeOf(Tech.prototype), 'constructor', this).call(this, null, options, ready);

    // keep track of whether the current source has played at all to
    // implement a very limited played()
    this.hasStarted_ = false;
    this.on('playing', function () {
      this.hasStarted_ = true;
    });
    this.on('loadstart', function () {
      this.hasStarted_ = false;
    });

    // Manually track progress in cases where the browser/flash player doesn't report it.
    if (!this.featuresProgressEvents) {
      this.manualProgressOn();
    }

    // Manually track timeupdates in cases where the browser/flash player doesn't report it.
    if (!this.featuresTimeupdateEvents) {
      this.manualTimeUpdatesOn();
    }

    // Turn on component tap events
    this.emitTapEvents();
  }

  _createClass(Tech, [{
    key: 'duration',
    value: function duration() {
      return 0;
    }

    /* Fallbacks for unsupported event types
     ================================================================================ */
    // Manually trigger progress events based on changes to the buffered amount
    // Many flash players and older HTML5 browsers don't send progress or progress-like events
    /**
     * Turn on progress events
     *
     * @method manualProgressOn
     */
  }, {
    key: 'manualProgressOn',
    value: function manualProgressOn() {
      this.on('durationchange', this.onDurationChange);

      this.manualProgress = true;

      // Trigger progress watching when a source begins loading
      this.one('ready', this.trackProgress);
    }

    /**
     * Turn off progress events
     *
     * @method manualProgressOff
     */
  }, {
    key: 'manualProgressOff',
    value: function manualProgressOff() {
      this.manualProgress = false;
      this.stopTrackingProgress();

      this.off('durationchange', this.onDurationChange);
    }

    /**
     * Track progress
     *
     * @method trackProgress
     */
  }, {
    key: 'trackProgress',
    value: function trackProgress() {
      this.stopTrackingProgress();
      this.progressInterval = this.setInterval(Fn.bind(this, function () {
        // Don't trigger unless buffered amount is greater than last time

        var numBufferedPercent = this.bufferedPercent();

        if (this.bufferedPercent_ !== numBufferedPercent) {
          this.trigger('progress');
        }

        this.bufferedPercent_ = numBufferedPercent;

        if (numBufferedPercent === 1) {
          this.stopTrackingProgress();
        }
      }), 500);
    }

    /**
     * Update duration
     *
     * @method onDurationChange
     */
  }, {
    key: 'onDurationChange',
    value: function onDurationChange() {
      this.duration_ = this.duration();
    }

    /**
     * Create and get TimeRange object for buffering
     *
     * @return {TimeRangeObject}
     * @method buffered
     */
  }, {
    key: 'buffered',
    value: function buffered() {
      return (0, _utilsTimeRangesJs.createTimeRange)(0, 0);
    }

    /**
     * Get buffered percent
     *
     * @return {Number}
     * @method bufferedPercent
     */
  }, {
    key: 'bufferedPercent',
    value: function bufferedPercent() {
      return (0, _utilsBufferJs.bufferedPercent)(this.buffered(), this.duration_);
    }

    /**
     * Stops tracking progress by clearing progress interval
     *
     * @method stopTrackingProgress
     */
  }, {
    key: 'stopTrackingProgress',
    value: function stopTrackingProgress() {
      this.clearInterval(this.progressInterval);
    }

    /**
     * Set event listeners for on play and pause and tracking current time
     *
     * @method manualTimeUpdatesOn
     */
  }, {
    key: 'manualTimeUpdatesOn',
    value: function manualTimeUpdatesOn() {
      this.manualTimeUpdates = true;

      this.on('play', this.trackCurrentTime);
      this.on('pause', this.stopTrackingCurrentTime);
    }

    /**
     * Remove event listeners for on play and pause and tracking current time
     *
     * @method manualTimeUpdatesOff
     */
  }, {
    key: 'manualTimeUpdatesOff',
    value: function manualTimeUpdatesOff() {
      this.manualTimeUpdates = false;
      this.stopTrackingCurrentTime();
      this.off('play', this.trackCurrentTime);
      this.off('pause', this.stopTrackingCurrentTime);
    }

    /**
     * Tracks current time
     *
     * @method trackCurrentTime
     */
  }, {
    key: 'trackCurrentTime',
    value: function trackCurrentTime() {
      if (this.currentTimeInterval) {
        this.stopTrackingCurrentTime();
      }
      this.currentTimeInterval = this.setInterval(function () {
        this.trigger({ type: 'timeupdate', target: this, manuallyTriggered: true });

        // 42 = 24 fps // 250 is what Webkit uses // FF uses 15
      }, 250);
    }

    /**
     * Turn off play progress tracking (when paused or dragging)
     *
     * @method stopTrackingCurrentTime
     */
  }, {
    key: 'stopTrackingCurrentTime',
    value: function stopTrackingCurrentTime() {
      this.clearInterval(this.currentTimeInterval);

      // #1002 - if the video ends right before the next timeupdate would happen,
      // the progress bar won't make it all the way to the end
      this.trigger({ type: 'timeupdate', target: this, manuallyTriggered: true });
    }

    /**
     * Turn off any manual progress or timeupdate tracking
     *
     * @method dispose
     */
  }, {
    key: 'dispose',
    value: function dispose() {

      // clear out all tracks because we can't reuse them between techs
      // Turn off any manual progress or timeupdate tracking
      if (this.manualProgress) {
        this.manualProgressOff();
      }

      if (this.manualTimeUpdates) {
        this.manualTimeUpdatesOff();
      }

      _get(Object.getPrototypeOf(Tech.prototype), 'dispose', this).call(this);
    }

    /**
     * When invoked without an argument, returns a MediaError object
     * representing the current error state of the player or null if
     * there is no error. When invoked with an argument, set the current
     * error state of the player.
     * @param {MediaError=} err    Optional an error object
     * @return {MediaError}        the current error object or null
     * @method error
     */
  }, {
    key: 'error',
    value: function error(err) {
      if (err !== undefined) {
        this.error_ = new _mediaErrorJs2['default'](err);
        this.trigger('error');
      }
      return this.error_;
    }

    /**
     * Set current time
     *
     * @method setCurrentTime
     */
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime() {
      // improve the accuracy of manual timeupdates
      if (this.manualTimeUpdates) {
        this.trigger({ type: 'timeupdate', target: this, manuallyTriggered: true });
      }
    }

    /*
     * Return whether the argument is a Tech or not.
     * Can be passed either a Class like `Html5` or a instance like `player.tech_`
     *
     * @param {Object} component An item to check
     * @return {Boolean}         Whether it is a tech or not
     */
  }], [{
    key: 'isTech',
    value: function isTech(component) {
      return component.prototype instanceof Tech || component instanceof Tech || component === Tech;
    }

    /**
     * Registers a Tech
     *
     * @param {String} name Name of the Tech to register
     * @param {Object} tech The tech to register
     * @static
     * @method registerComponent
     */
  }, {
    key: 'registerTech',
    value: function registerTech(name, tech) {
      if (!Tech.techs_) {
        Tech.techs_ = {};
      }

      if (!Tech.isTech(tech)) {
        throw new Error('Tech ' + name + ' must be a Tech');
      }
      Tech.techs_[name] = tech;
      return tech;
    }

    /**
     * Gets a component by name
     *
     * @param {String} name Name of the component to get
     * @return {Component}
     * @static
     * @method getComponent
     */
  }, {
    key: 'getTech',
    value: function getTech(name) {
      if (Tech.techs_ && Tech.techs_[name]) {
        return Tech.techs_[name];
      }

      if (_globalWindow2['default'] && _globalWindow2['default'].koment && _globalWindow2['default'].koment[name]) {
        _utilsLogJs2['default'].warn('The ' + name + ' tech was added to the koment object when it should be registered using koment.registerTech(name, tech)');
        return _globalWindow2['default'].koment[name];
      }
    }

    /**
     * Gets all techs
     *
     * @param {String} name Name of the component to get
     * @return {Component}
     * @static
     * @method getTechList
     */
  }, {
    key: 'getTechList',
    value: function getTechList() {
      return Tech.techs_;
    }
  }, {
    key: 'isSupported',
    value: function isSupported(tag) {
      return false;
    }
  }]);

  return Tech;
})(_component2['default']);

Tech.prototype.featuresVolumeControl = true;

// Resizing plugins using request fullscreen reloads the plugin
Tech.prototype.featuresFullscreenResize = false;
Tech.prototype.featuresPlaybackRate = false;

// Optional events that we can manually mimic with timers
Tech.prototype.featuresProgressEvents = false;
Tech.prototype.featuresTimeupdateEvents = false;

_component2['default'].registerComponent('Tech', Tech);
Tech.registerTech('Tech', Tech);
exports['default'] = Tech;
module.exports = exports['default'];