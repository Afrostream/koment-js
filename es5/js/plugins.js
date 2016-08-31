/**
 * @file plugins.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _playerJs = require('./player.js');

var _playerJs2 = _interopRequireDefault(_playerJs);

/**
 * The method for registering a video.js plugin
 *
 * @param  {String} name The name of the plugin
 * @param  {Function} init The function that is run when the player inits
 * @method plugin
 */
var plugin = function plugin(name, init) {
  _playerJs2['default'].prototype[name] = init;
};

exports['default'] = plugin;
module.exports = exports['default'];