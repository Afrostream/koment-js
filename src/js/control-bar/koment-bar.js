/**
 * @file control-bar.js
 */
import videojs from'video.js';
let Component = videojs.getComponent('Component');
let ControlBar = videojs.getComponent('ControlBar');

// Required children
import './koment-toggle';
import './like-button';
import './edit-button';
import './list-button';
import './post-box/post-box';

/**
 * Container of main controls
 *
 * @extends Component
 * @class KomentBar
 */
class KomentBar extends ControlBar {
  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl () {
    return videojs.createEl('div', {
      className: 'koment-control-bar',
      dir: 'ltr'
    }, {
      // The control bar is a group, so it can contain menuitems
      role: 'group'
    });
  }
}

KomentBar.prototype.options_ = {
  children: [
    'komentToggle',
    'editButton',
    'listButton',
    'postBox',
  ]
};

Component.registerComponent('KomentBar', KomentBar);
export default KomentBar;
