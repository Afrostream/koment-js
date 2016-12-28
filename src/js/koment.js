/**
 * @file koment.js
 */

/* global define */

import videojs from 'video.js'
import 'videojs-externals'
import * as stylesheet from './utils/stylesheet.js';
import * as Dom from './utils/dom.js';
import window from 'global/window'
import './control-bar/koment-bar';
import './component/koment-display';
import './component/koment-list';

const Player = videojs.getComponent('Player');
const Component = videojs.getComponent('Component');

/**
 * Initialize the plugin.
 * @param options (optional) {object} configuration for the plugin
 */
class Koment extends Component {
  constructor (player, options, ready) {
    super(player, options, ready);
  }

  createEl () {
    return super.createEl('div', {
      className: 'koment-component'
    })
  }

  komentsList (list) {
    if (list !== undefined) {
      this.komentsList_ = list;
    }
    return this.komentsList_;
  }

  isKomentOn () {
    return this.toggleMenu_;
  }

  toggleMenu (toggle) {

    if (toggle !== undefined) {
      this.toggleMenu_ = !!toggle;
    }
    else {
      this.toggleMenu_ = !this.toggleMenu_
    }

    if (this.toggleMenu_) {
      this.player_.addClass('koment-toggle-menu');
    } else {
      this.player_.removeClass('koment-toggle-menu');
      this.toggleEdit(this.toggleMenu_);
      this.toggleList(this.toggleMenu_);
    }


    this.trigger('togglemenu');
    return this;
  }

  toggleEdit (toggle) {
    if (toggle !== undefined) {
      this.toggleEdit_ = !!toggle;
    }
    else {
      this.toggleEdit_ = !this.toggleEdit_
    }

    if (this.toggleEdit_) {
      this.playBeforeEdit = !this.player_.paused();
      this.player_.pause();
      this.player_.addClass('koment-toggle-edit');
    } else {
      if (this.playBeforeEdit) {
        this.player_.play();
      }
      this.player_.removeClass('koment-toggle-edit');
    }

    return this;
  }

  toggleList (toggle) {

    if (toggle !== undefined) {
      this.toggleList_ = !!toggle;
    }
    else {
      this.toggleList_ = !this.toggleList_
    }

    if (this.toggleList_) {
      this.player_.addClass('koment-toggle-list');
    } else {
      this.player_.removeClass('koment-toggle-list');
    }

    return this;
  }

  sendKoment (kmt) {
    if (!kmt || !kmt.message) {
      return;
    }
    console.log('koment send ', kmt);
    this.komentsList_.unshift(kmt);
    this.toggleEdit(false);
    this.player_.trigger({data: kmt, type: 'komentsupdated'});
  }

}

Koment.prototype.komentsList_ = []; // eslint-disable-line

Koment.prototype.options_ = {
  api: 'https://koment-api.herokuapp.com/api/koments',
  user: {
    avatar: '',
    nickname: ''
  }
};

// Add default styles
if (window.koment_NO_DYNAMIC_STYLE !== true) {
  let style = Dom.$('.koment-styles-defaults');

  if (!style) {
    style = stylesheet.createStyleElement('koment-styles-defaults');
    const head = Dom.$('head');

    if (head) {
      head.insertBefore(style, head.firstChild);
    }
    stylesheet.setTextContent(style, `
      .koment-js {
      }
    `);
  }
}

Component.registerComponent('Koment', Koment);

/**
 * add afrostream to videojs childs
 * @type {{}}
 */
videojs.options.children.push('koment');

Player.prototype.options_.children = Player.prototype.options_.children.concat([
  'komentDisplay',
  'komentList',
  'komentBar'
]);

export default Koment;
