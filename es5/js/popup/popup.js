/**
 * @file popup.js
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

var _componentJs = require('../component.js');

var _componentJs2 = _interopRequireDefault(_componentJs);

var _utilsDomJs = require('../utils/dom.js');

var Dom = _interopRequireWildcard(_utilsDomJs);

var _utilsFnJs = require('../utils/fn.js');

var Fn = _interopRequireWildcard(_utilsFnJs);

var _utilsEventsJs = require('../utils/events.js');

var Events = _interopRequireWildcard(_utilsEventsJs);

/**
 * The Popup component is used to build pop up controls.
 *
 * @extends Component
 * @class Popup
 */

var Popup = (function (_Component) {
  _inherits(Popup, _Component);

  function Popup() {
    _classCallCheck(this, Popup);

    _get(Object.getPrototypeOf(Popup.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Popup, [{
    key: 'addItem',

    /**
     * Add a popup item to the popup
     *
     * @param {Object|String} component Component or component type to add
     * @method addItem
     */
    value: function addItem(component) {
      this.addChild(component);
      component.on('click', Fn.bind(this, function () {
        this.unlockShowing();
      }));
    }

    /**
     * Create the component's DOM element
     *
     * @return {Element}
     * @method createEl
     */
  }, {
    key: 'createEl',
    value: function createEl() {
      var contentElType = this.options_.contentElType || 'ul';

      this.contentEl_ = Dom.createEl(contentElType, {
        className: 'koment-menu-content'
      });

      var el = _get(Object.getPrototypeOf(Popup.prototype), 'createEl', this).call(this, 'div', {
        append: this.contentEl_,
        className: 'koment-menu'
      });

      el.appendChild(this.contentEl_);

      // Prevent clicks from bubbling up. Needed for Popup Buttons,
      // where a click on the parent is significant
      Events.on(el, 'click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      });

      return el;
    }
  }]);

  return Popup;
})(_componentJs2['default']);

_componentJs2['default'].registerComponent('Popup', Popup);
exports['default'] = Popup;
module.exports = exports['default'];