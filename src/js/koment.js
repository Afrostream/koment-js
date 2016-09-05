/**
 * @file koment.js
 */

/* global define */

import window from 'global/window'
import document from 'global/document'
import * as setup from './setup';
import * as stylesheet from './utils/stylesheet.js';
import * as Events from './utils/events.js';
import Player from './player';
import log from './utils/log.js';
import * as Dom from './utils/dom.js';
import * as browser from './utils/browser.js';
import * as Url from './utils/url.js';
import merge from 'lodash-compat/object/merge';

// HTML5 Element Shim for IE8
if (typeof HTMLVideoElement === 'undefined') {
  document.createElement('video');
  document.createElement('audio');
  document.createElement('track');
}

/**
 * Doubles as the main function for users to create a player instance and also
 * the main library object.
 * The `koment` function can be used to initialize or retrieve a player.
 * ```js
 *     var myPlayer = koment('my_video_id');
 * ```
 *
 * @param  {String|Element} id      Video element or video element ID
 * @param  {Object=} options        Optional options object for config/settings
 * @param  {Function=} ready        Optional ready callback
 * @return {Player}                 A player instance
 * @mixes koment
 * @method koment
 */
function koment (id, options, ready) {
  let tag;

  // Allow for element or ID to be passed in
  // String ID
  if (typeof id === 'string') {

    // Adjust for jQuery ID syntax
    if (id.indexOf('#') === 0) {
      id = id.slice(1);
    }

    // If a player instance has already been created for this ID return it.
    if (koment.getPlayers()[id]) {

      // If options or ready funtion are passed, warn
      if (options) {
        log.warn(`Player "${id}" is already initialised. Options will not be applied.`);
      }

      if (ready) {
        koment.getPlayers()[id].ready(ready);
      }

      return koment.getPlayers()[id];
    }

    // Otherwise get element for ID
    tag = Dom.getEl(id);

    // ID is a media element
  } else {
    tag = id;
  }

  // Check for a useable element
  // re: nodeName, could be a box div also
  if (!tag || !tag.nodeName) {
    throw new TypeError('The element or ID supplied is not valid. (koment)');
  }

  // Element may have a player attr referring to an already created player instance.
  // If not, set up a new player and return the instance.
  return tag.koment || Player.players[tag.playerId] || new Player(tag, options, ready);
}

// Add default styles
if (window.koment_NO_DYNAMIC_STYLE !== true) {
  let style = Dom.$('.koment-styles-defaults');

  if (!style) {
    style = stylesheet.createStyleElement('koment-styles-defaults');
    const head = Dom.$('head');

    if (head) {
      head.insertBefore(style, head.firstChild);
    }
    stylesheet.setTextContent(style, `
      .koment-js {
      }
    `);
  }
}

// Run Auto-load players
// You have to wait at least once in case this script is loaded after your
// video in the DOM (weird behavior only with minified version)
setup.autoSetupTimeout(1, koment);

/*
 * Current software version (semver)
 *
 * @type {String}
 */
koment.VERSION = require('../../package.json').version;

/**
 * The global options object. These are the settings that take effect
 * if no overrides are specified when the player is created.
 *
 * ```js
 *     koment.options.autoplay = true
 *     // -> all players will autoplay by default
 * ```
 *
 * @type {Object}
 */
koment.options = Player.prototype.options_;

/**
 * Get an object with the currently created players, keyed by player ID
 *
 * @return {Object} The created players
 * @mixes koment
 * @method getPlayers
 */
koment.getPlayers = () => Player.players;

/**
 * Expose players object.
 *
 * @memberOf koment
 * @property {Object} players
 */
koment.players = Player.players;

/**
 * A suite of browser and device tests
 *
 * @type {Object}
 * @private
 */
koment.browser = browser;

/**
 * Whether or not the browser supports touch events. Included for backward
 * compatibility with 4.x, but deprecated. Use `koment.browser.TOUCH_ENABLED`
 * instead going forward.
 *
 * @deprecated
 * @type {Boolean}
 */
koment.TOUCH_ENABLED = browser.TOUCH_ENABLED;

/**
 * Adding languages so that they're available to all players.
 * ```js
 *     koment.addLanguage('es', { 'Hello': 'Hola' });
 * ```
 *
 * @param  {String} code The language code or dictionary property
 * @param  {Object} data The data values to be translated
 * @return {Object} The resulting language dictionary object
 * @mixes koment
 * @method addLanguage
 */
koment.addLanguage = function (code, data) {
  code = ('' + code).toLowerCase();
  return merge(koment.options.languages, {[code]: data})[code];
};

/**
 * Log debug messages.
 *
 * @param {...Object} messages One or more messages to log
 */
koment.log = log;

/**
 * Resolve and parse the elements of a URL
 *
 * @param  {String} url The url to parse
 * @return {Object}     An object of url details
 * @method parseUrl
 */
koment.parseUrl = Url.parseUrl;

/**
 * Returns whether the url passed is a cross domain request or not.
 *
 * @param {String} url The url to check
 * @return {Boolean}   Whether it is a cross domain request or not
 * @method isCrossOrigin
 */
koment.isCrossOrigin = Url.isCrossOrigin;

/**
 * Add an event listener to element
 * It stores the handler function in a separate cache object
 * and adds a generic handler to the element's event,
 * along with a unique id (guid) to the element.
 *
 * @param  {Element|Object}   elem Element or object to bind listeners to
 * @param  {String|Array}   type Type of event to bind to.
 * @param  {Function} fn   Event listener.
 * @method on
 */
koment.on = Events.on;

/**
 * Trigger a listener only once for an event
 *
 * @param  {Element|Object}   elem Element or object to
 * @param  {String|Array}   type Name/type of event
 * @param  {Function} fn Event handler function
 * @method one
 */
koment.one = Events.one;

/**
 * Removes event listeners from an element
 *
 * @param  {Element|Object}   elem Object to remove listeners from
 * @param  {String|Array=}   type Type of listener to remove. Don't include to remove all events from element.
 * @param  {Function} fn   Specific listener to remove. Don't include to remove listeners for an event type.
 * @method off
 */
koment.off = Events.off;

/**
 * Trigger an event for an element
 *
 * @param  {Element|Object}      elem  Element to trigger an event on
 * @param  {Event|Object|String} event A string (the type) or an event object with a type attribute
 * @param  {Object} [hash] data hash to pass along with the event
 * @return {Boolean=} Returned only if default was prevented
 * @method trigger
 */
koment.trigger = Events.trigger;

/*
 * Custom Universal Module Definition (UMD)
 *
 * Koment.js will never be a non-browser lib so we can simplify UMD a bunch and
 * still support requirejs and browserify. This also needs to be closure
 * compiler compatible, so string keys are used.
 */
if (typeof define === 'function' && define.amd) {
  define('koment', [], () => koment);

// checking that module is an object too because of umdjs/umd#35
} else if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = koment;
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (fn) {
    setTimeout(fn, 16.66);
  }
}


export default koment;
