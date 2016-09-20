/**
 * @file tech.js
 * Media Technology Controller - Base class for media playback
 * technology controllers like Flash and HTML5
 */

import Component from '../component';
import * as Fn from '../utils/fn.js';
import log from '../utils/log.js';
import { createTimeRange } from '../utils/time-ranges.js';
import { bufferedPercent } from '../utils/buffer.js';
import MediaError from '../media-error.js';
import window from 'global/window';

/**
 * Base class for media (HTML5 Video, Flash) controllers
 *
 * @param {Object=} options Options object
 * @param {Function=} ready Ready callback function
 * @extends Component
 * @class Tech
 */
class Tech extends Component {

  constructor (options = {}, ready = function () {
  }) {
    // we don't want the tech to report user activity automatically.
    // This is done manually in addControlsListeners
    options.reportTouchActivity = false;
    super(null, options, ready);

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

  duration () {
    return 0
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
  manualProgressOn () {
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
  manualProgressOff () {
    this.manualProgress = false;
    this.stopTrackingProgress();

    this.off('durationchange', this.onDurationChange);
  }

  /**
   * Track progress
   *
   * @method trackProgress
   */
  trackProgress () {
    this.stopTrackingProgress();
    this.progressInterval = this.setInterval(Fn.bind(this, function () {
      // Don't trigger unless buffered amount is greater than last time

      const numBufferedPercent = this.bufferedPercent();

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
  onDurationChange () {
    this.duration_ = this.duration();
  }

  /**
   * Create and get TimeRange object for buffering
   *
   * @return {TimeRangeObject}
   * @method buffered
   */
  buffered () {
    return createTimeRange(0, 0);
  }

  /**
   * Get buffered percent
   *
   * @return {Number}
   * @method bufferedPercent
   */
  bufferedPercent () {
    return bufferedPercent(this.buffered(), this.duration_);
  }

  /**
   * Stops tracking progress by clearing progress interval
   *
   * @method stopTrackingProgress
   */
  stopTrackingProgress () {
    this.clearInterval(this.progressInterval);
  }

  /**
   * Set event listeners for on play and pause and tracking current time
   *
   * @method manualTimeUpdatesOn
   */
  manualTimeUpdatesOn () {
    this.manualTimeUpdates = true;

    this.on('play', this.trackCurrentTime);
    this.on('pause', this.stopTrackingCurrentTime);
  }

  /**
   * Remove event listeners for on play and pause and tracking current time
   *
   * @method manualTimeUpdatesOff
   */
  manualTimeUpdatesOff () {
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
  trackCurrentTime () {
    if (this.currentTimeInterval) {
      this.stopTrackingCurrentTime();
    }
    this.currentTimeInterval = this.setInterval(function () {
      this.trigger({type: 'timeupdate', target: this, manuallyTriggered: true});

      // 42 = 24 fps // 250 is what Webkit uses // FF uses 15
    }, 250);
  }

  /**
   * Turn off play progress tracking (when paused or dragging)
   *
   * @method stopTrackingCurrentTime
   */
  stopTrackingCurrentTime () {
    this.clearInterval(this.currentTimeInterval);

    // #1002 - if the video ends right before the next timeupdate would happen,
    // the progress bar won't make it all the way to the end
    this.trigger({type: 'timeupdate', target: this, manuallyTriggered: true});
  }

  /**
   * Turn off any manual progress or timeupdate tracking
   *
   * @method dispose
   */
  dispose () {

    // clear out all tracks because we can't reuse them between techs
    // Turn off any manual progress or timeupdate tracking
    if (this.manualProgress) {
      this.manualProgressOff();
    }

    if (this.manualTimeUpdates) {
      this.manualTimeUpdatesOff();
    }

    super.dispose();
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
  error (err) {
    if (err !== undefined) {
      this.error_ = new MediaError(err);
      this.trigger('error');
    }
    return this.error_;
  }

  /**
   * Set current time
   *
   * @method setCurrentTime
   */
  setCurrentTime () {
    // improve the accuracy of manual timeupdates
    if (this.manualTimeUpdates) {
      this.trigger({type: 'timeupdate', target: this, manuallyTriggered: true});
    }
  }

  /*
   * Return whether the argument is a Tech or not.
   * Can be passed either a Class like `Html5` or a instance like `player.tech_`
   *
   * @param {Object} component An item to check
   * @return {Boolean}         Whether it is a tech or not
   */
  static isTech (component) {
    return component.prototype instanceof Tech ||
      component instanceof Tech ||
      component === Tech;
  }

  /**
   * Registers a Tech
   *
   * @param {String} name Name of the Tech to register
   * @param {Object} tech The tech to register
   * @static
   * @method registerComponent
   */
  static registerTech (name, tech) {
    if (!Tech.techs_) {
      Tech.techs_ = {};
    }

    if (!Tech.isTech(tech)) {
      throw new Error(`Tech ${name} must be a Tech`);
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
  static getTech (name) {
    if (Tech.techs_ && Tech.techs_[name]) {
      return Tech.techs_[name];
    }

    if (window && window.koment && window.koment[name]) {
      log.warn(`The ${name} tech was added to the koment object when it should be registered using koment.registerTech(name, tech)`);
      return window.koment[name];
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
  static getTechList () {
    return Tech.techs_;
  }

  static isSupported (tag) {
    return false;
  }
}

Tech.prototype.featuresVolumeControl = true;

// Resizing plugins using request fullscreen reloads the plugin
Tech.prototype.featuresFullscreenResize = false;
Tech.prototype.featuresPlaybackRate = false;

// Optional events that we can manually mimic with timers
Tech.prototype.featuresProgressEvents = false;
Tech.prototype.featuresTimeupdateEvents = false;

Component.registerComponent('Tech', Tech);
Tech.registerTech('Tech', Tech);
export default Tech;
