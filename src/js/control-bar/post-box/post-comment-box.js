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
  }

  onSubmit () {
    const text = this.el_.innerHTML;
    const timecode = this.player_.currentTime();
    this.el_.innerHTML = '';
    this.player_.sendKoment({text, timecode})
  }

  createEl () {

    return super.createEl('div', {
      className: 'kmt-post-box-comments-input'
    }, {
      contenteditable: true,
      ariaMultiline: false,
      maxlength: 140,
      dataPlaceholderDefault: 'Add your comment here...'
    });
    //innerHTML: '<div class="kmt-post-box-comments-box"><div class="kmt-post-box-comments-input" contenteditable="true" aria-multiline="true" maxlength="120" data-placeholder-default="Add your comment here..."></div><span className="kmt-message-length">0/120</span></div>'
  }

}

Component.registerComponent('PostCommentBox', PostCommentBox);
export default PostCommentBox
