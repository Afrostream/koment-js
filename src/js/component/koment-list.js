/**
 * @file koment-list.js
 **/
import Component from '../component';
import KomentItem from './koment-item';

/**
 * Container of comment list
 *
 * @extends Component
 * @class KomentList
 */
class KomentList extends Component {

  constructor (player, options) {
    super(player, options);
    this.on(this.player_, 'kmtlistfetched', this.createChilds);
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */
  createEl () {
    return super.createEl('div', {
      className: 'koment-list',
      dir: 'ltr'
    }, {
      role: 'group'
    });
  }

  update (e) {
    const item = e.data;
    const mi = new KomentItem(this.player_, item);
    this.items.unshift(mi);
    this.addChild(mi);
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

    this.on(this.player_, 'komentsupdated', this.update);

  }

}

KomentList.prototype.options_ = {};

Component.registerComponent('KomentList', KomentList);
export default KomentList;
