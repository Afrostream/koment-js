/**
 * @file html5.js
 * HTML5 Media Controller - Wrapper for HTML5 Media API
 */

import Tech from './tech.js';
import Component from '../component';
import * as Dom from '../utils/dom.js';
import * as Url from '../utils/url.js';
import * as Fn from '../utils/fn.js';
import log from '../utils/log.js';
import tsml from 'tsml';
import * as browser from '../utils/browser.js';
import document from 'global/document';
import window from 'global/window';
import assign from 'object.assign';
import mergeOptions from '../utils/merge-options.js';
import toTitleCase from '../utils/to-title-case.js';

/**
 * HTML5 Media Controller - Wrapper for HTML5 Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Html5
 */
class Html5 extends Tech {

  constructor (options, ready) {
    super(options, ready);

    // Determine if native controls should be used
    // Our goal should be to get the custom controls on mobile solid everywhere
    // so we can remove this all together. Right now this will block custom
    // controls on touch enabled laptops like the Chrome Pixel
    if ((browser.TOUCH_ENABLED || browser.IS_IPHONE ||
      browser.IS_NATIVE_ANDROID) && options.nativeControlsForTouch === true) {
      this.setControls(true);
    }

    this.triggerReady();
  }

  /**
   * Dispose of html5 media element
   *
   * @method dispose
   */
  dispose () {
    Html5.disposeMediaElement(this.el_);
    // tech will handle clearing of the emulated track list
    super.dispose();
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl () {
    let el = this.options_.tag;

    // Check if this browser supports moving the element into the box.
    // On the iPhone video will break if you move the element,
    // So we have to create a brand new element.
    if (!el || this.movingMediaElementInDOM === false) {

      // If the original tag is still there, clone and remove it.
      if (el) {
        const clone = el.cloneNode(true);

        el.parentNode.insertBefore(clone, el);
        Html5.disposeMediaElement(el);
        el = clone;
      } else {
        el = document.createElement('video');

        // determine if native controls should be used
        const tagAttributes = this.options_.tag && Dom.getElAttributes(this.options_.tag);
        const attributes = mergeOptions({}, tagAttributes);

        if (!browser.TOUCH_ENABLED || this.options_.nativeControlsForTouch !== true) {
          delete attributes.controls;
        }

        Dom.setElAttributes(el,
          assign(attributes, {
            id: this.options_.techId,
            class: 'koment-tech'
          })
        );
      }
    }

    // Update specific tag settings, in case they were overridden
    const settingsAttrs = ['autoplay', 'preload', 'loop', 'muted'];

    for (let i = settingsAttrs.length - 1; i >= 0; i--) {
      const attr = settingsAttrs[i];
      const overwriteAttrs = {};

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
  play () {
    const playPromise = this.el_.play();

    // Catch/silence error when a pause interrupts a play request
    // on browsers which return a promise
    if (playPromise !== undefined && typeof playPromise.then === 'function') {
      playPromise.then(null, (e) => {
      });
    }
  }

  /**
   * Pause for html5 tech
   *
   * @method pause
   */
  pause () {
    this.el_.pause();
  }

  /**
   * Paused for html5 tech
   *
   * @return {Boolean}
   * @method paused
   */
  paused () {
    return this.el_.paused;
  }

  /**
   * Get current time
   *
   * @return {Number}
   * @method currentTime
   */
  currentTime () {
    return this.el_.currentTime;
  }

  /**
   * Set current time
   *
   * @param {Number} seconds Current time of video
   * @method setCurrentTime
   */
  setCurrentTime (seconds) {
    try {
      this.el_.currentTime = seconds;
    } catch (e) {
      log(e, 'Video is not ready. (Video.js)');
      // this.warning(koment.warnings.videoNotReady);
    }
  }

  /**
   * Get duration
   *
   * @return {Number}
   * @method duration
   */
  duration () {
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
  buffered () {
    return this.el_.buffered;
  }

  /**
   * Get volume level
   *
   * @return {Number}
   * @method volume
   */
  volume () {
    return this.el_.volume;
  }

  /**
   * Set volume level
   *
   * @param {Number} percentAsDecimal Volume percent as a decimal
   * @method setVolume
   */
  setVolume (percentAsDecimal) {
    this.el_.volume = percentAsDecimal;
  }

  /**
   * Get if muted
   *
   * @return {Boolean}
   * @method muted
   */
  muted () {
    return this.el_.muted;
  }

  /**
   * Set muted
   *
   * @param {Boolean} If player is to be muted or note
   * @method setMuted
   */
  setMuted (muted) {
    this.el_.muted = muted;
  }

  /**
   * Get player width
   *
   * @return {Number}
   * @method width
   */
  width () {
    return this.el_.offsetWidth;
  }

  /**
   * Get player height
   *
   * @return {Number}
   * @method height
   */
  height () {
    return this.el_.offsetHeight;
  }

  /**
   * Get if there is fullscreen support
   *
   * @return {Boolean}
   * @method supportsFullScreen
   */
  supportsFullScreen () {
    if (typeof this.el_.webkitEnterFullScreen === 'function') {
      const userAgent = window.navigator && window.navigator.userAgent || '';

      // Seems to be broken in Chromium/Chrome && Safari in Leopard
      if ((/Android/).test(userAgent) || !(/Chrome|Mac OS X 10.5/).test(userAgent)) {
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
  enterFullScreen () {
    const video = this.el_;

    if ('webkitDisplayingFullscreen' in video) {
      this.one('webkitbeginfullscreen', function () {
        this.one('webkitendfullscreen', function () {
          this.trigger('fullscreenchange', {isFullscreen: false});
        });

        this.trigger('fullscreenchange', {isFullscreen: true});
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
  exitFullScreen () {
    this.el_.webkitExitFullScreen();
  }

  /**
   * Get/set video
   *
   * @param {Object=} src Source object
   * @return {Object}
   * @method src
   */
  src (src) {
    if (src === undefined) {
      return this.el_.src;
    }

    // Setting src through `src` instead of `setSrc` will be deprecated
    this.setSrc(src);
  }

  /**
   * Set video
   *
   * @param {Object} src Source object
   * @deprecated
   * @method setSrc
   */
  setSrc (src) {
    this.el_.src = src;
  }

  /**
   * Load media into player
   *
   * @method load
   */
  load () {
    this.el_.load();
  }

  /**
   * Reset the tech. Removes all sources and calls `load`.
   *
   * @method reset
   */
  reset () {
    Html5.resetMediaElement(this.el_);
  }

  /**
   * Get current source
   *
   * @return {Object}
   * @method currentSrc
   */
  currentSrc () {
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
  poster () {
    return this.el_.poster;
  }

  /**
   * Set poster
   *
   * @param {String} val URL to poster image
   * @method
   */
  setPoster (val) {
    this.el_.poster = val;
  }

  /**
   * Get preload attribute
   *
   * @return {String}
   * @method preload
   */
  preload () {
    return this.el_.preload;
  }

  /**
   * Set preload attribute
   *
   * @param {String} val Value for preload attribute
   * @method setPreload
   */
  setPreload (val) {
    this.el_.preload = val;
  }

  /**
   * Get autoplay attribute
   *
   * @return {String}
   * @method autoplay
   */
  autoplay () {
    return this.el_.autoplay;
  }

  /**
   * Set autoplay attribute
   *
   * @param {String} val Value for preload attribute
   * @method setAutoplay
   */
  setAutoplay (val) {
    this.el_.autoplay = val;
  }

  /**
   * Get controls attribute
   *
   * @return {String}
   * @method controls
   */
  controls () {
    return this.el_.controls;
  }

  /**
   * Set controls attribute
   *
   * @param {String} val Value for controls attribute
   * @method setControls
   */
  setControls (val) {
    this.el_.controls = !!val;
  }

  /**
   * Get loop attribute
   *
   * @return {String}
   * @method loop
   */
  loop () {
    return this.el_.loop;
  }

  /**
   * Set loop attribute
   *
   * @param {String} val Value for loop attribute
   * @method setLoop
   */
  setLoop (val) {
    this.el_.loop = val;
  }

  /**
   * Get error value
   *
   * @return {String}
   * @method error
   */
  error () {
    return this.el_.error;
  }

  /**
   * Get whether or not the player is in the "seeking" state
   *
   * @return {Boolean}
   * @method seeking
   */
  seeking () {
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
  seekable () {
    return this.el_.seekable;
  }

  /**
   * Get if video ended
   *
   * @return {Boolean}
   * @method ended
   */
  ended () {
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
  defaultMuted () {
    return this.el_.defaultMuted;
  }

  /**
   * Get desired speed at which the media resource is to play
   *
   * @return {Number}
   * @method playbackRate
   */
  playbackRate () {
    return this.el_.playbackRate;
  }

  /**
   * Returns a TimeRanges object that represents the ranges of the
   * media resource that the user agent has played.
   * @return {TimeRangeObject} the range of points on the media
   * timeline that has been reached through normal playback
   * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-played
   */
  played () {
    return this.el_.played;
  }

  /**
   * Set desired speed at which the media resource is to play
   *
   * @param {Number} val Speed at which the media resource is to play
   * @method setPlaybackRate
   */
  setPlaybackRate (val) {
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
  networkState () {
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
  readyState () {
    return this.el_.readyState;
  }

  /**
   * Get width of video
   *
   * @return {Number}
   * @method videoWidth
   */
  videoWidth () {
    return this.el_.videoWidth;
  }

  /**
   * Get height of video
   *
   * @return {Number}
   * @method videoHeight
   */
  videoHeight () {
    return this.el_.videoHeight;
  }

  /**
   * Get text tracks
   *
   * @return {TextTrackList}
   * @method textTracks
   */
  textTracks () {
    return super.textTracks();
  }

}

/* HTML5 Support Testing ---------------------------------------------------- */

/*
 * Element for testing browser HTML5 video capabilities
 *
 * @type {Element}
 * @constant
 * @private
 */
Html5.TEST_VID = document.createElement('video');
const track = document.createElement('track');

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
    const volume = Html5.TEST_VID.volume;

    Html5.TEST_VID.volume = (volume / 2) + 0.1;
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
    const playbackRate = Html5.TEST_VID.playbackRate;

    Html5.TEST_VID.playbackRate = (playbackRate / 2) + 0.1;
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
Html5.Events = [
  'loadstart',
  'suspend',
  'abort',
  'error',
  'emptied',
  'stalled',
  'loadedmetadata',
  'loadeddata',
  'canplay',
  'canplaythrough',
  'playing',
  'waiting',
  'seeking',
  'seeked',
  'ended',
  'durationchange',
  'timeupdate',
  'progress',
  'play',
  'pause',
  'ratechange',
  'volumechange'
];

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
    }());
  }
};

Html5.resetMediaElement = function (el) {
  if (!el) {
    return;
  }

  const sources = el.querySelectorAll('source');
  let i = sources.length;

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
    }());
  }
};

Component.registerComponent('Html5', Html5);
Tech.registerTech('Html5', Html5);
export default Html5;
