/**
 * @file browser.js
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var USER_AGENT = _globalWindow2['default'].navigator && _globalWindow2['default'].navigator.userAgent || '';
var webkitVersionMap = /AppleWebKit\/([\d.]+)/i.exec(USER_AGENT);
var appleWebkitVersion = webkitVersionMap ? parseFloat(webkitVersionMap.pop()) : null;

/*
 * Device is an iPhone
 *
 * @type {Boolean}
 * @constant
 * @private
 */
var IS_IPAD = /iPad/i.test(USER_AGENT);

exports.IS_IPAD = IS_IPAD;
// The Facebook app's UIWebView identifies as both an iPhone and iPad, so
// to identify iPhones, we need to exclude iPads.
// http://artsy.github.io/blog/2012/10/18/the-perils-of-ios-user-agent-sniffing/
var IS_IPHONE = /iPhone/i.test(USER_AGENT) && !IS_IPAD;
exports.IS_IPHONE = IS_IPHONE;
var IS_IPOD = /iPod/i.test(USER_AGENT);
exports.IS_IPOD = IS_IPOD;
var IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;

exports.IS_IOS = IS_IOS;
var IOS_VERSION = (function () {
  var match = USER_AGENT.match(/OS (\d+)_/i);

  if (match && match[1]) {
    return match[1];
  }
  return null;
})();

exports.IOS_VERSION = IOS_VERSION;
var IS_ANDROID = /Android/i.test(USER_AGENT);
exports.IS_ANDROID = IS_ANDROID;
var ANDROID_VERSION = (function () {
  // This matches Android Major.Minor.Patch versions
  // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
  var match = USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);

  if (!match) {
    return null;
  }

  var major = match[1] && parseFloat(match[1]);
  var minor = match[2] && parseFloat(match[2]);

  if (major && minor) {
    return parseFloat(match[1] + '.' + match[2]);
  } else if (major) {
    return major;
  }
  return null;
})();

exports.ANDROID_VERSION = ANDROID_VERSION;
// Old Android is defined as Version older than 2.3, and requiring a webkit version of the android browser
var IS_OLD_ANDROID = IS_ANDROID && /webkit/i.test(USER_AGENT) && ANDROID_VERSION < 2.3;
exports.IS_OLD_ANDROID = IS_OLD_ANDROID;
var IS_NATIVE_ANDROID = IS_ANDROID && ANDROID_VERSION < 5 && appleWebkitVersion < 537;

exports.IS_NATIVE_ANDROID = IS_NATIVE_ANDROID;
var IS_FIREFOX = /Firefox/i.test(USER_AGENT);
exports.IS_FIREFOX = IS_FIREFOX;
var IS_EDGE = /Edge/i.test(USER_AGENT);
exports.IS_EDGE = IS_EDGE;
var IS_CHROME = !IS_EDGE && /Chrome/i.test(USER_AGENT);
exports.IS_CHROME = IS_CHROME;
var IS_IE8 = /MSIE\s8\.0/.test(USER_AGENT);
exports.IS_IE8 = IS_IE8;
var IE_VERSION = (function (result) {
  return result && parseFloat(result[1]);
})(/MSIE\s(\d+)\.\d/.exec(USER_AGENT));

exports.IE_VERSION = IE_VERSION;
var TOUCH_ENABLED = !!('ontouchstart' in _globalWindow2['default'] || _globalWindow2['default'].DocumentTouch && _globalDocument2['default'] instanceof _globalWindow2['default'].DocumentTouch);
exports.TOUCH_ENABLED = TOUCH_ENABLED;
var BACKGROUND_SIZE_SUPPORTED = ('backgroundSize' in _globalDocument2['default'].createElement('video').style);
exports.BACKGROUND_SIZE_SUPPORTED = BACKGROUND_SIZE_SUPPORTED;