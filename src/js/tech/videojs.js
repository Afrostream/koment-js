/**
 * @file Videojs.js
 * Videojs Media Controller - Wrapper for Videojs Media API
 */
import Tech from './tech.js';
import Html5 from './html5.js';
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
class Videojs extends Html5 {

  constructor (options, ready) {
    super(options, ready);
  }

}

Videojs.isSupported = function (tag) {
  return tag && tag.firstChild && tag.firstChild.tagName === 'VIDEO' && ~'vjs-tech'.indexOf(tag.firstChild.classList);
};


Component.registerComponent('Videojs', Videojs);
Tech.registerTech('Videojs', Videojs);
export default Videojs;
