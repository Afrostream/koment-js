/**
 * @file Videojs.js
 * Videojs Media Controller - Wrapper for Videojs Media API
 */
import Tech from './tech.js';
import Component from '../component';
import document from 'global/document';
import * as Fn from '../utils/fn.js';
/**
 * Videojs Media Controller - Wrapper for Videojs Media API
 *
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready Ready callback function
 * @extends Tech
 * @class Videojs
 */
class Videojs extends Tech {

  constructor (options, ready) {
    super(options, ready);
  }

}

Videojs.isSupported = function (tag) {
  return tag && tag.tagName && tag.tagName === 'DIV' && ~tag.classList.indexOf('video-js');
};


Component.registerComponent('Videojs', Videojs);
Tech.registerTech('Videojs', Videojs);
export default Videojs;
