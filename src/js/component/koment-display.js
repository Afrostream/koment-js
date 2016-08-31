/**
 * @file koment-display.js
 **/
import Component from '../component';
import * as Fn from '../utils/fn.js';
import * as Dom from '../utils/dom'
import xhr from 'xhr'
import { filter, forEach, map, clone, sortBy } from 'lodash';
import KomentItem from './koment-item';

/**
 * Container of comment list
 *
 * @extends Component
 * @class KomentDisplay
 */
class KomentDisplay extends Component {

  constructor (player, options) {
    super(player, options)

    let data = {
      json: true,
      uri: this.options_.url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let kommentsList = [];
    let tc = 0;
    xhr(data, (err, res) => {
      if (err) {
        throw new Error(err.message)
      }

      //  forEach(res.body || [], (item)=> {
      //    forEach(res.body || [], ()=> {
      //      let copyItem = clone(item)
      //      copyItem.timecode = tc;//Math.round(Math.random() * (352 - 0) + 0);
      //      kommentsList.push(copyItem)
      //      tc += 0.2
      //    })
      //  });
      kommentsList = res.body || [];
      kommentsList = sortBy(kommentsList, ['timecode']);
      this.createChilds(kommentsList);
    });
    //const dummyText = 'totocavamoiouibientotocavtotocavamoiouibientotocavamoiouibientotocavamoiouibientotocavamoiouibienamoiouibien totocavamoiouibien totocavamoiouibien et toi';
    //for (let i = 0; i < 50; i++) {
    //  kommentsList.push({
    //    text: dummyText.substring(0, Math.random() * (dummyText.length - 0) + 0),
    //    timecode: tc
    //  })
    //
    //  tc += 0.2;//Math.round(Math.random() * (352 - 0) + 0)
    //}
    //this.createChilds(kommentsList);

  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl () {
    return super.createEl('div', {
      className: 'koment-display',
      dir: 'ltr'
    }, {
      role: 'group'
    });
  }

  /**
   * Create menu from chapter buttons
   *
   * @return {Menu} Menu of chapter buttons
   * @method createMenu
   */
  createChilds (items) {
    this.items = [];
    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i]
      const mi = new KomentItem(this.player_, item);
      this.items.push(mi);
      this.addChild(mi);
    }

    if (items.length > 0) {
      this.show();
    }

    this.on(this.player_, 'loadedmetadata', this.positionComments);
    this.on(this.player_, 'pause', this.replaceTick);
    this.on(this.player_, 'play', this.replaceTick);
    this.on(this.player_, 'seeked', this.requestTick);
    this.on(this.player_, 'timeupdate', this.requestTick);
  }

  replaceTick () {
    this.moveTimeline();
  }

  /**
   * Calls rAF if it's not already
   * been done already
   */
  requestTick () {
    if (!this.ticking) {
      requestAnimationFrame(Fn.bind(this, this.moveTimeline));
      this.ticking = true;
    }
  }

  moveTimeline () {
    let className = this.pause ? 'koment-paused' : 'koment-show';
    const currentTimecode = this.player_.currentTime();
    const playerWidth = this.player_.width();
    const positionGap = (this.options_.tte + 5);
    forEach(this.items, (item)=> {
      const inTimeCodeRange = (item.timecode <= currentTimecode + positionGap) && (item.timecode >= currentTimecode - positionGap);
      if (inTimeCodeRange) {
        let percent = (this.options_.tte - (currentTimecode - item.timecode)) / (this.options_.tte);
        let position = (percent * playerWidth) - playerWidth;
        let top = 0;
        if (!item.hasClass(className)) {
          item.removeClass('koment-hidden');
          item.removeClass('koment-show');
          item.removeClass('koment-paused');
          item.addClass(className);
        }
        item.el_.style.webkitTransform = `translate3d(${position}px, ${top}px, 0)`;
      }
      else {
        if (!item.hasClass('koment-hidden')) {
          item.removeClass('koment-paused');
          item.removeClass('koment-show');
          item.addClass('koment-hidden');
        }
      }
    });
    this.ticking = false;
  }

  positionComments () {
    let leftItem = 0;
    const playerWidth = this.player_.width();
    forEach(this.items, (item, key)=> {
      let prevItem = this.items[key - 1];
      let percent = (this.options_.tte - (item.timecode)) / (this.options_.tte);
      let position = playerWidth - (percent * playerWidth);
      let top = 0;

      if (prevItem) {
        let prevItemPos = Dom.findElPosition(prevItem.el_);
        prevItemPos.width = prevItem.width();
        prevItemPos.height = prevItem.height();

        let percentPrevItem = (this.options_.tte - (prevItem.timecode)) / (this.options_.tte);
        let positionPrevItem = playerWidth - (percentPrevItem * playerWidth);
        if ((positionPrevItem + prevItemPos.width) > position) {
          top = prevItemPos.top + prevItemPos.height;
          if (top > 150) {
            top = 0;
          }
        }
      }

      item.el_.style.left = playerWidth + leftItem + 'px';
      item.el_.style.top = top + 'px';
    });
  }

}

KomentDisplay.prototype.options_ = {
  url: 'https://afr-api-v1-staging.herokuapp.com/api/videos/c1ee3b32-0bf8-4873-b173-09dc055b7bfe/comments',
  itemsInSceen: 3,
  itemGap: 10,
  tte: 5
};

Component.registerComponent('KomentDisplay', KomentDisplay);
export default KomentDisplay;
