/**
 * @file html5.js
 * HTML5 Media Controller - Wrapper for HTML5 Media API
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _templateObject = _taggedTemplateLiteral(['Text Tracks are being loaded from another origin but the crossorigin attribute isn\'t used.\n            This may prevent text tracks from loading.'], ['Text Tracks are being loaded from another origin but the crossorigin attribute isn\'t used.\n            This may prevent text tracks from loading.']);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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
    var _this = this;

    _classCallCheck(this, Html5);

    _get(Object.getPrototypeOf(Html5.prototype), 'constructor', this).call(this, options, ready);

    var source = options.source;
    var crossoriginTracks = false;

    // Set the source if one is provided
    // 1) Check if the source is new (if not, we want to keep the original so playback isn't interrupted)
    // 2) Check to see if the network state of the tag was failed at init, and if so, reset the source
    // anyway so the error gets fired.
    if (source && (this.el_.currentSrc !== source.src || options.tag && options.tag.initNetworkState_ === 3)) {
      this.setSource(source);
    } else {
      this.handleLateInit_(this.el_);
    }

    if (this.el_.hasChildNodes()) {

      var nodes = this.el_.childNodes;
      var nodesLength = nodes.length;
      var removeNodes = [];

      while (nodesLength--) {
        var node = nodes[nodesLength];
        var nodeName = node.nodeName.toLowerCase();

        if (nodeName === 'track') {
          if (!this.featuresNativeTextTracks) {
            // Empty video tag tracks so the built-in player doesn't use them also.
            // This may not be fast enough to stop HTML5 browsers from reading the tags
            // so we'll need to turn off any default tracks if we're manually doing
            // captions and subtitles. videoElement.textTracks
            removeNodes.push(node);
          } else {
            // store HTMLTrackElement and TextTrack to remote list
            this.remoteTextTrackEls().addTrackElement_(node);
            this.remoteTextTracks().addTrack_(node.track);
            if (!crossoriginTracks && !this.el_.hasAttribute('crossorigin') && Url.isCrossOrigin(node.src)) {
              crossoriginTracks = true;
            }
          }
        }
      }

      for (var i = 0; i < removeNodes.length; i++) {
        this.el_.removeChild(removeNodes[i]);
      }
    }

    var trackTypes = ['audio', 'video'];

    // ProxyNativeTextTracks
    trackTypes.forEach(function (type) {
      var capitalType = (0, _utilsToTitleCaseJs2['default'])(type);

      if (!_this['featuresNative' + capitalType + 'Tracks']) {
        return;
      }
      var tl = _this.el()[type + 'Tracks'];

      if (tl && tl.addEventListener) {
        tl.addEventListener('change', Fn.bind(_this, _this['handle' + capitalType + 'TrackChange_']));
        tl.addEventListener('addtrack', Fn.bind(_this, _this['handle' + capitalType + 'TrackAdd_']));
        tl.addEventListener('removetrack', Fn.bind(_this, _this['handle' + capitalType + 'TrackRemove_']));

        // Remove (native) trackts that are not used anymore
        _this.on('loadstart', _this['removeOld' + capitalType + 'Tracks_']);
      }
    });

    if (this.featuresNativeTextTracks) {
      if (crossoriginTracks) {
        _utilsLogJs2['default'].warn((0, _tsml2['default'])(_templateObject));
      }

      this.handleTextTrackChange_ = Fn.bind(this, this.handleTextTrackChange);
      this.handleTextTrackAdd_ = Fn.bind(this, this.handleTextTrackAdd);
      this.handleTextTrackRemove_ = Fn.bind(this, this.handleTextTrackRemove);
      this.proxyNativeTextTracks_();
    }

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
      var _this2 = this;

      // Un-ProxyNativeTracks
      ['audio', 'video', 'text'].forEach(function (type) {
        var capitalType = (0, _utilsToTitleCaseJs2['default'])(type);
        var tl = _this2.el_[type + 'Tracks'];

        if (tl && tl.removeEventListener) {
          tl.removeEventListener('change', _this2['handle' + capitalType + 'TrackChange_']);
          tl.removeEventListener('addtrack', _this2['handle' + capitalType + 'TrackAdd_']);
          tl.removeEventListener('removetrack', _this2['handle' + capitalType + 'TrackRemove_']);
        }

        // Stop removing old text tracks
        if (tl) {
          _this2.off('loadstart', _this2['removeOld' + capitalType + 'Tracks_']);
        }
      });

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

    // If we're loading the playback object after it has started loading
    // or playing the video (often with autoplay on) then the loadstart event
    // has already fired and we need to fire it manually because many things
    // rely on it.
  }, {
    key: 'handleLateInit_',
    value: function handleLateInit_(el) {
      var _this3 = this;

      if (el.networkState === 0 || el.networkState === 3) {
        // The video element hasn't started loading the source yet
        // or didn't find a source
        return;
      }

      if (el.readyState === 0) {
        var _ret = (function () {
          // NetworkState is set synchronously BUT loadstart is fired at the
          // end of the current stack, usually before setInterval(fn, 0).
          // So at this point we know loadstart may have already fired or is
          // about to fire, and either way the player hasn't seen it yet.
          // We don't want to fire loadstart prematurely here and cause a
          // double loadstart so we'll wait and see if it happens between now
          // and the next loop, and fire it if not.
          // HOWEVER, we also want to make sure it fires before loadedmetadata
          // which could also happen between now and the next loop, so we'll
          // watch for that also.
          var loadstartFired = false;
          var setLoadstartFired = function setLoadstartFired() {
            loadstartFired = true;
          };

          _this3.on('loadstart', setLoadstartFired);

          var triggerLoadstart = function triggerLoadstart() {
            // We did miss the original loadstart. Make sure the player
            // sees loadstart before loadedmetadata
            if (!loadstartFired) {
              this.trigger('loadstart');
            }
          };

          _this3.on('loadedmetadata', triggerLoadstart);

          _this3.ready(function () {
            this.off('loadstart', setLoadstartFired);
            this.off('loadedmetadata', triggerLoadstart);

            if (!loadstartFired) {
              // We did miss the original native loadstart. Fire it now.
              this.trigger('loadstart');
            }
          });

          return {
            v: undefined
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }

      // From here on we know that loadstart already fired and we missed it.
      // The other readyState events aren't as much of a problem if we double
      // them, so not going to go to as much trouble as loadstart to prevent
      // that unless we find reason to.
      var eventsToTrigger = ['loadstart'];

      // loadedmetadata: newly equal to HAVE_METADATA (1) or greater
      eventsToTrigger.push('loadedmetadata');

      // loadeddata: newly increased to HAVE_CURRENT_DATA (2) or greater
      if (el.readyState >= 2) {
        eventsToTrigger.push('loadeddata');
      }

      // canplay: newly increased to HAVE_FUTURE_DATA (3) or greater
      if (el.readyState >= 3) {
        eventsToTrigger.push('canplay');
      }

      // canplaythrough: newly equal to HAVE_ENOUGH_DATA (4)
      if (el.readyState >= 4) {
        eventsToTrigger.push('canplaythrough');
      }

      // We still need to give the player time to add event listeners
      this.ready(function () {
        eventsToTrigger.forEach(function (type) {
          this.trigger(type);
        }, this);
      });
    }
  }, {
    key: 'proxyNativeTextTracks_',
    value: function proxyNativeTextTracks_() {
      var tt = this.el().textTracks;

      if (tt) {
        // Add tracks - if player is initialised after DOM loaded, textTracks
        // will not trigger addtrack
        for (var i = 0; i < tt.length; i++) {
          this.textTracks().addTrack_(tt[i]);
        }

        if (tt.addEventListener) {
          tt.addEventListener('change', this.handleTextTrackChange_);
          tt.addEventListener('addtrack', this.handleTextTrackAdd_);
          tt.addEventListener('removetrack', this.handleTextTrackRemove_);
        }

        // Remove (native) texttracks that are not used anymore
        this.on('loadstart', this.removeOldTextTracks_);
      }
    }
  }, {
    key: 'handleTextTrackChange',
    value: function handleTextTrackChange(e) {
      var tt = this.textTracks();

      this.textTracks().trigger({
        type: 'change',
        target: tt,
        currentTarget: tt,
        srcElement: tt
      });
    }
  }, {
    key: 'handleTextTrackAdd',
    value: function handleTextTrackAdd(e) {
      this.textTracks().addTrack_(e.track);
    }
  }, {
    key: 'handleTextTrackRemove',
    value: function handleTextTrackRemove(e) {
      this.textTracks().removeTrack_(e.track);
    }
  }, {
    key: 'handleVideoTrackChange_',
    value: function handleVideoTrackChange_(e) {
      var vt = this.videoTracks();

      this.videoTracks().trigger({
        type: 'change',
        target: vt,
        currentTarget: vt,
        srcElement: vt
      });
    }
  }, {
    key: 'handleVideoTrackAdd_',
    value: function handleVideoTrackAdd_(e) {
      this.videoTracks().addTrack_(e.track);
    }
  }, {
    key: 'handleVideoTrackRemove_',
    value: function handleVideoTrackRemove_(e) {
      this.videoTracks().removeTrack_(e.track);
    }
  }, {
    key: 'handleAudioTrackChange_',
    value: function handleAudioTrackChange_(e) {
      var audioTrackList = this.audioTracks();

      this.audioTracks().trigger({
        type: 'change',
        target: audioTrackList,
        currentTarget: audioTrackList,
        srcElement: audioTrackList
      });
    }
  }, {
    key: 'handleAudioTrackAdd_',
    value: function handleAudioTrackAdd_(e) {
      this.audioTracks().addTrack_(e.track);
    }
  }, {
    key: 'handleAudioTrackRemove_',
    value: function handleAudioTrackRemove_(e) {
      this.audioTracks().removeTrack_(e.track);
    }

    /**
     * This is a helper function that is used in removeOldTextTracks_, removeOldAudioTracks_ and
     * removeOldVideoTracks_
     * @param {Track[]} techTracks Tracks for this tech
     * @param {Track[]} elTracks Tracks for the HTML5 video element
     * @private
     */
  }, {
    key: 'removeOldTracks_',
    value: function removeOldTracks_(techTracks, elTracks) {
      // This will loop over the techTracks and check if they are still used by the HTML5 video element
      // If not, they will be removed from the emulated list
      var removeTracks = [];

      if (!elTracks) {
        return;
      }

      for (var i = 0; i < techTracks.length; i++) {
        var techTrack = techTracks[i];
        var found = false;

        for (var j = 0; j < elTracks.length; j++) {
          if (elTracks[j] === techTrack) {
            found = true;
            break;
          }
        }

        if (!found) {
          removeTracks.push(techTrack);
        }
      }

      for (var i = 0; i < removeTracks.length; i++) {
        var _track = removeTracks[i];

        techTracks.removeTrack_(_track);
      }
    }
  }, {
    key: 'removeOldTextTracks_',
    value: function removeOldTextTracks_() {
      var techTracks = this.textTracks();
      var elTracks = this.el().textTracks;

      this.removeOldTracks_(techTracks, elTracks);
    }
  }, {
    key: 'removeOldAudioTracks_',
    value: function removeOldAudioTracks_() {
      var techTracks = this.audioTracks();
      var elTracks = this.el().audioTracks;

      this.removeOldTracks_(techTracks, elTracks);
    }
  }, {
    key: 'removeOldVideoTracks_',
    value: function removeOldVideoTracks_() {
      var techTracks = this.videoTracks();
      var elTracks = this.el().videoTracks;

      this.removeOldTracks_(techTracks, elTracks);
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

    /**
     * Creates and returns a text track object
     *
     * @param {String} kind Text track kind (subtitles, captions, descriptions
     *                                       chapters and metadata)
     * @param {String=} label Label to identify the text track
     * @param {String=} language Two letter language abbreviation
     * @return {TextTrackObject}
     * @method addTextTrack
     */
  }, {
    key: 'addTextTrack',
    value: function addTextTrack(kind, label, language) {
      if (!this.featuresNativeTextTracks) {
        return _get(Object.getPrototypeOf(Html5.prototype), 'addTextTrack', this).call(this, kind, label, language);
      }

      return this.el_.addTextTrack(kind, label, language);
    }

    /**
     * Creates a remote text track object and returns a html track element
     *
     * @param {Object} options The object should contain values for
     * kind, language, label and src (location of the WebVTT file)
     * @return {HTMLTrackElement}
     * @method addRemoteTextTrack
     */
  }, {
    key: 'addRemoteTextTrack',
    value: function addRemoteTextTrack() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!this.featuresNativeTextTracks) {
        return _get(Object.getPrototypeOf(Html5.prototype), 'addRemoteTextTrack', this).call(this, options);
      }

      var htmlTrackElement = _globalDocument2['default'].createElement('track');

      if (options.kind) {
        htmlTrackElement.kind = options.kind;
      }
      if (options.label) {
        htmlTrackElement.label = options.label;
      }
      if (options.language || options.srclang) {
        htmlTrackElement.srclang = options.language || options.srclang;
      }
      if (options['default']) {
        htmlTrackElement['default'] = options['default'];
      }
      if (options.id) {
        htmlTrackElement.id = options.id;
      }
      if (options.src) {
        htmlTrackElement.src = options.src;
      }

      this.el().appendChild(htmlTrackElement);

      // store HTMLTrackElement and TextTrack to remote list
      this.remoteTextTrackEls().addTrackElement_(htmlTrackElement);
      this.remoteTextTracks().addTrack_(htmlTrackElement.track);

      return htmlTrackElement;
    }

    /**
     * Remove remote text track from TextTrackList object
     *
     * @param {TextTrackObject} track Texttrack object to remove
     * @method removeRemoteTextTrack
     */
  }, {
    key: 'removeRemoteTextTrack',
    value: function removeRemoteTextTrack(track) {
      if (!this.featuresNativeTextTracks) {
        return _get(Object.getPrototypeOf(Html5.prototype), 'removeRemoteTextTrack', this).call(this, track);
      }

      var trackElement = this.remoteTextTrackEls().getTrackElementByTrack_(track);

      // remove HTMLTrackElement and TextTrack from remote list
      this.remoteTextTrackEls().removeTrackElement_(trackElement);
      this.remoteTextTracks().removeTrack_(track);

      var tracks = this.$$('track');

      var i = tracks.length;

      while (i--) {
        if (track === tracks[i] || track === tracks[i].track) {
          this.el().removeChild(tracks[i]);
        }
      }
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
Html5.isSupported = function () {
  // IE9 with no Media Player is a LIAR! (#984)
  try {
    Html5.TEST_VID.volume = 0.5;
  } catch (e) {
    return false;
  }

  return !!Html5.TEST_VID.canPlayType;
};

// Add Source Handler pattern functions to this tech
_techJs2['default'].withSourceHandlers(Html5);

/*
 * The default native source handler.
 * This simply passes the source to the video element. Nothing fancy.
 *
 * @param  {Object} source   The source object
 * @param  {Html5} tech  The instance of the HTML5 tech
 */
Html5.nativeSourceHandler = {};

/*
 * Check if the video element can play the given videotype
 *
 * @param  {String} type    The mimetype to check
 * @return {String}         'probably', 'maybe', or '' (empty string)
 */
Html5.nativeSourceHandler.canPlayType = function (type) {
  // IE9 on Windows 7 without MediaPlayer throws an error here
  // https://github.com/koment/video.js/issues/519
  try {
    return Html5.TEST_VID.canPlayType(type);
  } catch (e) {
    return '';
  }
};

/*
 * Check if the video element can handle the source natively
 *
 * @param  {Object} source  The source object
 * @param  {Object} options The options passed to the tech
 * @return {String}         'probably', 'maybe', or '' (empty string)
 */
Html5.nativeSourceHandler.canHandleSource = function (source, options) {

  // If a type was provided we should rely on that
  if (source.type) {
    return Html5.nativeSourceHandler.canPlayType(source.type);

    // If no type, fall back to checking 'video/[EXTENSION]'
  } else if (source.src) {
      var ext = Url.getFileExtension(source.src);

      return Html5.nativeSourceHandler.canPlayType('video/' + ext);
    }

  return '';
};

/*
 * Pass the source to the video element
 * Adaptive source handlers will have more complicated workflows before passing
 * video data to the video element
 *
 * @param  {Object} source   The source object
 * @param  {Html5}  tech     The instance of the Html5 tech
 * @param  {Object} options  The options to pass to the source
 */
Html5.nativeSourceHandler.handleSource = function (source, tech, options) {
  tech.setSrc(source.src);
};

/*
 * Clean up the source handler when disposing the player or switching sources..
 * (no cleanup is needed when supporting the format natively)
 */
Html5.nativeSourceHandler.dispose = function () {};

// Register the native source handler
Html5.registerSourceHandler(Html5.nativeSourceHandler);

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

/*
 * Check to see if native text tracks are supported by this browser/device
 *
 * @return {Boolean}
 */
Html5.supportsNativeTextTracks = function () {
  var supportsTextTracks = undefined;

  // Figure out native text track support
  // If mode is a number, we cannot change it because it'll disappear from view.
  // Browsers with numeric modes include IE10 and older (<=2013) samsung android models.
  // Firefox isn't playing nice either with modifying the mode
  // TODO: Investigate firefox: https://github.com/koment/video.js/issues/1862
  supportsTextTracks = !!Html5.TEST_VID.textTracks;
  if (supportsTextTracks && Html5.TEST_VID.textTracks.length > 0) {
    supportsTextTracks = typeof Html5.TEST_VID.textTracks[0].mode !== 'number';
  }
  if (supportsTextTracks && browser.IS_FIREFOX) {
    supportsTextTracks = false;
  }
  if (supportsTextTracks && !('onremovetrack' in Html5.TEST_VID.textTracks)) {
    supportsTextTracks = false;
  }

  return supportsTextTracks;
};

/*
 * Check to see if native video tracks are supported by this browser/device
 *
 * @return {Boolean}
 */
Html5.supportsNativeVideoTracks = function () {
  var supportsVideoTracks = !!Html5.TEST_VID.videoTracks;

  return supportsVideoTracks;
};

/*
 * Check to see if native audio tracks are supported by this browser/device
 *
 * @return {Boolean}
 */
Html5.supportsNativeAudioTracks = function () {
  var supportsAudioTracks = !!Html5.TEST_VID.audioTracks;

  return supportsAudioTracks;
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

/*
 * Sets the tech's status on native text track support
 *
 * @type {Boolean}
 */
Html5.prototype.featuresNativeTextTracks = Html5.supportsNativeTextTracks();

/**
 * Sets the tech's status on native text track support
 *
 * @type {Boolean}
 */
Html5.prototype.featuresNativeVideoTracks = Html5.supportsNativeVideoTracks();

/**
 * Sets the tech's status on native audio track support
 *
 * @type {Boolean}
 */
Html5.prototype.featuresNativeAudioTracks = Html5.supportsNativeAudioTracks();

// HTML5 Feature detection and Device Fixes --------------------------------- //
var canPlayType = undefined;
var mpegurlRE = /^application\/(?:x-|vnd\.apple\.)mpegurl/i;
var mp4RE = /^video\/mp4/i;

Html5.patchCanPlayType = function () {
  // Android 4.0 and above can play HLS to some extent but it reports being unable to do so
  if (browser.ANDROID_VERSION >= 4.0) {
    if (!canPlayType) {
      canPlayType = Html5.TEST_VID.constructor.prototype.canPlayType;
    }

    Html5.TEST_VID.constructor.prototype.canPlayType = function (type) {
      if (type && mpegurlRE.test(type)) {
        return 'maybe';
      }
      return canPlayType.call(this, type);
    };
  }

  // Override Android 2.2 and less canPlayType method which is broken
  if (browser.IS_OLD_ANDROID) {
    if (!canPlayType) {
      canPlayType = Html5.TEST_VID.constructor.prototype.canPlayType;
    }

    Html5.TEST_VID.constructor.prototype.canPlayType = function (type) {
      if (type && mp4RE.test(type)) {
        return 'maybe';
      }
      return canPlayType.call(this, type);
    };
  }
};

Html5.unpatchCanPlayType = function () {
  var r = Html5.TEST_VID.constructor.prototype.canPlayType;

  Html5.TEST_VID.constructor.prototype.canPlayType = canPlayType;
  canPlayType = null;
  return r;
};

// by default, patch the video element
Html5.patchCanPlayType();

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