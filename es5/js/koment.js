/**
 * @file koment.js
 */

/* global define */

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

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

require('videojs-externals');

var _utilsStylesheetJs = require('./utils/stylesheet.js');

var stylesheet = _interopRequireWildcard(_utilsStylesheetJs);

var _utilsDomJs = require('./utils/dom.js');

var Dom = _interopRequireWildcard(_utilsDomJs);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

require('./control-bar/koment-bar');

require('./component/koment-display');

require('./component/koment-list');

var Player = _videoJs2['default'].getComponent('Player');
var Component = _videoJs2['default'].getComponent('Component');

/**
 * Initialize the plugin.
 * @param options (optional) {object} configuration for the plugin
 */

var Koment = (function (_Component) {
  _inherits(Koment, _Component);

  function Koment(player, options, ready) {
    _classCallCheck(this, Koment);

    _get(Object.getPrototypeOf(Koment.prototype), 'constructor', this).call(this, player, options, ready);
  }

  _createClass(Koment, [{
    key: 'createEl',
    value: function createEl() {
      return _get(Object.getPrototypeOf(Koment.prototype), 'createEl', this).call(this, 'div', {
        className: 'koment-component'
      });
    }
  }, {
    key: 'komentsList',
    value: function komentsList(list) {
      if (list !== undefined) {
        this.komentsList_ = list;
        this.player_.addClass('koment');
      }
      return this.komentsList_;
    }
  }, {
    key: 'isKomentOn',
    value: function isKomentOn() {
      return this.toggleMenu_;
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu(toggle) {

      if (toggle !== undefined) {
        this.toggleMenu_ = !!toggle;
      } else {
        this.toggleMenu_ = !this.toggleMenu_;
      }

      if (this.toggleMenu_) {
        this.player_.addClass('koment-toggle-menu');
      } else {
        this.player_.removeClass('koment-toggle-menu');
        this.toggleEdit(this.toggleMenu_);
        this.toggleList(this.toggleMenu_);
      }

      this.trigger('togglemenu');
      return this;
    }
  }, {
    key: 'toggleEdit',
    value: function toggleEdit(toggle) {
      if (toggle !== undefined) {
        this.toggleEdit_ = !!toggle;
      } else {
        this.toggleEdit_ = !this.toggleEdit_;
      }

      if (this.toggleEdit_) {
        this.playBeforeEdit = !this.player_.paused();
        this.player_.pause();
        this.player_.addClass('koment-toggle-edit');
      } else {
        if (this.playBeforeEdit) {
          this.player_.play();
        }
        this.player_.removeClass('koment-toggle-edit');
      }

      return this;
    }
  }, {
    key: 'toggleList',
    value: function toggleList(toggle) {

      if (toggle !== undefined) {
        this.toggleList_ = !!toggle;
      } else {
        this.toggleList_ = !this.toggleList_;
      }

      if (this.toggleList_) {
        this.player_.addClass('koment-toggle-list');
      } else {
        this.player_.removeClass('koment-toggle-list');
      }

      return this;
    }
  }, {
    key: 'sendKoment',
    value: function sendKoment(kmt) {
      if (!kmt || !kmt.message) {
        return;
      }
      console.log('koment send ', kmt);
      this.komentsList_.unshift(kmt);
      this.toggleEdit(false);
      this.player_.trigger({ data: kmt, type: 'komentsupdated' });
    }
  }]);

  return Koment;
})(Component);

Koment.prototype.komentsList_ = []; // eslint-disable-line

Koment.prototype.options_ = {
  api: 'https://koment-api.herokuapp.com/api/koments',
  user: {}
};

// Add default styles
if (_globalWindow2['default'].koment_NO_DYNAMIC_STYLE !== true) {
  var style = Dom.$('.koment-styles-defaults');

  if (!style) {
    style = stylesheet.createStyleElement('koment-styles-defaults');
    var head = Dom.$('head');

    if (head) {
      head.insertBefore(style, head.firstChild);
    }
    stylesheet.setTextContent(style, '\n      .koment-js {\n      }\n    ');
  }
}

Component.registerComponent('Koment', Koment);

/**
 * add afrostream to videojs childs
 * @type {{}}
 */
_videoJs2['default'].options.children.push('koment');

Player.prototype.options_.children = Player.prototype.options_.children.concat(['komentDisplay', 'komentList', 'komentBar']);

exports['default'] = Koment;
module.exports = exports['default'];