/**
 * @file play-progress-bar.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _componentJs = require('../../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

var _utilsFnJs = require('../../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsFormatTimeJs = require('../../utils/format-time.js');

var _utilsFormatTimeJs2 = _interopRequireDefault(_utilsFormatTimeJs);

/**
 * Shows play progress
 *
 * @param {Player|Object} player
 * @param {Object=} options
 * @extends Component
 * @class PlayProgressBar
 */

var PlayProgressBar = (function (_Component) {
  _inherits(PlayProgressBar, _Component);

  function PlayProgressBar(player, options) {
    _classCallCheck(this, PlayProgressBar);

    _get(Object.getPrototypeOf(PlayProgressBar.prototype), 'constructor', this).call(this, player, options);
    this.updateDataAttr();
    this.on(player, 'timeupdate', this.updateDataAttr);
    player.ready(Fn.bind(this, this.updateDataAttr));

    if (options.playerOptions && options.playerOptions.controlBar && options.playerOptions.controlBar.progressControl && options.playerOptions.controlBar.progressControl.keepTooltipsInside) {
      this.keepTooltipsInside = options.playerOptions.controlBar.progressControl.keepTooltipsInside;
    }

    if (this.keepTooltipsInside) {
      this.addClass('koment-keep-tooltips-inside');
    }
  }

  /**
   * Create the component's DOM element
   *
   * @return {Element}
   * @method createEl
   */

  _createClass(PlayProgressBar, [{
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(PlayProgressBar.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-play-progress koment-slider-bar',
        innerHTML: '<span class="koment-control-text"><span>' + this.localize('Progress') + '</span>: 0%</span>'
      });
    }
  }, {
    key: 'updateDataAttr',
    value: function updateDataAttr() {
      var time = this.player_.scrubbing() ? this.player_.getCache().currentTime : this.player_.currentTime();

      this.el_.setAttribute('data-current-time', (0, _utilsFormatTimeJs2['default'])(time, this.player_.duration()));
    }
  }]);

  return PlayProgressBar;
})(_componentJs2['default']);

_componentJs2['default'].registerComponent('PlayProgressBar', PlayProgressBar);
exports['default'] = PlayProgressBar;
module.exports = exports['default'];