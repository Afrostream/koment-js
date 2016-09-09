/**
 * @file Youtube.js
 * Youtube Media Controller - Wrapper for Youtube Media API
 */
import Tech from './tech.js';
import Component from '../component';
import document from 'global/document';
import * as Fn from '../utils/fn.js';
/**
 * Youtube Media Controller - Wrapper for Youtube Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Youtube
 */
class Youtube extends Tech {

  constructor (options, ready) {
    super(options, ready);

    if (Youtube.isApiReady) {
      this.initYTPlayer();
    } else {
      Youtube.apiReadyQueue.push(this);
    }
  }

  initYTPlayer () {
    let playerVars = {
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

  currentTime () {
    return this.ytPlayer ? this.ytPlayer.getCurrentTime() : 0;
  }

  setCurrentTime (seconds) {
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
      this.checkSeekedInPauseInterval = setInterval(function () {
        if (this.lastState !== YT.PlayerState.PAUSED || !this.isSeeking) {
          // If something changed while we were waiting for the currentTime to change,
          //  clear the interval timer
          clearInterval(this.checkSeekedInPauseInterval);
        } else if (this.currentTime() !== this.timeBeforeSeek) {
          this.trigger('timeupdate');
          this.onSeeked();
        }
      }.bind(this), 250);
    }
  }

  onPlayerReady () {
    this.triggerReady();
  }

  onPlayerPlaybackQualityChange () {

  }

  onPlayerStateChange (e) {
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

  duration () {
    return this.ytPlayer ? this.ytPlayer.getDuration() : 0;
  }

  seeking () {
    return this.isSeeking;
  }

  seekable () {
    if (!this.ytPlayer || !this.ytPlayer.getVideoLoadedFraction) {
      return {
        length: 0,
        start: function () {
          throw new Error('This TimeRanges object is empty');
        },
        end: function () {
          throw new Error('This TimeRanges object is empty');
        }
      };
    }
    var end = this.ytPlayer.getDuration();

    return {
      length: this.ytPlayer.getDuration(),
      start: function () {
        return 0;
      },
      end: function () {
        return end;
      }
    };
  }

  play () {
    if (this.ytPlayer) {
      this.ytPlayer.playVideo();
    }
  }

  pause () {
    if (this.ytPlayer) {
      this.ytPlayer.pauseVideo();
    }
  }

  currentSrc () {
    return this.ytPlayer && this.ytPlayer.getVideoUrl();
  }

  paused () {
    return (this.ytPlayer) ?
      (this.lastState !== YT.PlayerState.PLAYING && this.lastState !== YT.PlayerState.BUFFERING)
      : true;
  }

  onSeeked () {
    clearInterval(this.checkSeekedInPauseInterval);
    this.isSeeking = false;

    if (this.wasPausedBeforeSeek) {
      this.pause();
    }

    this.trigger('seeked');
  }

  onPlayerError (e) {
    this.errorNumber = e.data;
    this.trigger('error');

    this.ytPlayer.stopVideo();
    this.ytPlayer.destroy();
    this.ytPlayer = null;
  }

  supportsFullScreen () {
    return true;
  }

  error () {
    switch (this.errorNumber) {
      case 5:
        return {code: 'Error while trying to play the video'};

      case 2:
      case 100:
      case 150:
        return {code: 'Unable to find the video'};

      case 101:
        return {code: 'Playback on other Websites has been disabled by the video owner.'};
    }

    return {code: 'YouTube unknown error (' + this.errorNumber + ')'};
  }
}

function apiLoaded () {
  YT.ready(function () {
    Youtube.isApiReady = true;

    for (var i = 0; i < Youtube.apiReadyQueue.length; ++i) {
      Youtube.apiReadyQueue[i].initYTPlayer();
    }
  });
}

function loadScript (src, callback) {
  let loaded = false;
  let tag = document.createElement('script');
  let firstScriptTag = document.getElementsByTagName('script')[0];
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


function injectCss () {
  let css = // iframe blocker to catch mouse events
    '.koment-youtube .koment-iframe-blocker { display: none; }' +
    '.koment-youtube.koment-user-inactive .koment-iframe-blocker { display: block; }' +
    '.koment-youtube .koment-poster { background-size: cover; }' +
    '.koment-youtube-mobile .koment-big-play-button { display: none; }';

  let head = document.head || document.getElementsByTagName('head')[0];

  let style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

function useNativeControlsOnAndroid () {
  var stockRegex = window.navigator.userAgent.match(/applewebkit\/(\d*).*Version\/(\d*.\d*)/i);
  //True only Android Stock Browser on OS versions 4.X and below
  //where a Webkit version and a "Version/X.X" String can be found in
  //user agent.
  return videojs.browser.IS_ANDROID && videojs.browser.ANDROID_VERSION < 5 && stockRegex && stockRegex[2] > 0;
}

Youtube.apiReadyQueue = [];

Youtube.isSupported = function (tag) {
  return tag && tag.tagName && tag.tagName === 'IFRAME' && tag.src && ~tag.src.indexOf('youtube');
};


loadScript('https://www.youtube.com/iframe_api', apiLoaded);
injectCss();

Component.registerComponent('Youtube', Youtube);
Tech.registerTech('Youtube', Youtube);
export default Youtube;
