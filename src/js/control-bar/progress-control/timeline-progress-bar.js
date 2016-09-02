/**
 * @file timeline-progress-bar.js
 */
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';
import { forEach } from 'lodash';
/**
 * Shows load progress
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class TimelineProgressBar
 */
class TimelineProgressBar extends Component {

  constructor (player, options) {
    super(player, options);
    this.on(player, 'komentsupdated', this.update);
    this.on(player, 'progress', this.update);
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl () {
    return super.createEl('div', {
      className: 'koment-timeline-progress'
    });
  }

  /**
   * Update progress bar
   *
   * @method update
   */
  update () {
    const items = this.player_.komentsList();
    const duration = this.player_.duration();
    const children = this.el_.children;

    // get the percent width of a time compared to the total end
    const percentify = function (time, end) {
      // no NaN
      const percent = (time / end) || 0;

      return ((percent >= 1 ? 1 : percent) * 100) + '%';
    };


    // add child elements to represent the individual buffered time ranges
    forEach(items, (item, i)=> {


      let part = children[i];

      if (!part) {
        part = this.el_.appendChild(Dom.createEl());
      }

      // set the percent based on the width of the progress bar (bufferedEnd)
      part.style.left = percentify(item.timecode, duration);
    });

  }

}

Component.registerComponent('TimelineProgressBar', TimelineProgressBar);
export default TimelineProgressBar;
