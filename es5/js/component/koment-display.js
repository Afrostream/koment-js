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
    _classCallCheck(this, KomentDisplay);

    _get(Object.getPrototypeOf(KomentDisplay.prototype), 'constructor', this).call(this, player, options);

    this.emitTapEvents();

    this.on('tap', this.handleClick);
    this.on('click', this.handleClick);
    this.on(player, 'loadedmetadata', this.initKoment);
  }

  _createClass(KomentDisplay, [{
    key: 'videoId',
    value: function videoId() {
      return this.player_.options_.videoId || this.player_.currentSrc();
    }
  }, {
    key: 'initKoment',
    value: function initKoment() {
      var _this = this;

      var videoId_ = this.videoId();
      this.data_ = {
        json: true,
        uri: this.player_.options_.api + '?video=' + videoId_,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      var kommentsList = [];
      (0, _xhr2['default'])(this.data_, function (err, res) {
        if (err) {
          throw new Error(err.message);
        }
        kommentsList = res.body || [];

        (0, _lodash.forEach)(kommentsList, function (item) {
          if (item.user && item.user.facebook) {
            item.user = (0, _lodash.merge)(item.user, {
              avatar: '//graph.facebook.com/' + item.user.facebook.id + '/picture',
              nickname: item.user.facebook.nickname
            });
          }
        });

        kommentsList = (0, _lodash.sortBy)(kommentsList, ['timecode']);

        _this.player_.komentsList(kommentsList);
        _this.player_.trigger('kmtlistfetched');
        _this.createChilds();
      });
    }
  }, {
    key: 'update',
    value: function update(e) {
      var item = e.data;
      var mi = new _komentItem2['default'](this.player_, item);
      this.items.unshift(mi);
      this.addChild(mi);
      this.requestTick(true);
      var json = (0, _lodash.pick)(item, ['timecode', 'message', 'user']);
      var videoId_ = this.videoId();
      json.video = videoId_;
      (0, _xhr2['default'])((0, _lodash.merge)(this.data_, {
        method: 'POST',
        video: this.videoId_,
        uri: '' + this.player_.options_.api,
        json: json
      }), function (err, res) {
        if (err) {
          throw new Error(err.message);
        }
        console.log('koment posted', res);
      });
    }

    /**
     * Handle Click - Override with specific functionality for component
     *
     * @method handleClick
     */
  }, {
    key: 'handleClick',
    value: function handleClick() {
      this.player_.toggleEdit(false);
      this.player_.toggleList(false);
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

      this.on(this.player_, 'timeupdate', this.requestTick);
      this.on(this.player_, 'pause', this.timeoutReplace);
      this.on(this.player_, 'play', this.timeoutReplace);

      this.on(this.player_, 'komentsupdated', this.update);
      this.on(this.player_, 'togglemenu', this.requestTick);

      this.addClass(this.options_.template);
    }
  }, {
    key: 'timeoutReplace',
    value: function timeoutReplace() {
      var _this2 = this;

      var currentTimecode = Math.round(this.player_.currentTime());
      var paused = this.player_.paused() && currentTimecode > 0;
      var visibleItems = (0, _lodash.filter)(this.items, function (item) {
        return item.hasClass('koment-show');
      });

      (0, _lodash.forEach)(visibleItems, function (item) {
        if (!paused) {
          item.timeout = item.setTimeout(item.hide, _this2.options_.tte * 1000);
        } else {
          item.clearTimeout(item.timeout);
        }
      });
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
    value: function requestTick(force) {
      if (force !== undefined) {
        this.ticking = !force;
      }
      if (!this.ticking) {
        requestAnimationFrame(Fn.bind(this, this.showElements));
        this.ticking = true;
      }
    }
  }, {
    key: 'showElements',
    value: function showElements() {
      var _this3 = this;

      var className = 'koment-show';
      var currentTimecode = Math.round(this.player_.currentTime());
      var visibleItems = (0, _lodash.filter)(this.items, function (item) {
        return item.hasClass(className);
      });
      var nbVisible = visibleItems.length;
      var filtereds = (0, _lodash.uniq)(this.items, function (item) {
        return Math.round(item.timecode);
      });

      filtereds = (0, _lodash.sortBy)(filtereds, 'timecode');
      filtereds = (0, _lodash.filter)(filtereds, function (item) {
        return Math.round(item.timecode) === currentTimecode;
      });
      filtereds = (0, _lodash.take)(filtereds, Math.max(0, this.options_.max - nbVisible));

      (0, _lodash.forEach)(filtereds, function (item) {
        if (!item.hasClass(className)) {
          item.addClass(className);
          item.show();
          item.timeout = item.setTimeout(item.hide, _this3.options_.tte * 1000);
        }
      });

      this.ticking = false;
    }
  }]);

  return KomentDisplay;
})(_component2['default']);

KomentDisplay.prototype.options_ = {
  tte: 5,
  max: 3,
  template: 'viki'
};

_component2['default'].registerComponent('KomentDisplay', KomentDisplay);
exports['default'] = KomentDisplay;
module.exports = exports['default'];