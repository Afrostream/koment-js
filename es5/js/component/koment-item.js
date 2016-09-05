/**
 * @file koment-item.js
 **/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilsDom = require('../utils/dom');

var Dom = _interopRequireWildcard(_utilsDom);

var _componentJs = require('../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

/**
 * Container of main controls
 *
 * @extends Component
 * @class ControlBar
 */

var KomentItem = (function (_Component) {
  _inherits(KomentItem, _Component);

  function KomentItem(player, options) {
    _classCallCheck(this, KomentItem);

    _get(Object.getPrototypeOf(KomentItem.prototype), 'constructor', this).call(this, player, options);
    this.timecode = this.options_.timecode;
    this.text = this.options_.text;
    this.update();
  }

  /**
   * Event handler for updates to the player's poster source
   *
   * @method update
   */

  _createClass(KomentItem, [{
    key: 'update',
    value: function update() {
      var url = this.options_.user.profile.avatar;

      this.setSrc(url);

      // If there's no poster source we should display:none on this component
      // so it's not still clickable or right-clickable
      if (url) {
        this.show();
      } else {
        this.hide();
      }
    }

    /**
     * Set the poster source depending on the display method
     *
     * @param {String} url The URL to the poster source
     * @method setSrc
     */
  }, {
    key: 'setSrc',
    value: function setSrc(url) {
      var backgroundImage = '';

      // Any falsey values should stay as an empty string, otherwise
      // this will throw an extra error
      if (url) {
        backgroundImage = 'url("' + url + '")';
      }

      this.avatarEl_.style.backgroundImage = backgroundImage;
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

      var el = _get(Object.getPrototypeOf(KomentItem.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-item koment-hidden'
      });
      var userName = '';

      var profile = this.options_.user && this.options_.user && this.options_.user.profile;
      if (profile && profile.nickname) {
        userName = '<div class="koment-item-user">' + profile.nickname + '</div>';
      }
      this.contentEl_ = Dom.createEl('div', {
        className: 'koment-item-display',
        innerHTML: userName + '<div class="koment-item-title">' + this.options_.text + '</div>'
      }, {
        'aria-live': 'off'
      });

      this.avatarEl_ = Dom.createEl('div', {
        className: 'koment-item-avatar'
      }, {
        'aria-live': 'off'
      });

      el.appendChild(this.avatarEl_);
      el.appendChild(this.contentEl_);
      return el;
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;

      if (this.hasClass('koment-show')) {
        this.removeClass('koment-show');
      }
      this.addClass('koment-mask');
      this.setTimeout(function () {
        if (_this.hasClass('koment-mask')) {
          _this.removeClass('koment-mask');
        }
        _this.addClass('koment-hidden');
      }, 500);
    }
  }]);

  return KomentItem;
})(_componentJs2['default']);

KomentItem.prototype.timecode = 0;
KomentItem.prototype.options_ = {
  text: '',
  timecode: 0,
  user: {
    profile: {
      nickname: ''
    }
  }
};

_componentJs2['default'].registerComponent('KomentItem', KomentItem);
exports['default'] = KomentItem;
module.exports = exports['default'];