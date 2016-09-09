/**
 * @file setup.js
 *
 * Functions for automatically setting up a player
 * based on the data-setup attribute of the video tag
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utilsEventsJs = require('./utils/events.js');

var Events = _interopRequireWildcard(_utilsEventsJs);

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _lodash = require('lodash');

var _windowLoaded = false;
var koment = undefined;

// Automatically set up any tags that have a data-setup attribute
var autoSetup = function autoSetup() {
  var selectors = ['.video-js', 'video', 'iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', 'object', 'embed'];

  var ignoreList = ['object object', '.komentignore'];

  //if (this.options_.customSelector) {
  //  selectors.push(this.options_.customSelector)
  //}
  //
  //if (this.options_.ignoreSelector) {
  //  ignoreList.push(this.options_.ignoreSelector)
  //}

  //add selector to exclude ignored list
  (0, _lodash.map)(ignoreList, function (selector) {
    return ':not(' + selector + ')';
  });

  var allVideos = _globalDocument2['default'].querySelectorAll(selectors.join(','));
  var ingnored = _globalDocument2['default'].querySelectorAll(ignoreList.join(','));

  //Remove all ignored selector
  var mediaEls = (0, _lodash.pullAll)(allVideos, ingnored);
  // Check if any media elements exist
  if (mediaEls && mediaEls.length > 0) {

    for (var i = 0, e = mediaEls.length; i < e; i++) {
      var mediaEl = mediaEls[i];
      // Check if element exists, has getAttribute func.
      // IE seems to consider typeof el.getAttribute == 'object' instead of
      // 'function' like expected, at least when loading the player immediately.
      if (mediaEl && mediaEl.getAttribute) {
        var isVideojs = mediaEl.firstChild && mediaEl.firstChild.tagName === 'VIDEO' && ~'vjs-tech'.indexOf(mediaEl.firstChild.classList);
        var wrapper = undefined;
        if (isVideojs) {
          wrapper = mediaEl;
          mediaEl = mediaEl.firstChild;
        }
        // Make sure this player hasn't already been set up.
        if (mediaEl.koment === undefined) {
          var options = mediaEl.getAttribute('data-setup') || wrapper && wrapper.getAttribute && wrapper.getAttribute('data-setup');
          // Check if data-setup attr exists.
          // We only auto-setup if they've added the data-setup attr.
          if (options !== null) {
            // Create new video.js instance.
            koment(mediaEl);
          }
        }

        // If getAttribute isn't defined, we need to wait for the DOM.
      } else {
          autoSetupTimeout(1);
          break;
        }
    }

    // No videos were found, so keep looping unless page is finished loading.
  } else if (!_windowLoaded) {
      autoSetupTimeout(1);
    }
};

// Pause to let the DOM keep processing
function autoSetupTimeout(wait, kmt) {
  if (kmt) {
    koment = kmt;
  }

  setTimeout(autoSetup, wait);
}

if (_globalDocument2['default'].readyState === 'complete') {
  _windowLoaded = true;
} else {
  Events.one(_globalWindow2['default'], 'load', function () {
    _windowLoaded = true;
  });
}

var hasLoaded = function hasLoaded() {
  return _windowLoaded;
};

exports.autoSetup = autoSetup;
exports.autoSetupTimeout = autoSetupTimeout;
exports.hasLoaded = hasLoaded;