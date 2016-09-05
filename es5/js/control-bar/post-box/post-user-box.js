/**
 * @file koment-toggle.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilsToTitleCase = require('../../utils/to-title-case');

var _utilsToTitleCase2 = _interopRequireDefault(_utilsToTitleCase);

var _componentJs = require('../../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

require('./post-comment-box');

/**
 * The button component for toggling and selecting koment
 * Chapters act much differently than other text tracks
 * Cues are navigation vs. other tracks of alternative languages
 *
 * @param {Object} player  Player object
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready    Ready callback function
 * @extends Component
 * @class PostUserBox
 */

var PostUsedrBox = (function (_Component) {
  _inherits(PostUsedrBox, _Component);

  function PostUsedrBox(player, options, ready) {
    _classCallCheck(this, PostUsedrBox);

    _get(Object.getPrototypeOf(PostUsedrBox.prototype), 'constructor', this).call(this, player, options, ready);
    this.update();
  }

  /**
   * Event handler for updates to the player's poster source
   *
   * @method update
   */

  _createClass(PostUsedrBox, [{
    key: 'update',
    value: function update() {
      var url = this.player_.options_.avatar;

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

      this.el_.style.backgroundImage = backgroundImage;
    }
  }, {
    key: 'createEl',
    value: function createEl() {

      var el = _get(Object.getPrototypeOf(PostUsedrBox.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-avatar'
      }, {
        'aria-live': 'off'
      });

      return el;
    }
  }]);

  return PostUsedrBox;
})(_componentJs2['default']);

_componentJs2['default'].registerComponent('PostUserBox', PostUserBox);
exports['default'] = PostUserBox;
module.exports = exports['default'];