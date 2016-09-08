/**
 * @file list-button.js
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
 * @class ListButton
 */
class ListButton extends Button {

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
    return `list-button ${super.buildCSSClass()}`
  }

  /**
   * Handle click on text track
   *
   * @method handleClick
   */
  handleClick (event) {
    super.handleClick(event);
    this.addClass('active');
    this.setTimeout(this.disable, 300);
    this.player_.toggleList();
  }

  disable () {
    this.removeClass('active');
  }
}

ListButton.prototype.controlText_ = 'List';

Component.registerComponent('ListButton', ListButton);
export default ListButton
