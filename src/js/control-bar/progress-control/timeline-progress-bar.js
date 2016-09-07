/**
 * @file timeline-progress-bar.js
 */
import Component from '../../component.js';
import * as Dom from '../../utils/dom.js';
import { forEach } from 'lodash';
import TimelineProgressItem from './timeline-progress-item.js'
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
    this.on(player, 'komentsupdated', this.insert);
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
  insert (e) {
    const duration = this.player_.duration();
    const item = e.data;
    const part = this.addChild(new TimelineProgressItem(this.player_, e.data));
    // set the percent based on the width of the progress bar (bufferedEnd)
    part.el_.style.left = this.percentify(item.timecode, duration);
  }

  /**
   * get percent position in timeline
   * @param time
   * @param end
   * @returns {string}
   */
  percentify (time, end) {
    // no NaN
    const percent = (time / end) || 0;

    return ((percent >= 1 ? 1 : percent) * 100) + '%';
  }

  /**
   * Update progress bar
   *
   * @method update
   */
  update () {
    const items = this.player_.komentsList();
    const duration = this.player_.duration();
    const children = this.children();

    // add child elements to represent the individual buffered time ranges
    forEach(items, (item, i)=> {

      let part = children[i];

      if (!part) {
        part = this.addChild(new TimelineProgressItem(this.player_, item));
      }
      // set the percent based on the width of the progress bar (bufferedEnd)
      part.el_.style.left = this.percentify(item.timecode, duration);
    });

  }

}

Component.registerComponent('TimelineProgressBar', TimelineProgressBar);
export default TimelineProgressBar;
