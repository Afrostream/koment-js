/**
 * @file koment-display.js
 **/
import Component from '../component';
import * as Fn from '../utils/fn.js';
import xhr from 'xhr'
import { filter, forEach, map, sortBy, take, uniq, merge, pick } from 'lodash';
import KomentItem from './koment-item';

/**
 * Container of comment list
 *
 * @extends Component
 * @class KomentDisplay
 */
class KomentDisplay extends Component {

  constructor (player, options) {
    super(player, options);

    this.emitTapEvents();

    this.on('tap', this.handleClick);
    this.on('click', this.handleClick);
    this.on(player, 'loadedmetadata', this.initKoment);
  }

  videoId () {
    return this.player_.options_.videoId || this.player_.currentSrc();
  }

  initKoment () {
    const videoId_ = this.videoId();
    this.data_ = {
      json: true,
      uri: `${this.player_.options_.api}?video=${videoId_}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let kommentsList = [];
    xhr(this.data_, (err, res) => {
      if (err) {
        throw new Error(err.message)
      }
      kommentsList = res.body || [];

      forEach(kommentsList, (item)=> {
        if (item.user && item.user.facebook) {
          item.user = merge(item.user, {
            avatar: `//graph.facebook.com/${item.user.facebook.id}/picture`,
            nickname: item.user.facebook.nickname
          });
        }
      });

      kommentsList = sortBy(kommentsList, ['timecode']);

      this.player_.komentsList(kommentsList);
      this.player_.trigger('kmtlistfetched')
      this.createChilds();
    });
  }

  update (e) {
    const item = e.data;
    const mi = new KomentItem(this.player_, item);
    this.items.unshift(mi);
    this.addChild(mi);
    this.requestTick(true);
    const json = pick(item, ['timecode', 'message', 'user']);
    const videoId_ = this.videoId();
    json.video = videoId_;
    xhr(merge(this.data_, {
      method: 'POST',
      video: this.videoId_,
      uri: `${this.player_.options_.api}`,
      json,
    }), (err, res) => {
      if (err) {
        throw new Error(err.message)
      }
      console.log('koment posted', res);
    });
  }

  /**
   * Handle Click - Override with specific functionality for component
   *
   * @method handleClick
   */
  handleClick () {
    this.player_.toggleEdit(false);
    this.player_.toggleList(false);
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
  createChilds () {
    let items = this.player_.komentsList();
    this.items = [];
    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i]
      const mi = new KomentItem(this.player_, item);
      this.items.push(mi);
      this.addChild(mi);
    }

    this.on(this.player_, 'timeupdate', this.requestTick);
    this.on(this.player_, 'pause', this.timeoutReplace);
    this.on(this.player_, 'play', this.timeoutReplace);

    this.on(this.player_, 'komentsupdated', this.update);
    this.on(this.player_, 'togglemenu', this.requestTick);

    this.addClass(this.options_.template);
  }

  timeoutReplace () {
    const currentTimecode = Math.round(this.player_.currentTime());
    const paused = this.player_.paused() && currentTimecode > 0;
    const visibleItems = filter(this.items, (item)=> item.hasClass('koment-show'));

    forEach(visibleItems, (item)=> {
      if (!paused) {
        item.timeout = item.setTimeout(item.hide, this.options_.tte * 1000);
      } else {
        item.clearTimeout(item.timeout);
      }
    });
  }

  replaceTick () {
    this.showElements();
  }

  /**
   * Calls rAF if it's not already
   * been done already
   */
  requestTick (force) {
    if (force !== undefined) {
      this.ticking = !force;
    }
    if (!this.ticking) {
      requestAnimationFrame(Fn.bind(this, this.showElements));
      this.ticking = true;
    }
  }

  showElements () {
    let className = 'koment-show';
    const currentTimecode = Math.round(this.player_.currentTime());
    let visibleItems = filter(this.items, (item)=> item.hasClass(className));
    let nbVisible = visibleItems.length;
    let filtereds = uniq(this.items, (item)=> Math.round(item.timecode));

    filtereds = sortBy(filtereds, 'timecode');
    filtereds = filter(filtereds, (item)=> Math.round(item.timecode) === currentTimecode);
    filtereds = take(filtereds, Math.max(0, this.options_.max - nbVisible));

    forEach(filtereds, (item)=> {
      if (!item.hasClass(className)) {
        item.addClass(className);
        item.show();
        item.timeout = item.setTimeout(item.hide, this.options_.tte * 1000);
      }
    });

    this.ticking = false;
  }

}

KomentDisplay.prototype.options_ = {
  tte: 5,
  max: 3,
  template: 'viki'
};

Component.registerComponent('KomentDisplay', KomentDisplay);
export default KomentDisplay;
