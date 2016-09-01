/**
 * @file koment-item.js
 **/
import * as Dom from '../utils/dom'
import Component from '../component.js';
/**
 * Container of main controls
 *
 * @extends Component
 * @class ControlBar
 */
class KomentItem extends Component {

  constructor (player, options) {
    super(player, options);
    this.timecode = this.options_.timecode;
    this.text = this.options_.text;
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl () {

    const el = super.createEl('div', {
      className: 'koment-item komment-mask'
    });

    this.contentEl_ = Dom.createEl('div', {
      className: 'koment-item-display',
      innerHTML: `<span class="koment-item-title">${this.options_.text}</span>`
    }, {
      'aria-live': 'off'
    });

    el.appendChild(this.contentEl_);
    return el;

  }
}

KomentItem.prototype.timecode = 0;
KomentItem.prototype.options_ = {};

Component.registerComponent('KomentItem', KomentItem);
export default KomentItem;
