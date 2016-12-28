/**
 * @file list-button.js
 */

import videojs from'video.js';
let Component = videojs.getComponent('Component');
import KomentButton from'./koment-button';
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
class ListButton extends KomentButton {

  constructor (player, options, ready) {
    super(player, options, ready);
    this.on(this.player_, 'kmtlistfetched', this.update);
    this.on(this.player_, 'komentsupdated', this.update);
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */
  buildCSSClass () {
    return `list-button vjs-hidden ${super.buildCSSClass()}`
  }

  /**
   * Update progress bar
   *
   * @method update
   */
  update () {
    const items = this.player_.koment.komentsList();
    if (items && items.length) {
      this.show();
    } else {
      this.hide();
    }
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
    this.player_.koment.toggleList();
  }

  disable () {
    this.removeClass('active');
  }
}

ListButton.prototype.controlText_ = 'List';

Component.registerComponent('ListButton', ListButton);
export default ListButton
