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

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _componentJs = require('../../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

require('./post-comment-box');

var key = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause': 19,
  'capsLock': 20,
  'escape': 27,
  'pageUp': 33,
  'pageDown': 34,
  'end': 35,
  'home': 36,
  'leftArrow': 37,
  'upArrow': 38,
  'rightArrow': 39,
  'downArrow': 40,
  'insert': 45,
  'delete': 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'a': 65,
  'b': 66,
  'c': 67,
  'd': 68,
  'e': 69,
  'f': 70,
  'g': 71,
  'h': 72,
  'i': 73,
  'j': 74,
  'k': 75,
  'l': 76,
  'm': 77,
  'n': 78,
  'o': 79,
  'p': 80,
  'q': 81,
  'r': 82,
  's': 83,
  't': 84,
  'u': 85,
  'v': 86,
  'w': 87,
  'x': 88,
  'y': 89,
  'z': 90,
  'leftWindow': 91,
  'rightWindowKey': 92,
  'select': 93,
  'numpad0': 96,
  'numpad1': 97,
  'numpad2': 98,
  'numpad3': 99,
  'numpad4': 100,
  'numpad5': 101,
  'numpad6': 102,
  'numpad7': 103,
  'numpad8': 104,
  'numpad9': 105,
  'multiply': 106,
  'add': 107,
  'subtract': 109,
  'decimalPoint': 110,
  'divide': 111,
  'f1': 112,
  'f2': 113,
  'f3': 114,
  'f4': 115,
  'f5': 116,
  'f6': 117,
  'f7': 118,
  'f8': 119,
  'f9': 120,
  'f10': 121,
  'f11': 122,
  'f12': 123,
  'numLock': 144,
  'scrollLock': 145,
  'semiColon': 186,
  'equalSign': 187,
  'comma': 188,
  'dash': 189,
  'period': 190,
  'forwardSlash': 191,
  'graveAccent': 192,
  'openBracket': 219,
  'backSlash': 220,
  'closeBracket': 221,
  'singleQuote': 222
};
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
    this.on(player, 'submit', this.onSubmit);
    this.on('keydown', this.handleKeyDown);
    this.on('keyup', this.handleKeyUp);
  }

  _createClass(PostCommentBox, [{
    key: 'clear',
    value: function clear() {
      this.inputEl.innerHTML = '';
    }

    /**
     *
     * @param {String} [value]
     * @returns {Medium}
     */
  }, {
    key: 'value',
    value: function value(_value) {
      this.inputEl.focus();
      if (typeof _value !== 'undefined') {
        this.inputEl.textContent = _value;
      } else {
        return this.inputEl.textContent;
      }
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(e) {
      var max = this.options_.max;
      var value = this.value();
      var length = value.length;
      this.spanEl.innerHTML = length + ' / ' + max;
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      e = e || w.event;
      //in Chrome it sends out this event before every regular event, not sure why
      if (e.keyCode === 229) return;

      switch (e.keyCode) {
        case key['enter']:
          e.preventDefault();
          break;
        case key['escape']:
          e.preventDefault();
          break;
        case key['backspace']:
        case key['delete']:
          return;
          break;
      }

      var max = this.options_.max;
      var value = this.value();
      value = this.encodeHtml(value);
      value = this.parseHtml(value);
      var length = value.length;
      var totalLength = value.length;
      if (totalLength >= max) {
        value = value.substring(0, max - length);
        e.preventDefault();
      }
      //this.value(value);
    }
  }, {
    key: 'encodeHtml',
    value: function encodeHtml(html) {
      return _globalDocument2['default'].createElement('a').appendChild(_globalDocument2['default'].createTextNode(html)).parentNode.innerHTML;
    }
  }, {
    key: 'validate',
    value: function validate(html) {
      var max = this.options_.max;
      var length = html.length;
      if (length > max || length < 1) {
        return this.addClass('-error');
      }
      if (this.hasClass('-error')) {
        return this.removeClass('-error');
      }
    }
  }, {
    key: 'parseHtml',
    value: function parseHtml(html) {
      html = html.replace(/&nbsp;/g, ' ');
      html = html.replace(/<br(\s*)\/*>/ig, '\r\n'); // replace br for newlines
      html = html.replace(/<[div>]+>/ig, '\r\n'); // replace div for newlines
      html = html.replace(/<\/[div>]+>/gm, ''); // remove remaining divs
      html = html.replace(/\r\n$/, ''); // remove last newline

      html = html.replace(/<\S[^><]*>/g, '');

      return html;
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit() {
      var text = this.value();
      var timecode = this.player_.currentTime();
      this.clear();
      this.player_.sendKoment({ text: text, timecode: timecode });
    }
  }, {
    key: 'createEl',
    value: function createEl() {

      var el = _get(Object.getPrototypeOf(PostCommentBox.prototype), 'createEl', this).call(this, 'div', {
        className: 'kmt-post-box-comments'
      });

      this.inputEl = _get(Object.getPrototypeOf(PostCommentBox.prototype), 'createEl', this).call(this, 'div', {
        className: 'kmt-post-box-comments-input'
      }, {
        'contenteditable': true,
        'aria-multiline': false,
        'max-length': 140,
        'data-placeHolder-default': 'Add your comment here...'
      });
      //innerHTML: '<div class="kmt-post-box-comments-box"><div class="kmt-post-box-comments-input" contenteditable="true" aria-multiline="true" maxlength="120" data-placeholder-default="Add your comment here..."></div><span className="kmt-message-length">0/120</span></div>'
      this.spanEl = _get(Object.getPrototypeOf(PostCommentBox.prototype), 'createEl', this).call(this, 'div', {
        className: 'kmt-message-length',
        innerHtml: '0 / 140'
      });
      el.appendChild(this.inputEl);
      el.appendChild(this.spanEl);
      return el;
    }
  }]);

  return PostCommentBox;
})(_componentJs2['default']);

PostCommentBox.prototype.options_ = {
  max: 140
};

_componentJs2['default'].registerComponent('PostCommentBox', PostCommentBox);
exports['default'] = PostCommentBox;
module.exports = exports['default'];