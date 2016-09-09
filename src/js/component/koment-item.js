/**
 * @file koment-item.js
 **/
import * as Dom from '../utils/dom'
import ClickableComponent from '../clickable-component.js';
import Component from '../component.js';
import formatTime from '../utils/format-time.js';
/**
 * Container of main controls
 *
 * @extends Component
 * @class ControlBar
 */
class KomentItem extends ClickableComponent {

  constructor (player, options) {
    super(player, options);
    this.timecode = this.options_.timecode;
    this.message = this.options_.message;
    this.user = this.options_.user;
    this.update();
  }

  /**
   * Event handler for updates to the player's poster source
   *
   * @method update
   */
  update () {
    const url = this.options_.user.avatar;
    const timecode = formatTime(this.timecode, this.player_.duration());
    this.setSrc(url);
    this.tcEl_.innerHTML = `${timecode} ${this.user.nickname ? '- ' + this.user.nickname : ''}`;
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
      className: 'koment-item koment-hidden'
    });

    this.contentEl_ = Dom.createEl('div', {
      className: 'koment-item-display'
    }, {
      'aria-live': 'off'
    });

    this.tcEl_ = Dom.createEl('div', {
      className: 'koment-item-timecode',
    });

    this.textEl_ = Dom.createEl('div', {
      className: 'koment-item-title',
      innerHTML: this.options_.message
    });


    this.avatarEl_ = Dom.createEl('div', {
      className: 'koment-item-avatar',
    }, {
      'aria-live': 'off'
    });

    this.contentEl_.appendChild(this.tcEl_);
    this.contentEl_.appendChild(this.textEl_);
    el.appendChild(this.avatarEl_);
    el.appendChild(this.contentEl_);
    return el;

  }

  handleClick () {
    this.player_.currentTime(this.timecode);
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

KomentItem.prototype.timecode = 0;
KomentItem.prototype.options_ = {
  message: '',
  timecode: 0,
  user: {
    nickname: '',
    avatar: ''
  }
};

Component.registerComponent('KomentItem', KomentItem);
export default KomentItem;
