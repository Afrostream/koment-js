/**
 * @file html5.js
 * HTML5 Media Controller - Wrapper for HTML5 Media API
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

var _techJs = require('./tech.js');

var _techJs2 = _interopRequireDefault(_techJs);

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _utilsDomJs = require('../utils/dom.js');

var Dom = _interopRequireWildcard(_utilsDomJs);

var _utilsUrlJs = require('../utils/url.js');

var Url = _interopRequireWildcard(_utilsUrlJs);

var _utilsFnJs = require('../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsLogJs = require('../utils/log.js');

var _utilsLogJs2 = _interopRequireDefault(_utilsLogJs);

var _tsml = require('tsml');

var _tsml2 = _interopRequireDefault(_tsml);

var _utilsBrowserJs = require('../utils/browser.js');

var browser = _interopRequireWildcard(_utilsBrowserJs);

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _objectAssign = require('object.assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _utilsMergeOptionsJs = require('../utils/merge-options.js');

var _utilsMergeOptionsJs2 = _interopRequireDefault(_utilsMergeOptionsJs);

var _utilsToTitleCaseJs = require('../utils/to-title-case.js');

var _utilsToTitleCaseJs2 = _interopRequireDefault(_utilsToTitleCaseJs);

/**
 * HTML5 Media Controller - Wrapper for HTML5 Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Html5
 */

var Html5 = (function (_Tech) {
  _inherits(Html5, _Tech);

  function Html5(options, ready) {
    _classCallCheck(this, Html5);

    _get(Object.getPrototypeOf(Html5.prototype), 'constructor', this).call(this, options, ready);

    // Determine if native controls should be used
    // Our goal should be to get the custom controls on mobile solid everywhere
    // so we can remove this all together. Right now this will block custom
    // controls on touch enabled laptops like the Chrome Pixel
    if ((browser.TOUCH_ENABLED || browser.IS_IPHONE || browser.IS_NATIVE_ANDROID) && options.nativeControlsForTouch === true) {
      this.setControls(true);
    }

    this.triggerReady();
  }

  /* HTML5 Support Testing ---------------------------------------------------- */

  /*
   * Element for testing browser HTML5 video capabilities
   *
   * @type {Element}
   * @constant
   * @private
   */

  /**
   * Dispose of html5 media element
   *
   * @method dispose
   */

  _createClass(Html5, [{
    key: 'dispose',
    value: function dispose() {
      Html5.disposeMediaElement(this.el_);
      // tech will handle clearing of the emulated track list
      _get(Object.getPrototypeOf(Html5.prototype), 'dispose', this).call(this);
    }

    /**
     * Create the component's DOM element
     *
     * @return {Element}
     * @method createEl
     */
  }, {
    key: 'createEl',
    value: function createEl() {
      var el = this.options_.tag;

      // Check if this browser supports moving the element into the box.
      // On the iPhone video will break if you move the element,
      // So we have to create a brand new element.
      if (!el || this.movingMediaElementInDOM === false) {

        // If the original tag is still there, clone and remove it.
        if (el) {
          var clone = el.cloneNode(true);

          el.parentNode.insertBefore(clone, el);
          Html5.disposeMediaElement(el);
          el = clone;
        } else {
          el = _globalDocument2['default'].createElement('video');

          // determine if native controls should be used
          var tagAttributes = this.options_.tag && Dom.getElAttributes(this.options_.tag);
          var attributes = (0, _utilsMergeOptionsJs2['default'])({}, tagAttributes);

          if (!browser.TOUCH_ENABLED || this.options_.nativeControlsForTouch !== true) {
            delete attributes.controls;
          }

          Dom.setElAttributes(el, (0, _objectAssign2['default'])(attributes, {
            id: this.options_.techId,
            'class': 'koment-tech'
          }));
        }
      }

      // Update specific tag settings, in case they were overridden
      var settingsAttrs = ['autoplay', 'preload', 'loop', 'muted'];

      for (var i = settingsAttrs.length - 1; i >= 0; i--) {
        var attr = settingsAttrs[i];
        var overwriteAttrs = {};

        if (typeof this.options_[attr] !== 'undefined') {
          overwriteAttrs[attr] = this.options_[attr];
        }
        Dom.setElAttributes(el, overwriteAttrs);
      }

      return el;
      // jenniisawesome = true;
    }

    /**
     * Play for html5 tech
     *
     * @method play
     */
  }, {
    key: 'play',
    value: function play() {
      var playPromise = this.el_.play();

      // Catch/silence error when a pause interrupts a play request
      // on browsers which return a promise
      if (playPromise !== undefined && typeof playPromise.then === 'function') {
        playPromise.then(null, function (e) {});
      }
    }

    /**
     * Pause for html5 tech
     *
     * @method pause
     */
  }, {
    key: 'pause',
    value: function pause() {
      this.el_.pause();
    }

    /**
     * Paused for html5 tech
     *
     * @return {Boolean}
     * @method paused
     */
  }, {
    key: 'paused',
    value: function paused() {
      return this.el_.paused;
    }

    /**
     * Get current time
     *
     * @return {Number}
     * @method currentTime
     */
  }, {
    key: 'currentTime',
    value: function currentTime() {
      return this.el_.currentTime;
    }

    /**
     * Set current time
     *
     * @param {Number} seconds Current time of video
     * @method setCurrentTime
     */
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime(seconds) {
      try {
        this.el_.currentTime = seconds;
      } catch (e) {
        (0, _utilsLogJs2['default'])(e, 'Video is not ready. (Video.js)');
        // this.warning(koment.warnings.videoNotReady);
      }
    }

    /**
     * Get duration
     *
     * @return {Number}
     * @method duration
     */
  }, {
    key: 'duration',
    value: function duration() {
      return this.el_.duration || 0;
    }

    /**
     * Get a TimeRange object that represents the intersection
     * of the time ranges for which the user agent has all
     * relevant media
     *
     * @return {TimeRangeObject}
     * @method buffered
     */
  }, {
    key: 'buffered',
    value: function buffered() {
      return this.el_.buffered;
    }

    /**
     * Get volume level
     *
     * @return {Number}
     * @method volume
     */
  }, {
    key: 'volume',
    value: function volume() {
      return this.el_.volume;
    }

    /**
     * Set volume level
     *
     * @param {Number} percentAsDecimal Volume percent as a decimal
     * @method setVolume
     */
  }, {
    key: 'setVolume',
    value: function setVolume(percentAsDecimal) {
      this.el_.volume = percentAsDecimal;
    }

    /**
     * Get if muted
     *
     * @return {Boolean}
     * @method muted
     */
  }, {
    key: 'muted',
    value: function muted() {
      return this.el_.muted;
    }

    /**
     * Set muted
     *
     * @param {Boolean} If player is to be muted or note
     * @method setMuted
     */
  }, {
    key: 'setMuted',
    value: function setMuted(muted) {
      this.el_.muted = muted;
    }

    /**
     * Get player width
     *
     * @return {Number}
     * @method width
     */
  }, {
    key: 'width',
    value: function width() {
      return this.el_.offsetWidth;
    }

    /**
     * Get player height
     *
     * @return {Number}
     * @method height
     */
  }, {
    key: 'height',
    value: function height() {
      return this.el_.offsetHeight;
    }

    /**
     * Get if there is fullscreen support
     *
     * @return {Boolean}
     * @method supportsFullScreen
     */
  }, {
    key: 'supportsFullScreen',
    value: function supportsFullScreen() {
      if (typeof this.el_.webkitEnterFullScreen === 'function') {
        var userAgent = _globalWindow2['default'].navigator && _globalWindow2['default'].navigator.userAgent || '';

        // Seems to be broken in Chromium/Chrome && Safari in Leopard
        if (/Android/.test(userAgent) || !/Chrome|Mac OS X 10.5/.test(userAgent)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Request to enter fullscreen
     *
     * @method enterFullScreen
     */
  }, {
    key: 'enterFullScreen',
    value: function enterFullScreen() {
      var video = this.el_;

      if ('webkitDisplayingFullscreen' in video) {
        this.one('webkitbeginfullscreen', function () {
          this.one('webkitendfullscreen', function () {
            this.trigger('fullscreenchange', { isFullscreen: false });
          });

          this.trigger('fullscreenchange', { isFullscreen: true });
        });
      }

      if (video.paused && video.networkState <= video.HAVE_METADATA) {
        // attempt to prime the video element for programmatic access
        // this isn't necessary on the desktop but shouldn't hurt
        this.el_.play();

        // playing and pausing synchronously during the transition to fullscreen
        // can get iOS ~6.1 devices into a play/pause loop
        this.setTimeout(function () {
          video.pause();
          video.webkitEnterFullScreen();
        }, 0);
      } else {
        video.webkitEnterFullScreen();
      }
    }

    /**
     * Request to exit fullscreen
     *
     * @method exitFullScreen
     */
  }, {
    key: 'exitFullScreen',
    value: function exitFullScreen() {
      this.el_.webkitExitFullScreen();
    }

    /**
     * Get/set video
     *
     * @param {Object=} src Source object
     * @return {Object}
     * @method src
     */
  }, {
    key: 'src',
    value: function src(_src) {
      if (_src === undefined) {
        return this.el_.src;
      }

      // Setting src through `src` instead of `setSrc` will be deprecated
      this.setSrc(_src);
    }

    /**
     * Set video
     *
     * @param {Object} src Source object
     * @deprecated
     * @method setSrc
     */
  }, {
    key: 'setSrc',
    value: function setSrc(src) {
      this.el_.src = src;
    }

    /**
     * Load media into player
     *
     * @method load
     */
  }, {
    key: 'load',
    value: function load() {
      this.el_.load();
    }

    /**
     * Reset the tech. Removes all sources and calls `load`.
     *
     * @method reset
     */
  }, {
    key: 'reset',
    value: function reset() {
      Html5.resetMediaElement(this.el_);
    }

    /**
     * Get current source
     *
     * @return {Object}
     * @method currentSrc
     */
  }, {
    key: 'currentSrc',
    value: function currentSrc() {
      if (this.currentSource_) {
        return this.currentSource_.src;
      }
      return this.el_.currentSrc;
    }

    /**
     * Get poster
     *
     * @return {String}
     * @method poster
     */
  }, {
    key: 'poster',
    value: function poster() {
      return this.el_.poster;
    }

    /**
     * Set poster
     *
     * @param {String} val URL to poster image
     * @method
     */
  }, {
    key: 'setPoster',
    value: function setPoster(val) {
      this.el_.poster = val;
    }

    /**
     * Get preload attribute
     *
     * @return {String}
     * @method preload
     */
  }, {
    key: 'preload',
    value: function preload() {
      return this.el_.preload;
    }

    /**
     * Set preload attribute
     *
     * @param {String} val Value for preload attribute
     * @method setPreload
     */
  }, {
    key: 'setPreload',
    value: function setPreload(val) {
      this.el_.preload = val;
    }

    /**
     * Get autoplay attribute
     *
     * @return {String}
     * @method autoplay
     */
  }, {
    key: 'autoplay',
    value: function autoplay() {
      return this.el_.autoplay;
    }

    /**
     * Set autoplay attribute
     *
     * @param {String} val Value for preload attribute
     * @method setAutoplay
     */
  }, {
    key: 'setAutoplay',
    value: function setAutoplay(val) {
      this.el_.autoplay = val;
    }

    /**
     * Get controls attribute
     *
     * @return {String}
     * @method controls
     */
  }, {
    key: 'controls',
    value: function controls() {
      return this.el_.controls;
    }

    /**
     * Set controls attribute
     *
     * @param {String} val Value for controls attribute
     * @method setControls
     */
  }, {
    key: 'setControls',
    value: function setControls(val) {
      this.el_.controls = !!val;
    }

    /**
     * Get loop attribute
     *
     * @return {String}
     * @method loop
     */
  }, {
    key: 'loop',
    value: function loop() {
      return this.el_.loop;
    }

    /**
     * Set loop attribute
     *
     * @param {String} val Value for loop attribute
     * @method setLoop
     */
  }, {
    key: 'setLoop',
    value: function setLoop(val) {
      this.el_.loop = val;
    }

    /**
     * Get error value
     *
     * @return {String}
     * @method error
     */
  }, {
    key: 'error',
    value: function error() {
      return this.el_.error;
    }

    /**
     * Get whether or not the player is in the "seeking" state
     *
     * @return {Boolean}
     * @method seeking
     */
  }, {
    key: 'seeking',
    value: function seeking() {
      return this.el_.seeking;
    }

    /**
     * Get a TimeRanges object that represents the
     * ranges of the media resource to which it is possible
     * for the user agent to seek.
     *
     * @return {TimeRangeObject}
     * @method seekable
     */
  }, {
    key: 'seekable',
    value: function seekable() {
      return this.el_.seekable;
    }

    /**
     * Get if video ended
     *
     * @return {Boolean}
     * @method ended
     */
  }, {
    key: 'ended',
    value: function ended() {
      return this.el_.ended;
    }

    /**
     * Get the value of the muted content attribute
     * This attribute has no dynamic effect, it only
     * controls the default state of the element
     *
     * @return {Boolean}
     * @method defaultMuted
     */
  }, {
    key: 'defaultMuted',
    value: function defaultMuted() {
      return this.el_.defaultMuted;
    }

    /**
     * Get desired speed at which the media resource is to play
     *
     * @return {Number}
     * @method playbackRate
     */
  }, {
    key: 'playbackRate',
    value: function playbackRate() {
      return this.el_.playbackRate;
    }

    /**
     * Returns a TimeRanges object that represents the ranges of the
     * media resource that the user agent has played.
     * @return {TimeRangeObject} the range of points on the media
     * timeline that has been reached through normal playback
     * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-played
     */
  }, {
    key: 'played',
    value: function played() {
      return this.el_.played;
    }

    /**
     * Set desired speed at which the media resource is to play
     *
     * @param {Number} val Speed at which the media resource is to play
     * @method setPlaybackRate
     */
  }, {
    key: 'setPlaybackRate',
    value: function setPlaybackRate(val) {
      this.el_.playbackRate = val;
    }

    /**
     * Get the current state of network activity for the element, from
     * the list below
     * NETWORK_EMPTY (numeric value 0)
     * NETWORK_IDLE (numeric value 1)
     * NETWORK_LOADING (numeric value 2)
     * NETWORK_NO_SOURCE (numeric value 3)
     *
     * @return {Number}
     * @method networkState
     */
  }, {
    key: 'networkState',
    value: function networkState() {
      return this.el_.networkState;
    }

    /**
     * Get a value that expresses the current state of the element
     * with respect to rendering the current playback position, from
     * the codes in the list below
     * HAVE_NOTHING (numeric value 0)
     * HAVE_METADATA (numeric value 1)
     * HAVE_CURRENT_DATA (numeric value 2)
     * HAVE_FUTURE_DATA (numeric value 3)
     * HAVE_ENOUGH_DATA (numeric value 4)
     *
     * @return {Number}
     * @method readyState
     */
  }, {
    key: 'readyState',
    value: function readyState() {
      return this.el_.readyState;
    }

    /**
     * Get width of video
     *
     * @return {Number}
     * @method videoWidth
     */
  }, {
    key: 'videoWidth',
    value: function videoWidth() {
      return this.el_.videoWidth;
    }

    /**
     * Get height of video
     *
     * @return {Number}
     * @method videoHeight
     */
  }, {
    key: 'videoHeight',
    value: function videoHeight() {
      return this.el_.videoHeight;
    }

    /**
     * Get text tracks
     *
     * @return {TextTrackList}
     * @method textTracks
     */
  }, {
    key: 'textTracks',
    value: function textTracks() {
      return _get(Object.getPrototypeOf(Html5.prototype), 'textTracks', this).call(this);
    }
  }]);

  return Html5;
})(_techJs2['default']);

Html5.TEST_VID = _globalDocument2['default'].createElement('video');
var track = _globalDocument2['default'].createElement('track');

track.kind = 'captions';
track.srclang = 'en';
track.label = 'English';
Html5.TEST_VID.appendChild(track);

/*
 * Check if HTML5 video is supported by this browser/device
 *
 * @return {Boolean}
 */
Html5.isSupported = function (tag) {
  return tag && tag.tagName && tag.tagName === 'VIDEO';
};

/*
 * Check if the volume can be changed in this browser/device.
 * Volume cannot be changed in a lot of mobile devices.
 * Specifically, it can't be changed from 1 on iOS.
 *
 * @return {Boolean}
 */
Html5.canControlVolume = function () {
  // IE will error if Windows Media Player not installed #3315
  try {
    var volume = Html5.TEST_VID.volume;

    Html5.TEST_VID.volume = volume / 2 + 0.1;
    return volume !== Html5.TEST_VID.volume;
  } catch (e) {
    return false;
  }
};

/*
 * Check if playbackRate is supported in this browser/device.
 *
 * @return {Boolean}
 */
Html5.canControlPlaybackRate = function () {
  // Playback rate API is implemented in Android Chrome, but doesn't do anything
  // https://github.com/koment/video.js/issues/3180
  if (browser.IS_ANDROID && browser.IS_CHROME) {
    return false;
  }
  // IE will error if Windows Media Player not installed #3315
  try {
    var playbackRate = Html5.TEST_VID.playbackRate;

    Html5.TEST_VID.playbackRate = playbackRate / 2 + 0.1;
    return playbackRate !== Html5.TEST_VID.playbackRate;
  } catch (e) {
    return false;
  }
};

/**
 * An array of events available on the Html5 tech.
 *
 * @private
 * @type {Array}
 */
Html5.Events = ['loadstart', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing', 'waiting', 'seeking', 'seeked', 'ended', 'durationchange', 'timeupdate', 'progress', 'play', 'pause', 'ratechange', 'volumechange'];

/*
 * Set the tech's volume control support status
 *
 * @type {Boolean}
 */
Html5.prototype.featuresVolumeControl = Html5.canControlVolume();

/*
 * Set the tech's playbackRate support status
 *
 * @type {Boolean}
 */
Html5.prototype.featuresPlaybackRate = Html5.canControlPlaybackRate();

/*
 * Set the tech's status on moving the video element.
 * In iOS, if you move a video element in the DOM, it breaks video playback.
 *
 * @type {Boolean}
 */
Html5.prototype.movingMediaElementInDOM = !browser.IS_IOS;

/*
 * Set the the tech's fullscreen resize support status.
 * HTML video is able to automatically resize when going to fullscreen.
 * (No longer appears to be used. Can probably be removed.)
 */
Html5.prototype.featuresFullscreenResize = true;

/*
 * Set the tech's progress event support status
 * (this disables the manual progress events of the Tech)
 */
Html5.prototype.featuresProgressEvents = true;

Html5.disposeMediaElement = function (el) {
  if (!el) {
    return;
  }

  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }

  // remove any child track or source nodes to prevent their loading
  while (el.hasChildNodes()) {
    el.removeChild(el.firstChild);
  }

  // remove any src reference. not setting `src=''` because that causes a warning
  // in firefox
  el.removeAttribute('src');

  // force the media element to update its loading state by calling load()
  // however IE on Windows 7N has a bug that throws an error so need a try/catch (#793)
  if (typeof el.load === 'function') {
    // wrapping in an iife so it's not deoptimized (#1060#discussion_r10324473)
    (function () {
      try {
        el.load();
      } catch (e) {
        // not supported
      }
    })();
  }
};

Html5.resetMediaElement = function (el) {
  if (!el) {
    return;
  }

  var sources = el.querySelectorAll('source');
  var i = sources.length;

  while (i--) {
    el.removeChild(sources[i]);
  }

  // remove any src reference.
  // not setting `src=''` because that throws an error
  el.removeAttribute('src');

  if (typeof el.load === 'function') {
    // wrapping in an iife so it's not deoptimized (#1060#discussion_r10324473)
    (function () {
      try {
        el.load();
      } catch (e) {
        // satisfy linter
      }
    })();
  }
};

_component2['default'].registerComponent('Html5', Html5);
_techJs2['default'].registerTech('Html5', Html5);
exports['default'] = Html5;
module.exports = exports['default'];