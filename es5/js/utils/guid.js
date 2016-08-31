/**
 * @file guid.js
 *
 * Unique ID for an element or function
 * @type {Number}
 * @private
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newGUID = newGUID;
var _guid = 1;

/**
 * Get the next unique ID
 *
 * @return {String}
 * @function newGUID
 */

function newGUID() {
  return _guid++;
}