/**
 * @file timeline-progress-item.js
 **/
import * as Dom from '../../utils/dom'
import Component from '../../component.js';
/**
 * Container of main controls
 *
 * @extends Component
 * @class ControlBar
 */
class TimelineProgressItem extends Component {

  constructor (player, options) {
    super(player, options);
    this.timecode = this.options_.timecode;
    this.user = this.options_.user;
    this.update();
  }

  /**
   * Event handler for updates to the player's poster source
   *
   * @method update
   */
  update () {
    const url = this.user.picture;

    this.setSrc(url);

    // If there's no poster source we should display:none on this component
    // so it's not still clickable or right-clickable
    if (url) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Set the poster source depending on the display method
   *
   * @param {String} url The URL to the poster source
   * @method setSrc
   */
  setSrc (url) {
    let backgroundImage = '';

    // Any falsey values should stay as an empty string, otherwise
    // this will throw an extra error
    if (url) {
      backgroundImage = `url("${url}")`;
    }

    this.avatarEl_.style.backgroundImage = backgroundImage;
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl () {

    const el = super.createEl('div', {
      className: 'kmt-timeline-progress-item'
    });

    this.avatarEl_ = Dom.createEl('div', {
      className: 'koment-item-avatar',
    }, {
      'aria-live': 'off'
    });

    el.appendChild(this.avatarEl_);
    return el;

  }

  hide () {
    if (this.hasClass('koment-show')) {
      this.removeClass('koment-show');
    }
    this.addClass('koment-mask');
    this.setTimeout(()=> {
      if (this.hasClass('koment-mask')) {
        this.removeClass('koment-mask');
      }
      this.addClass('koment-hidden');
    }, 500);
  }
}

TimelineProgressItem.prototype.timecode = 0;
TimelineProgressItem.prototype.options_ = {
  timecode: 0,
  user: {
    picture: ''
  }
};

Component.registerComponent('TimelineProgressItem', TimelineProgressItem);
export default TimelineProgressItem;
