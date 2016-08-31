/**
 * @file modal-dialog.js
 */
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

var _utilsDom = require('./utils/dom');

var Dom = _interopRequireWildcard(_utilsDom);

var _utilsFn = require('./utils/fn');

var Fn = _interopRequireWildcard(_utilsFn);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var MODAL_CLASS_NAME = 'koment-modal-dialog';
var ESC = 27;

/**
 * The `ModalDialog` displays over the video and its controls, which blocks
 * interaction with the player until it is closed.
 *
 * Modal dialogs include a "Close" button and will close when that button
 * is activated - or when ESC is pressed anywhere.
 *
 * @extends Component
 * @class ModalDialog
 */

var ModalDialog = (function (_Component) {
  _inherits(ModalDialog, _Component);

  /**
   * Constructor for modals.
   *
   * @param  {Player} player
   * @param  {Object} [options]
   * @param  {Mixed} [options.content=undefined]
   *         Provide customized content for this modal.
   *
   * @param  {String} [options.description]
   *         A text description for the modal, primarily for accessibility.
   *
   * @param  {Boolean} [options.fillAlways=false]
   *         Normally, modals are automatically filled only the first time
   *         they open. This tells the modal to refresh its content
   *         every time it opens.
   *
   * @param  {String} [options.label]
   *         A text label for the modal, primarily for accessibility.
   *
   * @param  {Boolean} [options.temporary=true]
   *         If `true`, the modal can only be opened once; it will be
   *         disposed as soon as it's closed.
   *
   * @param  {Boolean} [options.uncloseable=false]
   *         If `true`, the user will not be able to close the modal
   *         through the UI in the normal ways. Programmatic closing is
   *         still possible.
   *
   */

  function ModalDialog(player, options) {
    _classCallCheck(this, ModalDialog);

    _get(Object.getPrototypeOf(ModalDialog.prototype), 'constructor', this).call(this, player, options);
    this.opened_ = this.hasBeenOpened_ = this.hasBeenFilled_ = false;

    this.closeable(!this.options_.uncloseable);
    this.content(this.options_.content);

    // Make sure the contentEl is defined AFTER any children are initialized
    // because we only want the contents of the modal in the contentEl
    // (not the UI elements like the close button).
    this.contentEl_ = Dom.createEl('div', {
      className: MODAL_CLASS_NAME + '-content'
    }, {
      role: 'document'
    });

    this.descEl_ = Dom.createEl('p', {
      className: MODAL_CLASS_NAME + '-description koment-offscreen',
      id: this.el().getAttribute('aria-describedby')
    });

    Dom.textContent(this.descEl_, this.description());
    this.el_.appendChild(this.descEl_);
    this.el_.appendChild(this.contentEl_);
  }

  /*
   * Modal dialog default options.
   *
   * @type {Object}
   * @private
   */

  /**
   * Create the modal's DOM element
   *
   * @method createEl
   * @return {Element}
   */

  _createClass(ModalDialog, [{
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(ModalDialog.prototype), 'createEl', this).call(this, 'div', {
        className: this.buildCSSClass(),
        tabIndex: -1
      }, {
        'aria-describedby': this.id() + '_description',
        'aria-hidden': 'true',
        'aria-label': this.label(),
        'role': 'dialog'
      });
    }

    /**
     * Build the modal's CSS class.
     *
     * @method buildCSSClass
     * @return {String}
     */
  }, {
    key: 'buildCSSClass',
    value: function buildCSSClass() {
      return MODAL_CLASS_NAME + ' koment-hidden ' + _get(Object.getPrototypeOf(ModalDialog.prototype), 'buildCSSClass', this).call(this);
    }

    /**
     * Handles key presses on the document, looking for ESC, which closes
     * the modal.
     *
     * @method handleKeyPress
     * @param  {Event} e
     */
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(e) {
      if (e.which === ESC && this.closeable()) {
        this.close();
      }
    }

    /**
     * Returns the label string for this modal. Primarily used for accessibility.
     *
     * @return {String}
     */
  }, {
    key: 'label',
    value: function label() {
      return this.options_.label || this.localize('Modal Window');
    }

    /**
     * Returns the description string for this modal. Primarily used for
     * accessibility.
     *
     * @return {String}
     */
  }, {
    key: 'description',
    value: function description() {
      var desc = this.options_.description || this.localize('This is a modal window.');

      // Append a universal closeability message if the modal is closeable.
      if (this.closeable()) {
        desc += ' ' + this.localize('This modal can be closed by pressing the Escape key or activating the close button.');
      }

      return desc;
    }

    /**
     * Opens the modal.
     *
     * @method open
     * @return {ModalDialog}
     */
  }, {
    key: 'open',
    value: function open() {
      if (!this.opened_) {
        var player = this.player();

        this.trigger('beforemodalopen');
        this.opened_ = true;

        // Fill content if the modal has never opened before and
        // never been filled.
        if (this.options_.fillAlways || !this.hasBeenOpened_ && !this.hasBeenFilled_) {
          this.fill();
        }

        // If the player was playing, pause it and take note of its previously
        // playing state.
        this.wasPlaying_ = !player.paused();

        if (this.wasPlaying_) {
          player.pause();
        }

        if (this.closeable()) {
          this.on(this.el_.ownerDocument, 'keydown', Fn.bind(this, this.handleKeyPress));
        }

        player.controls(false);
        this.show();
        this.el().setAttribute('aria-hidden', 'false');
        this.trigger('modalopen');
        this.hasBeenOpened_ = true;
      }
      return this;
    }

    /**
     * Whether or not the modal is opened currently.
     *
     * @method opened
     * @param  {Boolean} [value]
     *         If given, it will open (`true`) or close (`false`) the modal.
     *
     * @return {Boolean}
     */
  }, {
    key: 'opened',
    value: function opened(value) {
      if (typeof value === 'boolean') {
        this[value ? 'open' : 'close']();
      }
      return this.opened_;
    }

    /**
     * Closes the modal.
     *
     * @method close
     * @return {ModalDialog}
     */
  }, {
    key: 'close',
    value: function close() {
      if (this.opened_) {
        var player = this.player();

        this.trigger('beforemodalclose');
        this.opened_ = false;

        if (this.wasPlaying_) {
          player.play();
        }

        if (this.closeable()) {
          this.off(this.el_.ownerDocument, 'keydown', Fn.bind(this, this.handleKeyPress));
        }

        player.controls(true);
        this.hide();
        this.el().setAttribute('aria-hidden', 'true');
        this.trigger('modalclose');

        if (this.options_.temporary) {
          this.dispose();
        }
      }
      return this;
    }

    /**
     * Whether or not the modal is closeable via the UI.
     *
     * @method closeable
     * @param  {Boolean} [value]
     *         If given as a Boolean, it will set the `closeable` option.
     *
     * @return {Boolean}
     */
  }, {
    key: 'closeable',
    value: function closeable(value) {
      if (typeof value === 'boolean') {
        var closeable = this.closeable_ = !!value;
        var _close = this.getChild('closeButton');

        // If this is being made closeable and has no close button, add one.
        if (closeable && !_close) {

          // The close button should be a child of the modal - not its
          // content element, so temporarily change the content element.
          var temp = this.contentEl_;

          this.contentEl_ = this.el_;
          _close = this.addChild('closeButton', { controlText: 'Close Modal Dialog' });
          this.contentEl_ = temp;
          this.on(_close, 'close', this.close);
        }

        // If this is being made uncloseable and has a close button, remove it.
        if (!closeable && _close) {
          this.off(_close, 'close', this.close);
          this.removeChild(_close);
          _close.dispose();
        }
      }
      return this.closeable_;
    }

    /**
     * Fill the modal's content element with the modal's "content" option.
     *
     * The content element will be emptied before this change takes place.
     *
     * @method fill
     * @return {ModalDialog}
     */
  }, {
    key: 'fill',
    value: function fill() {
      return this.fillWith(this.content());
    }

    /**
     * Fill the modal's content element with arbitrary content.
     *
     * The content element will be emptied before this change takes place.
     *
     * @method fillWith
     * @param  {Mixed} [content]
     *         The same rules apply to this as apply to the `content` option.
     *
     * @return {ModalDialog}
     */
  }, {
    key: 'fillWith',
    value: function fillWith(content) {
      var contentEl = this.contentEl();
      var parentEl = contentEl.parentNode;
      var nextSiblingEl = contentEl.nextSibling;

      this.trigger('beforemodalfill');
      this.hasBeenFilled_ = true;

      // Detach the content element from the DOM before performing
      // manipulation to avoid modifying the live DOM multiple times.
      parentEl.removeChild(contentEl);
      this.empty();
      Dom.insertContent(contentEl, content);
      this.trigger('modalfill');

      // Re-inject the re-filled content element.
      if (nextSiblingEl) {
        parentEl.insertBefore(contentEl, nextSiblingEl);
      } else {
        parentEl.appendChild(contentEl);
      }

      return this;
    }

    /**
     * Empties the content element.
     *
     * This happens automatically anytime the modal is filled.
     *
     * @method empty
     * @return {ModalDialog}
     */
  }, {
    key: 'empty',
    value: function empty() {
      this.trigger('beforemodalempty');
      Dom.emptyEl(this.contentEl());
      this.trigger('modalempty');
      return this;
    }

    /**
     * Gets or sets the modal content, which gets normalized before being
     * rendered into the DOM.
     *
     * This does not update the DOM or fill the modal, but it is called during
     * that process.
     *
     * @method content
     * @param  {Mixed} [value]
     *         If defined, sets the internal content value to be used on the
     *         next call(s) to `fill`. This value is normalized before being
     *         inserted. To "clear" the internal content value, pass `null`.
     *
     * @return {Mixed}
     */
  }, {
    key: 'content',
    value: function content(value) {
      if (typeof value !== 'undefined') {
        this.content_ = value;
      }
      return this.content_;
    }
  }]);

  return ModalDialog;
})(_component2['default']);

ModalDialog.prototype.options_ = {
  temporary: true
};

_component2['default'].registerComponent('ModalDialog', ModalDialog);
exports['default'] = ModalDialog;
module.exports = exports['default'];