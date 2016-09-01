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
 * @class PostCommentBox
 */

var PostCommentBox = (function (_Component) {
  _inherits(PostCommentBox, _Component);

  function PostCommentBox(player, options, ready) {
    _classCallCheck(this, PostCommentBox);

    _get(Object.getPrototypeOf(PostCommentBox.prototype), 'constructor', this).call(this, player, options, ready);
  }

  _createClass(PostCommentBox, [{
    key: 'createEl',
    value: function createEl() {

      return _get(Object.getPrototypeOf(PostCommentBox.prototype), 'createEl', this).call(this, 'div', {
        className: 'kmt-post-box-comments-input'
      }, {
        contenteditable: true,
        ariaMultiline: false,
        maxlength: 140,
        dataPlaceholderDefault: 'Add your comment here...'
      });
      //innerHTML: '<div class="kmt-post-box-comments-box"><div class="kmt-post-box-comments-input" contenteditable="true" aria-multiline="true" maxlength="120" data-placeholder-default="Add your comment here..."></div><span className="kmt-message-length">0/120</span></div>'
    }
  }]);

  return PostCommentBox;
})(_componentJs2['default']);

_componentJs2['default'].registerComponent('PostCommentBox', PostCommentBox);
exports['default'] = PostCommentBox;
module.exports = exports['default'];