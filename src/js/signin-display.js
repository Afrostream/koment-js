/**
 * @file signin-display.js
 */
import * as Dom from './utils/dom.js';
import Component from './component';
import ModalDialog from './modal-dialog';
import mergeOptions from './utils/merge-options';

/**
 * Display that an error has occurred making the video unplayable.
 *
 * @extends ModalDialog
 * @class SigninDisplay
 */
class SigninDisplay extends ModalDialog {

  /**
   * Constructor for error display modal.
   *
   * @param  {Player} player
   * @param  {Object} [options]
   */
  constructor (player, options) {
    super(player, options);
    this.on(player, 'signinpopup', this.open);
  }

  /**
   * Include the old class for backward-compatibility.
   *
   * This can be removed in 6.0.
   *
   * @method buildCSSClass
   * @deprecated
   * @return {String}
   */
  buildCSSClass () {
    return `koment-signin-display ${super.buildCSSClass()}`;
  }

  /**
   * Generates the modal content based on the player error.
   *
   * @return {String|Null}
   */
  content () {
    return Dom.createEl('iframe', {
      src: 'signup.html',
      frameBorder: 0,
      allowTransparency: true
    });
  }
}

SigninDisplay.prototype.options_ = mergeOptions(ModalDialog.prototype.options_, {
  fillAlways: true,
  temporary: false,
  uncloseable: false
});

Component.registerComponent('SigninDisplay', SigninDisplay);
export default SigninDisplay;
