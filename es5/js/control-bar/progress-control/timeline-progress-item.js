/**
 * @file timeline-progress-item.js
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

var _utilsDom = require('../../utils/dom');

var Dom = _interopRequireWildcard(_utilsDom);

var _clickableComponentJs = require('../../clickable-component.js');

var _clickableComponentJs2 = _interopRequireDefault(_clickableComponentJs);

var _componentJs = require('../../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

/**
 * Container of main controls
 *
 * @extends Component
 * @class ControlBar
 */

var TimelineProgressItem = (function (_ClickableComponent) {
  _inherits(TimelineProgressItem, _ClickableComponent);

  function TimelineProgressItem(player, options) {
    _classCallCheck(this, TimelineProgressItem);

    _get(Object.getPrototypeOf(TimelineProgressItem.prototype), 'constructor', this).call(this, player, options);
    this.timecode = this.options_.timecode;
    this.user = this.options_.user;
    this.update();
  }

  /**
   * Event handler for updates to the player's poster source
   *
   * @method update
   */

  _createClass(TimelineProgressItem, [{
    key: 'update',
    value: function update() {
      var url = this.user.picture;

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

      var el = _get(Object.getPrototypeOf(TimelineProgressItem.prototype), 'createEl', this).call(this, 'div', {
        className: 'kmt-timeline-progress-item'
      });

      this.avatarEl_ = Dom.createEl('div', {
        className: 'koment-item-avatar'
      }, {
        'aria-live': 'off'
      });

      el.appendChild(this.avatarEl_);
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
  }, {
    key: 'handleClick',
    value: function handleClick() {
      this.player_.currentTime(this.timecode);
    }
  }]);

  return TimelineProgressItem;
})(_clickableComponentJs2['default']);

TimelineProgressItem.prototype.timecode = 0;
TimelineProgressItem.prototype.options_ = {
  timecode: 0,
  user: {
    picture: ''
  }
};

_componentJs2['default'].registerComponent('TimelineProgressItem', TimelineProgressItem);
exports['default'] = TimelineProgressItem;
module.exports = exports['default'];