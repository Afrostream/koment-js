/**
 * @file koment-toggle.js
 */
import toTitleCase from '../utils/to-title-case'
import * as Dom from '../utils/dom'

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
 * @class EditButton
 */
class EditButton extends Button {

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
    return `edit-button ${super.buildCSSClass()}`
  }

  createEl () {
    return super.createEl('button', {
      innerHTML: '<div class="line" ></div><div class="line" ></div><div class="line" ></div><div class="line" ></div><div class="line" ></div><div class="line" ></div><div class="line" ></div><div class="line" ></div>'
    });

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
    this.player_.toggleEdit();
    this.player_.pause();
  }

  disable () {
    this.removeClass('active');
  }
}

EditButton.prototype.controlText_ = 'Edit';

Component.registerComponent('EditButton', EditButton);
export default EditButton
