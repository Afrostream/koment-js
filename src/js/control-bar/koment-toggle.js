/**
 * @file koment-toggle.js
 */

import Component from '../component.js';
import Button from '../button.js';

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
class KomentToggle extends Button {

  constructor (player, options, ready) {
    super(player, options, ready)
    this.on(player, 'togglemenu', this.handleToggleChange);
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */
  buildCSSClass () {
    return `koment-toggle ${super.buildCSSClass()}`;
  }

  /**
   * Handle click on text track
   *
   * @method handleClick
   */
  handleClick (event) {
    super.handleClick(event);
    this.player_.toggleMenu();
  }

  handleToggleChange () {
    if (this.player_.isKomentOn()) {
      this.controlText('Non-Koment');
    } else {
      this.controlText('Koment');
    }
  }
}

KomentToggle.prototype.controlText_ = 'Koment';

Component.registerComponent('KomentToggle', KomentToggle);
export default KomentToggle
