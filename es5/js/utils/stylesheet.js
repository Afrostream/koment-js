'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var createStyleElement = function createStyleElement(className) {
  var style = _globalDocument2['default'].createElement('style');

  style.className = className;

  return style;
};

exports.createStyleElement = createStyleElement;
var setTextContent = function setTextContent(el, content) {
  if (el.styleSheet) {
    el.styleSheet.cssText = content;
  } else {
    el.textContent = content;
  }
};
exports.setTextContent = setTextContent;