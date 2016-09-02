/**
 * @file koment-display.js
 **/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _utilsFnJs = require('../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsDom = require('../utils/dom');

var Dom = _interopRequireWildcard(_utilsDom);

var _xhr = require('xhr');

var _xhr2 = _interopRequireDefault(_xhr);

var _lodash = require('lodash');

var _komentItem = require('./koment-item');

var _komentItem2 = _interopRequireDefault(_komentItem);

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

    this.emitTapEvents();

    this.on('tap', this.handleClick);
    this.on('click', this.handleClick);

    var data = {
      json: true,
      uri: this.options_.url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    var kommentsList = [];
    var tc = 0;
    (0, _xhr2['default'])(data, function (err, res) {
      if (err) {
        throw new Error(err.message);
      }
      kommentsList = res.body || [];

      //  forEach(res.body || [], (item)=> {
      //    forEach(res.body || [], ()=> {
      //      let copyItem = clone(item)
      //      copyItem.timecode = tc;//Math.round(Math.random() * (352 - 0) + 0);
      //      kommentsList.push(copyItem)
      //      tc += 0.2
      //    })
      //  });
      var dummyText = 'totocavamoiouibientotocavtotocavamoiouibientotocavamoiouibientotocavamoiouibientotocavamoiouibienamoiouibien totocavamoiouibien totocavamoiouibien et toi';
      for (var i = 0; i < 50; i++) {
        kommentsList.push({
          text: dummyText.substring(0, Math.random() * (dummyText.length - 0) + 0),
          timecode: Math.round(Math.random() * (352 - 0) + 0)
        });
      }
      kommentsList.push({
        text: 'yes c\'est la fin',
        timecode: 345
      });
      kommentsList = (0, _lodash.sortBy)(kommentsList, ['timecode']);

      _this.player_.komentsList(kommentsList);
      _this.createChilds();
    });
  }

  /**
   * Handle Click - Override with specific functionality for component
   *
   * @method handleClick
   */

  _createClass(KomentDisplay, [{
    key: 'handleClick',
    value: function handleClick() {
      this.player_.toggleEdit(false);
    }

    /**
     * Create the component's DOM element
     *
     * @return {Element}
     * @method createEl
     */
  }, {
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(KomentDisplay.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-display',
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
      this.requestTick();
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

      switch (this.options_.template) {
        case 'timeline':
          this.showElements = this.showElementsTimeline;
          this.on(this.player_, 'loadedmetadata', this.positionTimeline);
          this.on(this.player_, 'pause', this.replaceTick);
          this.on(this.player_, 'play', this.replaceTick);
          this.on(this.player_, 'seeked', this.requestTick);
          this.on(this.player_, 'timeupdate', this.requestTick);
          break;
        case 'viki':
          this.showElements = this.showElementsViki;
          this.on(this.player_, 'timeupdate', this.requestTick);
          break;
      }

      this.on(this.player_, 'komentsupdated', this.update);

      this.addClass(this.options_.template);
    }
  }, {
    key: 'replaceTick',
    value: function replaceTick() {
      this.showElements();
    }

    /**
     * Calls rAF if it's not already
     * been done already
     */
  }, {
    key: 'requestTick',
    value: function requestTick() {
      if (!this.ticking) {
        requestAnimationFrame(Fn.bind(this, this.showElements));
        this.ticking = true;
      }
    }

    //VIKI MODE
  }, {
    key: 'showElementsViki',
    value: function showElementsViki() {
      var _this2 = this;

      var className = 'koment-show';
      var currentTimecode = Math.round(this.player_.currentTime());
      var nbVisible = (0, _lodash.filter)(this.items, function (item) {
        return item.hasClass(className);
      });
      var filtereds = (0, _lodash.uniq)(this.items, function (item) {
        return Math.round(item.timecode);
      });
      filtereds = (0, _lodash.filter)(filtereds, function (item) {
        return Math.round(item.timecode) === currentTimecode;
      });
      filtereds = (0, _lodash.slice)(filtereds, Math.min(2, nbVisible.length));
      (0, _lodash.forEach)(filtereds, function (item) {
        if (!item.hasClass(className)) {
          item.show();
          item.addClass(className);
          item.setTimeout(item.hide, _this2.options_.tte * 1000);
        }
      });

      this.ticking = false;
    }

    //TIMELINE MODE
  }, {
    key: 'showElementsTimeline',
    value: function showElementsTimeline() {
      var _this3 = this;

      var className = this.pause ? 'koment-paused' : 'koment-show';
      var currentTimecode = this.player_.currentTime();
      var playerWidth = this.player_.width();
      var positionGap = this.options_.tte + 5;
      (0, _lodash.forEach)(this.items, function (item) {
        var inTimeCodeRange = item.timecode <= currentTimecode + positionGap && item.timecode >= currentTimecode - positionGap;
        if (inTimeCodeRange) {
          var percent = (_this3.options_.tte - (currentTimecode - item.timecode)) / _this3.options_.tte;
          var position = percent * playerWidth - playerWidth;
          var _top = 0;
          if (!item.hasClass(className)) {
            item.removeClass('koment-mask');
            item.removeClass('koment-show');
            item.removeClass('koment-paused');
            item.addClass(className);
          }
          item.el_.style.webkitTransform = 'translate3d(' + position + 'px, ' + _top + 'px, 0)';
        } else {
          if (!item.hasClass('koment-mask')) {
            item.removeClass('koment-paused');
            item.removeClass('koment-show');
            item.addClass('koment-mask');
          }
        }
      });
      this.ticking = false;
    }
  }, {
    key: 'positionTimeline',
    value: function positionTimeline() {
      var _this4 = this;

      var leftItem = 0;
      var playerWidth = this.player_.width();
      (0, _lodash.forEach)(this.items, function (item, key) {
        var prevItem = _this4.items[key - 1];
        var percent = (_this4.options_.tte - item.timecode) / _this4.options_.tte;
        var position = playerWidth - percent * playerWidth;
        var top = 0;

        if (prevItem) {
          var prevItemPos = Dom.findElPosition(prevItem.el_);
          prevItemPos.width = prevItem.width();
          prevItemPos.height = prevItem.height();

          var percentPrevItem = (_this4.options_.tte - prevItem.timecode) / _this4.options_.tte;
          var positionPrevItem = playerWidth - percentPrevItem * playerWidth;
          if (positionPrevItem + prevItemPos.width > position) {
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
  }]);

  return KomentDisplay;
})(_component2['default']);

KomentDisplay.prototype.showElements = function () {};

KomentDisplay.prototype.options_ = {
  url: 'https://afr-api-v1-staging.herokuapp.com/api/videos/c1ee3b32-0bf8-4873-b173-09dc055b7bfe/comments',
  tte: 5,
  template: 'viki' //'timeline'
};

_component2['default'].registerComponent('KomentDisplay', KomentDisplay);
exports['default'] = KomentDisplay;
module.exports = exports['default'];