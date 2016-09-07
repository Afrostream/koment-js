/**
 * @file post-box.js
 */

import Component from '../../component.js';
import './post-comment-box';
import './post-submit-button';
import './post-user-box';

/**
 * The button component for toggling and selecting koment
 * Chapters act much differently than other text tracks
 * Cues are navigation vs. other tracks of alternative languages
 *
 * @param {Object} player  Player object
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready    Ready callback function
 * @extends Component
 * @class PostBox
 */
class PostBox extends Component {

  constructor (player, options, ready) {
    super(player, options, ready)
  }

  createEl () {
    return super.createEl('div', {
      className: 'kmt-post-box'
    });
  }

}

PostBox.prototype.options_ = {
  children: [
    'postUserBox',
    'postCommentBox',
    'postlimitBox',
    'postSubmitButton'
  ]
};

Component.registerComponent('PostBox', PostBox);
export default PostBox
