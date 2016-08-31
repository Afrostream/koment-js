/**
 * @file Youtube.js
 * Youtube Media Controller - Wrapper for Youtube Media API
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

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _utilsFnJs = require('../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

/**
 * Youtube Media Controller - Wrapper for Youtube Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Youtube
 */

var Youtube = (function (_Tech) {
  _inherits(Youtube, _Tech);

  function Youtube(options, ready) {
    _classCallCheck(this, Youtube);

    _get(Object.getPrototypeOf(Youtube.prototype), 'constructor', this).call(this, options, ready);
    if (Youtube.isApiReady) {
      this.initYTPlayer();
    } else {
      Youtube.apiReadyQueue.push(this);
    }
  }

  _createClass(Youtube, [{
    key: 'initYTPlayer',
    value: function initYTPlayer() {
      var playerVars = {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        loop: this.options_.loop ? 1 : 0
      };

      // Let the user set any YouTube parameter
      // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters
      // To use YouTube controls, you must use ytControls instead
      // To use the loop or autoplay, use the video.js settings

      if (typeof this.options_.autohide !== 'undefined') {
        playerVars.autohide = this.options_.autohide;
      }

      if (typeof this.options_['cc_load_policy'] !== 'undefined') {
        playerVars['cc_load_policy'] = this.options_['cc_load_policy'];
      }

      if (typeof this.options_.ytControls !== 'undefined') {
        playerVars.controls = this.options_.ytControls;
      }

      if (typeof this.options_.disablekb !== 'undefined') {
        playerVars.disablekb = this.options_.disablekb;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.color !== 'undefined') {
        playerVars.color = this.options_.color;
      }

      if (!playerVars.controls) {
        // Let video.js handle the fullscreen unless it is the YouTube native controls
        playerVars.fs = 0;
      } else if (typeof this.options_.fs !== 'undefined') {
        playerVars.fs = this.options_.fs;
      }

      if (typeof this.options_.end !== 'undefined') {
        playerVars.end = this.options_.end;
      }

      if (typeof this.options_.hl !== 'undefined') {
        playerVars.hl = this.options_.hl;
      } else if (typeof this.options_.language !== 'undefined') {
        // Set the YouTube player on the same language than video.js
        playerVars.hl = this.options_.language.substr(0, 2);
      }

      if (typeof this.options_['iv_load_policy'] !== 'undefined') {
        playerVars['iv_load_policy'] = this.options_['iv_load_policy'];
      }

      if (typeof this.options_.list !== 'undefined') {
        playerVars.list = this.options_.list;
      } else if (this.url && typeof this.url.listId !== 'undefined') {
        playerVars.list = this.url.listId;
      }

      if (typeof this.options_.listType !== 'undefined') {
        playerVars.listType = this.options_.listType;
      }

      if (typeof this.options_.modestbranding !== 'undefined') {
        playerVars.modestbranding = this.options_.modestbranding;
      }

      if (typeof this.options_.playlist !== 'undefined') {
        playerVars.playlist = this.options_.playlist;
      }

      if (typeof this.options_.playsinline !== 'undefined') {
        playerVars.playsinline = this.options_.playsinline;
      }

      if (typeof this.options_.rel !== 'undefined') {
        playerVars.rel = this.options_.rel;
      }

      if (typeof this.options_.showinfo !== 'undefined') {
        playerVars.showinfo = this.options_.showinfo;
      }

      if (typeof this.options_.start !== 'undefined') {
        playerVars.start = this.options_.start;
      }

      if (typeof this.options_.theme !== 'undefined') {
        playerVars.theme = this.options_.theme;
      }

      this.activeVideoId = this.url ? this.url.videoId : null;
      this.activeList = playerVars.list;

      this.ytPlayer = new YT.Player(this.options_.tag.id, {
        videoId: this.activeVideoId,
        playerVars: playerVars,
        events: {
          onReady: Fn.bind(this, this.onPlayerReady),
          onPlaybackQualityChange: Fn.bind(this, this.onPlayerPlaybackQualityChange),
          onStateChange: Fn.bind(this, this.onPlayerStateChange),
          onError: Fn.bind(this, this.onPlayerError)
        }
      });
    }
  }, {
    key: 'currentTime',
    value: function currentTime() {
      return this.ytPlayer ? this.ytPlayer.getCurrentTime() : 0;
    }
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime(seconds) {
      if (this.lastState === YT.PlayerState.PAUSED) {
        this.timeBeforeSeek = this.currentTime();
      }

      if (!this.isSeeking) {
        this.wasPausedBeforeSeek = this.paused();
      }

      this.ytPlayer.seekTo(seconds, true);
      this.trigger('timeupdate');
      this.trigger('seeking');
      this.isSeeking = true;

      // A seek event during pause does not return an event to trigger a seeked event,
      // so run an interval timer to look for the currentTime to change
      if (this.lastState === YT.PlayerState.PAUSED && this.timeBeforeSeek !== seconds) {
        clearInterval(this.checkSeekedInPauseInterval);
        this.checkSeekedInPauseInterval = setInterval((function () {
          if (this.lastState !== YT.PlayerState.PAUSED || !this.isSeeking) {
            // If something changed while we were waiting for the currentTime to change,
            //  clear the interval timer
            clearInterval(this.checkSeekedInPauseInterval);
          } else if (this.currentTime() !== this.timeBeforeSeek) {
            this.trigger('timeupdate');
            this.onSeeked();
          }
        }).bind(this), 250);
      }
    }
  }, {
    key: 'onPlayerReady',
    value: function onPlayerReady() {
      this.triggerReady();
    }
  }, {
    key: 'onPlayerPlaybackQualityChange',
    value: function onPlayerPlaybackQualityChange() {}
  }, {
    key: 'onPlayerStateChange',
    value: function onPlayerStateChange(e) {
      var state = e.data;

      if (state === this.lastState || this.errorNumber) {
        return;
      }

      this.lastState = state;
      switch (state) {
        case -1:
          this.trigger('loadstart');
          this.trigger('loadedmetadata');
          this.trigger('durationchange');
          break;

        case YT.PlayerState.ENDED:
          this.trigger('ended');
          break;

        case YT.PlayerState.PLAYING:
          this.trigger('timeupdate');
          this.trigger('durationchange');
          this.trigger('playing');
          this.trigger('play');
          if (this.isSeeking) {
            this.onSeeked();
          }
          break;

        case YT.PlayerState.PAUSED:
          this.trigger('canplay');
          if (this.isSeeking) {
            this.onSeeked();
          } else {
            this.trigger('pause');
          }
          break;

        case YT.PlayerState.BUFFERING:
          this.trigger('timeupdate');
          this.trigger('waiting');
          break;
      }
    }
  }, {
    key: 'duration',
    value: function duration() {
      return this.ytPlayer ? this.ytPlayer.getDuration() : 0;
    }
  }, {
    key: 'seeking',
    value: function seeking() {
      return this.isSeeking;
    }
  }, {
    key: 'seekable',
    value: function seekable() {
      if (!this.ytPlayer || !this.ytPlayer.getVideoLoadedFraction) {
        return {
          length: 0,
          start: function start() {
            throw new Error('This TimeRanges object is empty');
          },
          end: function end() {
            throw new Error('This TimeRanges object is empty');
          }
        };
      }
      var _end = this.ytPlayer.getDuration();

      return {
        length: this.ytPlayer.getDuration(),
        start: function start() {
          return 0;
        },
        end: function end() {
          return _end;
        }
      };
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (this.ytPlayer) {
        this.ytPlayer.pauseVideo();
      }
    }
  }, {
    key: 'paused',
    value: function paused() {
      return this.ytPlayer ? this.lastState !== YT.PlayerState.PLAYING && this.lastState !== YT.PlayerState.BUFFERING : true;
    }
  }, {
    key: 'onSeeked',
    value: function onSeeked() {
      clearInterval(this.checkSeekedInPauseInterval);
      this.isSeeking = false;

      if (this.wasPausedBeforeSeek) {
        this.pause();
      }

      this.trigger('seeked');
    }
  }, {
    key: 'onPlayerError',
    value: function onPlayerError(e) {
      this.errorNumber = e.data;
      this.trigger('error');

      this.ytPlayer.stopVideo();
      this.ytPlayer.destroy();
      this.ytPlayer = null;
    }
  }, {
    key: 'error',
    value: function error() {
      switch (this.errorNumber) {
        case 5:
          return { code: 'Error while trying to play the video' };

        case 2:
        case 100:
        case 150:
          return { code: 'Unable to find the video' };

        case 101:
          return { code: 'Playback on other Websites has been disabled by the video owner.' };
      }

      return { code: 'YouTube unknown error (' + this.errorNumber + ')' };
    }
  }]);

  return Youtube;
})(_techJs2['default']);

function apiLoaded() {
  YT.ready(function () {
    Youtube.isApiReady = true;

    for (var i = 0; i < Youtube.apiReadyQueue.length; ++i) {
      Youtube.apiReadyQueue[i].initYTPlayer();
    }
  });
}

function loadScript(src, callback) {
  var loaded = false;
  var tag = _globalDocument2['default'].createElement('script');
  var firstScriptTag = _globalDocument2['default'].getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  tag.onload = function () {
    if (!loaded) {
      loaded = true;
      callback();
    }
  };
  tag.onreadystatechange = function () {
    if (!loaded && (this.readyState === 'complete' || this.readyState === 'loaded')) {
      loaded = true;
      callback();
    }
  };
  tag.src = src;
}

Youtube.apiReadyQueue = [];

loadScript('https://www.youtube.com/iframe_api', apiLoaded);

_component2['default'].registerComponent('Youtube', Youtube);
_techJs2['default'].registerTech('Youtube', Youtube);
exports['default'] = Youtube;
module.exports = exports['default'];