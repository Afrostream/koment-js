/**
 * @file setup.js
 *
 * Functions for automatically setting up a player
 * based on the data-setup attribute of the video tag
 */
import * as Events from './utils/events.js';
import document from 'global/document';
import window from 'global/window';
import { map, pullAll } from 'lodash';
let _windowLoaded = false;
let koment;

// Automatically set up any tags that have a data-setup attribute
const autoSetup = function () {
  let selectors = [
    '.video-js',
    'video',
    'iframe[src*="player.vimeo.com"]',
    'iframe[src*="youtube.com"]',
    'iframe[src*="youtube-nocookie.com"]',
    'iframe[src*="kickstarter.com"][src*="video.html"]',
    'object',
    'embed'
  ];

  let ignoreList = ['object object', '.komentignore'];


  //if (this.options_.customSelector) {
  //  selectors.push(this.options_.customSelector)
  //}
  //
  //if (this.options_.ignoreSelector) {
  //  ignoreList.push(this.options_.ignoreSelector)
  //}

  //add selector to exclude ignored list
  map(ignoreList, (selector)=> {
    return ':not(' + selector + ')'
  });

  let allVideos = document.querySelectorAll(selectors.join(','));
  let ingnored = document.querySelectorAll(ignoreList.join(','));

  //Remove all ignored selector
  const mediaEls = pullAll(allVideos, ingnored);
  // Check if any media elements exist
  if (mediaEls && mediaEls.length > 0) {

    for (let i = 0, e = mediaEls.length; i < e; i++) {
      let mediaEl = mediaEls[i];
      // Check if element exists, has getAttribute func.
      // IE seems to consider typeof el.getAttribute == 'object' instead of
      // 'function' like expected, at least when loading the player immediately.
      if (mediaEl && mediaEl.getAttribute) {
        let isVideojs = mediaEl.firstChild && mediaEl.firstChild.tagName === 'VIDEO' && ~'vjs-tech'.indexOf(mediaEl.firstChild.classList)
        let wrapper;
        if (isVideojs) {
          wrapper = mediaEl;
          mediaEl = mediaEl.firstChild;
        }
        // Make sure this player hasn't already been set up.
        if (mediaEl.koment === undefined) {
          let options = mediaEl.getAttribute('data-setup');
          // Check if data-setup attr exists.
          // We only auto-setup if they've added the data-setup attr.
          //if (options !== null) {
          // Create new video.js instance.
          koment(mediaEl, options || {});
          //}
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
function autoSetupTimeout (wait, kmt) {
  if (kmt) {
    koment = kmt;
  }

  setTimeout(autoSetup, wait);
}

if (document.readyState === 'complete') {
  _windowLoaded = true;
} else {
  Events.one(window, 'load', function () {
    _windowLoaded = true;
  });
}

const hasLoaded = function () {
  return _windowLoaded;
};

export { autoSetup, autoSetupTimeout, hasLoaded };
