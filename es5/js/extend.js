'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsLog = require('./utils/log');

var _utilsLog2 = _interopRequireDefault(_utilsLog);

/*
 * @file extend.js
 *
 * A combination of node inherits and babel's inherits (after transpile).
 * Both work the same but node adds `super_` to the subClass
 * and Bable adds the superClass as __proto__. Both seem useful.
 */
var _inherits = function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (superClass) {
    // node
    subClass.super_ = superClass;
  }
};

/*
 * Function for subclassing using the same inheritance that
 * koment uses internally
 * ```js
 * var Button = koment.getComponent('Button');
 * ```
 * ```js
 * var MyButton = koment.extend(Button, {
 *   constructor: function(player, options) {
 *     Button.call(this, player, options);
 *   },
 *   onClick: function() {
 *     // doSomething
 *   }
 * });
 * ```
 */
var extendFn = function extendFn(superClass) {
  var subClassMethods = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var subClass = function subClass() {
    superClass.apply(this, arguments);
  };

  var methods = {};

  if (typeof subClassMethods === 'object') {
    if (typeof subClassMethods.init === 'function') {
      _utilsLog2['default'].warn('Constructor logic via init() is deprecated; please use constructor() instead.');
      subClassMethods.constructor = subClassMethods.init;
    }
    if (subClassMethods.constructor !== Object.prototype.constructor) {
      subClass = subClassMethods.constructor;
    }
    methods = subClassMethods;
  } else if (typeof subClassMethods === 'function') {
    subClass = subClassMethods;
  }

  _inherits(subClass, superClass);

  // Extend subObj's prototype with functions and other properties from props
  for (var _name in methods) {
    if (methods.hasOwnProperty(_name)) {
      subClass.prototype[_name] = methods[_name];
    }
  }

  return subClass;
};

exports['default'] = extendFn;
module.exports = exports['default'];