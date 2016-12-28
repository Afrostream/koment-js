/**
 * @file list-button.js
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

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _komentButton = require('./koment-button');

var _komentButton2 = _interopRequireDefault(_komentButton);

/**
 * The button component for toggling and selecting koment
 * Chapters act much differently than other text tracks
 * Cues are navigation vs. other tracks of alternative languages
 *
 * @param {Object} player  Player object
 * @param {Object=} options Object of option names and values
 * @param {Function=} ready    Ready callback function
 * @extends Button
 * @class ListButton
 */

var Component = _videoJs2['default'].getComponent('Component');

var ListButton = (function (_KomentButton) {
  _inherits(ListButton, _KomentButton);

  function ListButton(player, options, ready) {
    _classCallCheck(this, ListButton);

    _get(Object.getPrototypeOf(ListButton.prototype), 'constructor', this).call(this, player, options, ready);
    this.on(this.player_, 'kmtlistfetched', this.update);
    this.on(this.player_, 'komentsupdated', this.update);
  }

  /**
   * Allow sub components to stack CSS class names
   *
   * @return {String} The constructed class name
   * @method buildCSSClass
   */

  _createClass(ListButton, [{
    key: 'buildCSSClass',
    value: function buildCSSClass() {
      return 'list-button vjs-hidden ' + _get(Object.getPrototypeOf(ListButton.prototype), 'buildCSSClass', this).call(this);
    }

    /**
     * Update progress bar
     *
     * @method update
     */
  }, {
    key: 'update',
    value: function update() {
      var items = this.player_.koment.komentsList();
      if (items && items.length) {
        this.show();
      } else {
        this.hide();
      }
    }

    /**
     * Handle click on text track
     *
     * @method handleClick
     */
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      _get(Object.getPrototypeOf(ListButton.prototype), 'handleClick', this).call(this, event);
      this.addClass('active');
      this.setTimeout(this.disable, 300);
      this.player_.koment.toggleList();
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.removeClass('active');
    }
  }]);

  return ListButton;
})(_komentButton2['default']);

ListButton.prototype.controlText_ = 'List';

Component.registerComponent('ListButton', ListButton);
exports['default'] = ListButton;
module.exports = exports['default'];