/**
 * @file koment-display.js
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

var _xhr = require('xhr');

var _xhr2 = _interopRequireDefault(_xhr);

var _lodash = require('lodash');

var _komentItem = require('./koment-item');

var _komentItem2 = _interopRequireDefault(_komentItem);

var _gsap = require('gsap');

/**
 * Container of comment list
 *
 * @extends Component
 * @class KomentDisplay
 */

var KomentDisplay = (function (_Component) {
  _inherits(KomentDisplay, _Component);

  function KomentDisplay(player, options) {
    var _this = this;

    _classCallCheck(this, KomentDisplay);

    _get(Object.getPrototypeOf(KomentDisplay.prototype), 'constructor', this).call(this, player, options);

    var data = {
      json: true,
      uri: this.options_.url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    (0, _xhr2['default'])(data, function (err, res) {
      if (err) {
        throw new Error(err.message);
      }

      var kommentsList = res.body || [];
      //forEach(res.body || [], (item)=> {
      //  forEach(res.body || [], ()=> {
      //    let copyItem = clone(item)
      //    copyItem.timecode = Math.round(Math.random() * (352 - 0) + 0);
      //    kommentsList.push(copyItem)
      //  })
      //})

      _this.createChilds(kommentsList);
    });
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */

  _createClass(KomentDisplay, [{
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(KomentDisplay.prototype), 'createEl', this).call(this, 'div', {
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
  }, {
    key: 'createChilds',
    value: function createChilds(items) {
      this.items = [];
      for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
        var mi = new _komentItem2['default'](this.player_, item);
        this.items.push(mi);
        this.addChild(mi);
      }

      if (items.length > 0) {
        this.show();
      }

      //this.on(this.player_, 'timeupdate', this.showTimedItems);
      //this.on(this.player_, 'loadedmetadata', this.positionComments);
      //this.on(this.player_, 'timeupdate', this.moveTimeline);
      this.on(this.player_, 'loadedmetadata', this.positionTopComments);
    }
  }, {
    key: 'positionComments',
    value: function positionComments() {
      var _this2 = this;

      var playerWidth = this.player_.width();
      var duration = this.player_.duration();
      var topItem = 0;
      (0, _lodash.forEach)(this.items, function (item, key) {
        item.addClass('koment-position');

        var percent = (duration - item.timecode) / duration;
        var position = _this2.options_.speed - Math.round(percent * _this2.options_.speed) + playerWidth;

        item.el_.style.top = topItem + 'px';
        item.el_.style.left = position + 'px';
        topItem += item.height() + _this2.options_.itemGap;

        if (key % _this2.options_.itemsInSceen === 0) {
          topItem = 0;
        }
      });

      this.el_.style.offsetWidth = this.options_.speed + playerWidth + 'px';
    }
  }, {
    key: 'moveTimeline',
    value: function moveTimeline() {
      var currentTime = Math.round(this.player_.currentTime());
      var duration = this.player_.duration();
      var position = this.options_.speed * currentTime / duration;
      _gsap.TweenLite.to(this.el_, 0.5, { scrollLeft: position, ease: _gsap.Linear.easeInOut });
    }
  }, {
    key: 'positionTopComments',
    value: function positionTopComments() {
      var _this3 = this;

      var timecode = Math.round(this.player_.currentTime());
      var topItem = 0;

      (0, _lodash.forEach)(this.items, function (item, key) {
        var inTimeCodeRange = item.timecode === timecode && item.timecode <= timecode + 10;
        //if (inTimeCodeRange && !item.hasClass('koment-show')) {
        item.addClass('koment-show');
        item.el_.style.right = -item.width() + 'px';
        item.el_.style.top = topItem + 'px';
        topItem += item.height() + _this3.options_.itemGap;
        if (key % _this3.options_.itemsInSceen === 0) {
          topItem = 0;
        }

        //}
      });
    }
  }]);

  return KomentDisplay;
})(_component2['default']);

KomentDisplay.prototype.options_ = {
  url: 'https://afr-api-v1-staging.herokuapp.com/api/videos/c1ee3b32-0bf8-4873-b173-09dc055b7bfe/comments',
  itemsInSceen: 3,
  itemGap: 20,
  speed: 5000
};

_component2['default'].registerComponent('KomentDisplay', KomentDisplay);
exports['default'] = KomentDisplay;
module.exports = exports['default'];