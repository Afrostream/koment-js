/**
 * @file signin-display.js
 */
import * as Dom from './utils/dom.js';
import Component from './component';
import window from 'global/window';
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
    this.on(window, 'message', this.onPostMessageHandler.bind(this));
  }

  onPostMessageHandler (event) {
    console.log('received response:  ', event.data, event.origin);
    if (!~event.origin.indexOf(this.options_.host)) return;
    this.close();
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
      src: `signup.html?host=${this.options_.host + this.options_.path}`,
      frameBorder: 0,
      allowTransparency: true
    });
  }
}

SigninDisplay.prototype.options_ = mergeOptions(ModalDialog.prototype.options_, {
  fillAlways: true,
  temporary: false,
  uncloseable: false,
  host: 'http://localhost:4141',
  path: '/api/users'
});

Component.registerComponent('SigninDisplay', SigninDisplay);
export default SigninDisplay;
