/**
 * @file koment-toggle.js
 */
import window from 'global/window';
import document from 'global/document';
import videojs from'video.js';
import './post-comment-box';

let Component = videojs.getComponent('Component');
let Button = videojs.getComponent('Button');
const key = {
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
}
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
class PostCommentBox extends Component {

  constructor (player, options, ready) {
    super(player, options, ready);
    this.on(player, 'submit', this.onSubmit);
    this.on('keydown', this.handleKeyDown);
    this.on('keyup', this.handleKeyUp);
  }

  clear () {
    this.inputEl.innerHTML = '';
  }

  setCursorEnd () {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(this.inputEl, 1);
    range.selectNodeContents(this.inputEl);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   *
   * @param {String} [value]
   * @returns {Medium}
   */
  value (value) {
    this.inputEl.focus();
    if (typeof value !== 'undefined') {
      this.inputEl.textContent = value;
    } else {
      return this.inputEl.textContent;
    }

  }

  handleKeyUp (e) {
    let max = this.options_.max;
    let value = this.value();
    let length = value.length;
    this.spanEl.innerHTML = `${length} / ${max}`;
  }

  handleKeyDown (e) {
    e = e || w.event;
    //in Chrome it sends out this event before every regular event, not sure why
    if (e.keyCode === 229) return;
    let exit;
    let max = this.options_.max;
    let value = this.value();
    switch (e.keyCode) {
      case key['enter']:
        e.preventDefault();
        this.player_.trigger('submit');
        break;
      case key['escape']:
        e.preventDefault();
        break;
      case key['backspace']:
      case key['delete']:
        e.preventDefault();
        var sel = window.getSelection();
        this.value(value.substring(0, Math.min(value.length - 1, sel.focusOffset)));
        this.setCursorEnd();
        exit = true;
        break
    }
    if (exit) {
      return;
    }

    value = this.encodeHtml(value);
    value = this.parseHtml(value);
    let totalLength = value.length;
    if (totalLength >= max) {
      e.preventDefault();
    }
  }

  encodeHtml (html) {
    return document.createElement('a').appendChild(
      document.createTextNode(html)).parentNode.innerHTML;
  }

  validate (html) {
    let max = this.options_.max;
    var length = html.length;
    if (length > max || length < 1) {
      return this.addClass('-error');
    }
    if (this.hasClass('-error')) {
      return this.removeClass('-error');
    }
  }


  parseHtml (html) {
    html = html.replace(/&nbsp;/g, ' ');
    html = html.replace(/<br(\s*)\/*>/ig, '\r\n'); // replace br for newlines
    html = html.replace(/<[div>]+>/ig, '\r\n'); // replace div for newlines
    html = html.replace(/<\/[div>]+>/gm, ''); // remove remaining divs
    html = html.replace(/\r\n$/, ''); // remove last newline

    html = html.replace(/<\S[^><]*>/g, '');

    return html;
  }

  onSubmit () {
    const message = this.value();
    const timecode = Math.round(this.player_.currentTime());
    const user = this.player_.koment.options_.user;
    this.clear();
    this.player_.koment.sendKoment({message, timecode, user})
  }

  createEl () {

    const el = super.createEl('div', {
      className: 'kmt-post-box-comments'
    });

    this.inputEl = super.createEl('div', {
      className: 'kmt-post-box-comments-input'
    }, {
      'contenteditable': true,
      'aria-multiline': false,
      'max-length': 140,
      'data-placeHolder-default': this.localize('Add your comment here...')
    });

    this.spanEl = super.createEl('div', {
      className: 'kmt-message-length',
      innerHtml: '0 / 140'
    });

    el.appendChild(this.inputEl);
    el.appendChild(this.spanEl);
    return el;
  }

}

PostCommentBox.prototype.options_ = {
  max: 140
};

Component.registerComponent('PostCommentBox', PostCommentBox);
export default PostCommentBox;
