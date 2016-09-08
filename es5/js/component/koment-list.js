/**
 * @file koment-list.js
 **/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _komentItem = require('./koment-item');

var _komentItem2 = _interopRequireDefault(_komentItem);

/**
 * Container of comment list
 *
 * @extends Component
 * @class KomentList
 */

var KomentList = (function (_Component) {
  _inherits(KomentList, _Component);

  function KomentList(player, options) {
    _classCallCheck(this, KomentList);

    _get(Object.getPrototypeOf(KomentList.prototype), 'constructor', this).call(this, player, options);
    this.on(this.player_, 'kmtlistfetched', this.createChilds);
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */

  _createClass(KomentList, [{
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(KomentList.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-list',
        dir: 'ltr'
      }, {
        role: 'group'
      });
    }
  }, {
    key: 'update',
    value: function update(e) {
      var item = e.data;
      var mi = new _komentItem2['default'](this.player_, item);
      this.items.unshift(mi);
      this.addChild(mi);
    }

    /**
     * Create menu from chapter buttons
     *
     * @return {Menu} Menu of chapter buttons
     * @method createMenu
     */
  }, {
    key: 'createChilds',
    value: function createChilds() {
      var items = this.player_.komentsList();
      this.items = [];
      for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
        var mi = new _komentItem2['default'](this.player_, item);
        this.items.push(mi);
        this.addChild(mi);
      }

      this.on(this.player_, 'komentsupdated', this.update);
    }
  }]);

  return KomentList;
})(_component2['default']);

KomentList.prototype.options_ = {};

_component2['default'].registerComponent('KomentList', KomentList);
exports['default'] = KomentList;
module.exports = exports['default'];