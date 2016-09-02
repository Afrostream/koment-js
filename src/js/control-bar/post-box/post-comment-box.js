/**
 * @file koment-toggle.js
 */
import toTitleCase from '../../utils/to-title-case'

import Component from '../../component.js';
import './post-comment-box';

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
    this.on('keyup', this.read);
  }

  read () {
    let over = '';
    let max = this.options_.max;
    let text = this.el_.innerHTML;
    text = this.parseHtml(text);
    let textSize = text.length;
    if (textSize >= 140) {
      over = text.substr(max);
      over = '<span class="highlight">' + over + '</span>';
    }
    this.validate(text);
    this.spanEl.innerHTML = `${textSize} / ${max}`;
    let replacement = this.el_.innerHTML.substr(0, max) + over;
    this.el_.innerHTML = replacement;
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
    const text = this.el_.innerHTML;
    const timecode = this.player_.currentTime();
    this.el_.innerHTML = '';
    this.player_.sendKoment({text, timecode})
  }

  createEl () {

    let el = super.createEl('div', {
      className: 'kmt-post-box-comments-input'
    }, {
      'contenteditable': true,
      'aria-multiline': false,
      'max-length': 140,
      'data-placeHolder-default': 'Add your comment here...'
    });
    //innerHTML: '<div class="kmt-post-box-comments-box"><div class="kmt-post-box-comments-input" contenteditable="true" aria-multiline="true" maxlength="120" data-placeholder-default="Add your comment here..."></div><span className="kmt-message-length">0/120</span></div>'
    this.spanEl = super.createEl('div', {
      className: 'kmt-message-length',
      innerHtml: '0 / 140'
    });
    //el.appendChild(this.spanEl);
    return el;
  }

}

PostCommentBox.prototype.options_ = {
  max: 140
};

Component.registerComponent('PostCommentBox', PostCommentBox);
export default PostCommentBox;
