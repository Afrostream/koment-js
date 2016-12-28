/**
 * @file koment-toggle.js
 */

import videojs from'video.js';
let Component = videojs.getComponent('Component');
let Button = videojs.getComponent('Button');
/**
 * The button component for toggling and selecting koment
 * Chapters act much differently than other text tracks
 * Cues are navigation vs. other tracks of alternative languages
 *
 * @param {Object} player  Player object
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready    Ready callback function
 * @extends Button
 * @class KomentToggle
 */
class KomentButton extends Button {

  constructor (player, options, ready) {
    super(player, options, ready)
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */
  buildCSSClass () {
    return `koment-control koment-button`;
  }

  createEl () {
    return super.createEl('button', {}, this.options_.attributes)
  }
}

KomentButton.prototype.options_ = {
  attributes: {}
};

KomentButton.prototype.controlText_ = 'KomentButton';

Component.registerComponent('KomentButton', KomentButton);
export default KomentButton
